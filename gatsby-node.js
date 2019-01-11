"use strict"

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// core
const { resolve } = require("path")

// npm
const { createFilePath } = require("gatsby-source-filesystem")

// self
const { lunr } = require("./utils")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type !== "MarkdownRemark") return
  let value = createFilePath({ node, getNode, basePath: "pages" })
  if (value === "/README/") value = "/"
  createNodeField({
    node,
    name: "slug",
    value,
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    query {
      allMarkdownRemark(filter: { fields: { slug: { ne: "/SUMMARY/" } } }) {
        totalCount
        edges {
          node {
            fields {
              slug
            }
            rawMarkdownBody
            headings(depth: h1) {
              value
            }
          }
        }
      }
    }
  `).then(({ data: { allMarkdownRemark: { edges } } }) => {
    const component = resolve("./src/templates/blog-post.js")
    const titles = {}

    // function () since we want lunr's this
    const idx = lunr(function() {
      this.use(lunr.fr)
      this.ref("slug")
      this.field("rawMarkdownBody", { boost: 3 })
      this.field("slug", { boost: 4 })
      this.field("value", { boost: 5 })

      edges.forEach(
        ({
          node: {
            headings: [{ value }],
            rawMarkdownBody,
            fields: { slug },
          },
        }) => {
          titles[slug] = value
          const o = { value, slug, rawMarkdownBody }
          this.add(o)
        }
      )
    })

    edges.forEach(({ node: { fields: { slug } } }) =>
      createPage({
        path: slug,
        component,
        context: {
          slug,
          idx,
          titles,
        },
      })
    )
  })
}
