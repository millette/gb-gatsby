// npm
import React, { Component } from "react"
import { graphql } from "gatsby"
import visit from "unist-util-visit"
import lunr from "lunr"

// self
import Layout from "../components/layout"
import Menubar from "../components/menubar"
import SEO from "../components/seo"
import "./blog-post.css"

// are these two necessary?
require("lunr-languages/lunr.stemmer.support")(lunr)
require("lunr-languages/lunr.fr")(lunr)

class Page extends Component {
  constructor(props) {
    // props.idx = lunr.Index.load(props.pageContext.idx)
    super(props)
    const idx = lunr.Index.load(props.pageContext.idx)
    this.state = { hidden: false, idx }
    this.clicky = this.clicky.bind(this)
    this.change = this.change.bind(this)

    this.pages = []
    const visitor = ({ properties: { href }, children: [{ value }] }) =>
      this.pages.push({ href, value })
    visit(props.data.summary.htmlAst, { tagName: "a" }, visitor)
  }

  clicky(ev) {
    const hidden = !this.state.hidden
    if (hidden)
      setTimeout(() => {
        document.querySelector("#summary-toc").className = "is-hidden"
      }, 300)
    this.setState({ hidden })
  }

  componentDidMount() {
    const idx = this.pages
      .map(({ href }) => href)
      .indexOf(document.location.pathname)
    if (idx === -1) return
    const prev = idx - 1
    const next = idx + 1
    this.setState({
      prev: prev >= 0 && this.pages[prev],
      next: next < this.pages.length && this.pages[next],
    })
  }

  change(ev) {
    // console.log('CHANGE:', ev.target.value)
    // this.setState({ results: this.props.idx.search('+python +github') })
    try {
      const results = this.state.idx.search(ev.target.value)
      this.setState({ results })
    } catch (e) {
      console.error("SEARCH ERROR", e)
    }
  }

  render() {
    const {
      summary: { html },
      markdownRemark,
    } = this.props.data

    // this.setState({ results: this.props.idx.search('+python +github') })

    return (
      <Layout>
        <SEO title={markdownRemark.headings[0].value} />
        <section className="section">
          <div className="container is-fluid">
            <input onChange={this.change} />
            <pre>{JSON.stringify(this.state.results, null, "  ")}</pre>
          </div>
        </section>
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div
                id="summary-toc"
                className={`column is-narrow content ${
                  this.state.hidden ? "slide-out" : "slide-in"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
              <div className="column">
                <Menubar
                  prev={this.state.prev}
                  next={this.state.next}
                  clicky={this.clicky}
                />
                <div
                  className="content"
                  style={{ paddingLeft: "1rem" }}
                  dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
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
      htmlAst
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
