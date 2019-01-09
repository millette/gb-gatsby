// npm
import React from "react"
import { graphql } from "gatsby"

// self
import Layout from "../components/layout"

export default ({ data }) => (
  <Layout>
    <div
      style={{ float: "left" }}
      dangerouslySetInnerHTML={{ __html: data.summary.html }}
    />
    <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
  </Layout>
)

export const query = graphql`
  query($slug: String!) {
    summary: markdownRemark(fields: { slug: { eq: "/SUMMARY/" } }) {
      html
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      wordCount {
        paragraphs
        sentences
        words
      }
      excerpt
      timeToRead
    }
  }
`
