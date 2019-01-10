// npm
import React, { Component } from "react"
import { graphql } from "gatsby"

// self
import Layout from "../components/layout"
import Menubar from "../components/menubar"
import SEO from "../components/seo"
import "./blog-post.css"

class Page extends Component {
  constructor(props) {
    super(props)
    this.state = { hidden: false }
    this.clicky = this.clicky.bind(this)
  }

  clicky(ev) {
    const hidden = !this.state.hidden
    if (hidden)
      setTimeout(() => {
        document.querySelector("#summary-toc").className = "is-hidden"
      }, 300)
    this.setState({ hidden })
  }

  render() {
    const data = this.props.data
    return (
      <Layout>
        <SEO title={data.markdownRemark.headings[0].value} />
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div
                id="summary-toc"
                className={`column is-narrow content ${
                  this.state.hidden ? "slide-out" : "slide-in"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: data.summary.html }} />
              </div>
              <div className="column">
                <Menubar clicky={this.clicky} />
                <div
                  className="content"
                  style={{ paddingLeft: "1rem" }}
                  dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
                />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

export default Page

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
