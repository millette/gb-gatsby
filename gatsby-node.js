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
// const visit = require("unist-util-visit")

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
            htmlAst
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
      // this.metadataWhitelist = ['position']
      // let n = 0

      // edges.forEach(({ node: { headings, rawMarkdownBody, htmlAst, fields: { slug } } }) => {
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
          // console.log('OOO:', o)
          this.add(o)
        }
      )
      // const h1 = headings.value
      // ++n
      // if (h1) this.add({ h1, slug, id: `${slug}:${n}` })
      // if (h1) this.add({ h1, slug, value: rawMarkdownBody })
      /*
        visit(htmlAst, { type: "text" }, ({ value }) => {
          value = value.trim()
          if (value) {
            ++n
            this.add({ value, slug, id: `${slug}:${n}` })
          }
        })
        */
      // })
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
