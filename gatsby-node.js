/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// core
const { resolve } = require("path")

// npm
const { createFilePath } = require("gatsby-source-filesystem")

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
          }
        }
      }
    }
  `).then(({ data: { allMarkdownRemark: { edges } } }) =>
    edges.forEach(({ node: { fields: { slug } } }) =>
      createPage({
        path: slug,
        component: resolve("./src/templates/blog-post.js"),
        context: {
          slug,
        },
      })
    )
  )
}
