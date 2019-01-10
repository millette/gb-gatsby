// npm
import React from "react"
import { graphql } from "gatsby"

// self
import Layout from "../components/layout"
import Menubar from "../components/menubar"
import SEO from "../components/seo"

const style1 = {
  overflowY: "scroll",
  height: "75vh",
  position: "sticky",
  top: "5vh",
  paddingRight: "2rem",
}

const style2 = {
  paddingLeft: "1rem",
}

export default ({ data }) => (
  <Layout>
    <SEO title={data.markdownRemark.headings[0].value} />
    <section className="section">
      <div className="container is-fluid">
        <div className="columns">
          <div className="column is-narrow content">
            <div
              style={style1}
              dangerouslySetInnerHTML={{ __html: data.summary.html }}
            />
          </div>
          <div className="column">
            <Menubar />
            <div
              className="content"
              style={style2}
              dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
            />
          </div>
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
