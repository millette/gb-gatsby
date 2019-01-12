// npm
import React, { Component } from "react"
import { graphql, Link } from "gatsby"

// self
import "./blog-post.css"
import { lunr } from "../../utils"
import Layout from "../components/layout"
import Menubar from "../components/menubar"
import SEO from "../components/seo"

class Page extends Component {
  constructor(props) {
    super(props)
    const idx = lunr.Index.load(props.pageContext.idx)
    const pages = props.pageContext.pages
    const titles = pages.map(({ value }) => value)
    this.clicky = this.clicky.bind(this)
    this.change = this.change.bind(this)
    this.clearSearch = this.clearSearch.bind(this)

    this.state = {
      hidden: false,
      search: "",
      idx,
      titles,
    }

    const pageN = pages.map(({ href }) => href).indexOf(props.location.pathname)

    if (pageN !== -1) {
      const prev = pageN - 1
      const next = pageN + 1
      if (prev >= 0) this.state.prev = pages[prev]
      if (next < pages.length) this.state.next = pages[next]
    }
  }

  clearSearch(ev) {
    const ret = { results: false, error: false }
    if (!ev.currentTarget.classList.contains("delete")) ret.search = ""
    this.setState(ret)
  }

  clicky(ev) {
    const hidden = !this.state.hidden
    if (hidden)
      setTimeout(() => {
        document.querySelector("#summary-toc").className = "is-hidden"
      }, 300)
    this.setState({ hidden })
  }

  change(ev) {
    const search = ev.target.value
    if (!search) return this.setState({ error: false, search, results: false })
    try {
      this.setState({
        error: false,
        search,
        results: this.state.idx
          .search(ev.target.value)
          .map(({ ref }) => ({ ref, title: this.state.titles[ref] }))
          .slice(0, 7),
      })
    } catch (error) {
      this.setState({ search, error })
    }
  }

  render() {
    const {
      html,
      headings: [{ value }],
    } = this.props.data.markdownRemark

    const __html = this.props.data.summary.html

    return (
      <Layout>
        <SEO title={value} />
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div
                id="summary-toc"
                className={`column is-narrow content ${
                  this.state.hidden ? "slide-out" : "slide-in"
                }`}
              >
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label">Chercher</label>
                  </div>
                  <div className="field-body">
                    <p className="control is-expanded has-icons-right">
                      <input
                        className="input is-small"
                        type="text"
                        onChange={this.change}
                        value={this.state.search}
                      />

                      <span
                        onClick={this.clearSearch}
                        className="icon is-right"
                      >
                        <i className="delete is-small" />
                      </span>
                    </p>
                  </div>
                </div>

                <div dangerouslySetInnerHTML={{ __html }} />
              </div>
              <div className="column">
                <Menubar
                  prev={this.state.prev}
                  next={this.state.next}
                  clicky={this.clicky}
                />

                <div className="content" style={{ paddingLeft: "1rem" }}>
                  {this.state.results &&
                    this.state.results.length > 0 &&
                    !this.state.error && (
                      <div className="notification is-info">
                        <button onClick={this.clearSearch} className="delete" />
                        <ol>
                          {this.state.results.map(({ ref, title }) => (
                            <li key={ref.slice(1, -1)}>
                              <Link to={ref}>{title}</Link>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                  {this.state.results &&
                    !this.state.results.length &&
                    !this.state.error && (
                      <p className="notification is-warning">
                        <button onClick={this.clearSearch} className="delete" />
                        Aucun résultat.
                      </p>
                    )}

                  {this.state.error && (
                    <p className="notification is-danger">
                      <button onClick={this.clearSearch} className="delete" />
                      {this.state.error.toString()}
                    </p>
                  )}

                  {!this.state.results && !this.state.error && (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  )}
                </div>
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
