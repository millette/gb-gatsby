// npm
import React from "react"
import { graphql } from "gatsby"

// self
import Layout from "../components/layout"
import SEO from "../components/seo"

const style1 = {
  overflowY: "scroll",
  height: "90vh",
  position: "sticky",
  top: "5vh",
  paddingRight: "1rem",
}

const style2 = {
  paddingLeft: "1rem",
}

export default ({ data }) => (
  <Layout>
    <SEO title={data.markdownRemark.headings[0].value} />
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div
            className="column is-narrow"
            style={style1}
            dangerouslySetInnerHTML={{ __html: data.summary.html }}
          />
          <div
            className="column"
            style={style2}
            dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
          />
        </div>
      </div>
    </section>
  </Layout>
)

export const query = graphql`
  query($slug: String!) {
    summary: markdownRemark(fields: { slug: { eq: "/SUMMARY/" } }) {
      html
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      headings(depth: h1) {
        value
      }
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
