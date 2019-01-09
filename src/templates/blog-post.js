// npm
import React from "react"
import { graphql, Link } from "gatsby"
// import rehypeReact from "rehype-react"
// import visit from 'unist-util-visit'

// self
import Layout from "../components/layout"

/*
const renderAst = new rehypeReact({
  createElement: React.createElement,
  // components: { "interactive-counter": Counter },
}).Compiler

const visitor = (node) => {
  // console.log('VIS #0:', node)
  if (node.properties && node.properties.href) {
    node.properties.href.replace(/\.md$/, '')
  }
  // console.log('VIS #1:', node)
}
*/

export default ({ data }) => {
  const { html, htmlAst, ...rest } = data.markdownRemark

  // <div dangerouslySetInnerHTML={{ __html: post.html }} />
  // {renderAst(htmlAst)}
  // const g = visit(htmlAst, { tagName: 'a' }, visitor)

  return (
    <Layout>
      <Link to="SUMMARY/">Sommaire</Link>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <pre>{JSON.stringify(rest, null, "  ")}</pre>
      <pre>{JSON.stringify(htmlAst, null, "  ")}</pre>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      wordCount {
        paragraphs
        sentences
        words
      }
      fileAbsolutePath
      excerpt
      timeToRead
    }
  }
`
