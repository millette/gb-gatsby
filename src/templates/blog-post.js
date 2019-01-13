// npm
import React, { Component } from "react"
import { graphql, Link } from "gatsby"

// self
import "./blog-post.css"
import { lunr } from "../../utils"
import Layout from "../components/layout"
import Menubar from "../components/menubar"
import SEO from "../components/seo"

// FIXME: pathPrefix should be taken from config
const pathPrefix = "/gb-gatsby"

class Page extends Component {
  constructor(props) {
    super(props)
    const pages = props.pageContext.pages

    const titles = {}
    pages.forEach(({ href, value }) => {
      titles[href] = value
    })

    this.state = {
      search: "",
      titles,
    }

    this.clicky = this.clicky.bind(this)
    this.search = this.search.bind(this)
    this.clearSearch = this.clearSearch.bind(this)

    // const pageN = pages.map(({ href }) => href).indexOf(props.location.pathname)
    const pageN = pages
      .map(({ href }) => href)
      .indexOf(props.location.pathname.replace(pathPrefix, ""))

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

  search(ev) {
    ev.persist()
    const search = ev.target.value
    if (!search) return this.setState({ error: false, search, results: false })

    this.setState({ search })
    if (!this.state.idx) {
      // FIXME: Adapt to pathPrefix (in dev)
      // return fetch(`/search-index.json`)
      return fetch(`${pathPrefix}/search-index.json`)
        .then((res) => res.ok && res.json())
        .then((idx) => {
          if (!idx) throw new Error("Couldn't load search index.")
          this.setState({ idx: lunr.Index.load(idx) })
          return this.search(ev)
        })
        .catch((error) => this.setState({ error }))
    }

    try {
      this.setState({
        error: false,
        search,
        results: this.state.idx
          .search(ev.target.value)
          .map(({ ref }) => {
            // skip current page
            if (ref === document.location.pathname) return false

            // skip if page isn't linked from the summary (where the titles come from)
            if (!this.state.titles[ref]) return false
            return { ref, title: this.state.titles[ref] }
          })
          .filter(Boolean)
          .slice(0, 7),
      })
    } catch (error) {
      this.setState({ search, error })
    }
  }

  componentDidMount() {
    const aEl = document.querySelector(
      `#summary-toc .md2html a[href="${document.location.pathname}"]`
    )
    if (aEl) {
      aEl.classList.add("has-text-info", "has-text-weight-bold")
      aEl.scrollIntoView(false)
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
                className={`column is-narrow content${
                  this.state.hidden ? " is-hidden" : ""
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
                        onChange={this.search}
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

                <div className="md2html" dangerouslySetInnerHTML={{ __html }} />
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
                    <div
                      className="main-content"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
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
