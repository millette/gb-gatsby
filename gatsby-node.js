"use strict"

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// core
const { resolve } = require("path")
const { writeFile } = require("fs")

// npm
const { createFilePath } = require("gatsby-source-filesystem")
const visit = require("unist-util-visit")

// self
const { lunr } = require("./utils")

const writeFileP = (file, data) =>
  new Promise((resolve, reject) =>
    writeFile(file, JSON.stringify(data), (err) =>
      err ? reject(err) : resolve()
    )
  )

const allPages = (ast) => {
  const pages = []
  const visitor = ({ properties: { href }, children: [{ value }] }) =>
    pages.push({ href, value })
  visit(ast, { tagName: "a" }, visitor)
  return pages
}

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
      const nodes = edges.map(({ node }) => node)
      const component = resolve("./src/templates/blog-post.js")
      const pages = allPages(htmlAst)

      nodes.forEach(({ fields: { slug } }) =>
        createPage({
          path: slug,
          component,
          context: {
            slug,
            pages,
          },
        })
      )

      return writeFileP(
        "public/search-index.json",
        // function () since we want lunr's this
        lunr(function() {
          this.use(lunr.fr)
          this.ref("slug")
          this.field("rawMarkdownBody", { boost: 3 })
          this.field("slug", { boost: 4 })
          this.field("value", { boost: 5 })

          nodes.forEach(
            ({ headings: [{ value }], rawMarkdownBody, fields: { slug } }) =>
              this.add({
                value,
                slug,
                rawMarkdownBody: rawMarkdownBody.replace(
                  /[0-9 ';:&#,.!?/()\[\]]+/g,
                  " "
                ),
              })
          )
        })
      )
    }
  )
}
