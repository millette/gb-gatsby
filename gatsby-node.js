/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// core
const { resolve } = require("path")

// npm
const { createFilePath } = require("gatsby-source-filesystem")
const visit = require("unist-util-visit")
const lunr = require("lunr")
require("lunr-languages/lunr.stemmer.support")(lunr)
require("lunr-languages/lunr.fr")(lunr)

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
            headings(depth: h1) {
              value
            }
          }
        }
      }
    }
  `).then(({ data: { allMarkdownRemark: { edges } } }) => {
    const component = resolve("./src/templates/blog-post.js")

    // function () since we want lunr's this
    const idx = lunr(function() {
      this.use(lunr.fr)
      this.ref("slug")
      this.field("value", { boost: 2 })
      this.field("h1", { boost: 5 })

      edges.forEach(({ node: { headings, htmlAst, fields: { slug } } }) => {
        const h1 = headings.value
        visit(htmlAst, { type: "text" }, ({ value }) => {
          value = value.trim()
          if (value) this.add({ h1, value, slug })
        })
      })
    })

    edges.forEach(({ node: { fields: { slug } } }) =>
      createPage({
        path: slug,
        component,
        context: {
          slug,
          idx,
        },
      })
    )
  })
}
