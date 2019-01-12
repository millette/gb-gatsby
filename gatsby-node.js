"use strict"

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// core
const { resolve } = require("path")
const { writeFile } = require("fs")

const writeFileP = (file, data) =>
  new Promise((resolve, reject) =>
    writeFile(file, JSON.stringify(data), (err) =>
      err ? reject(err) : resolve()
    )
  )

// npm
const { createFilePath } = require("gatsby-source-filesystem")
const visit = require("unist-util-visit")

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
      summary: markdownRemark(fields: { slug: { eq: "/SUMMARY/" } }) {
        htmlAst
      }

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
  `).then(
    ({
      data: {
        summary: { htmlAst },
        allMarkdownRemark: { edges },
      },
    }) => {
      const component = resolve("./src/templates/blog-post.js")
      const pages = []

      const visitor = ({ properties: { href }, children: [{ value }] }) =>
        pages.push({ href, value })
      visit(htmlAst, { tagName: "a" }, visitor)

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
          }) => this.add({ value, slug, rawMarkdownBody })
        )
      })

      edges.forEach(({ node: { fields: { slug } } }) =>
        createPage({
          path: slug,
          component,
          context: {
            slug,
            // idx,
            pages,
          },
        })
      )
      return writeFileP("public/search-index.json", idx)
    }
  )
}
