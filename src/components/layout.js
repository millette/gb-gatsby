// npm
import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet"

// Themes from https://jenil.github.io/bulmaswatch/
// cerulean cosmo cyborg darkly default flatly journal
// litera lumen lux materia minty nuclear pulse sandstone
// simplex slate solar spacelab superhero united yeti
// First one is the default
const bulmaStyles = ["flatly", "darkly", "superhero"]

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            author
          }
        }
      }
    `}
    render={({
      site: {
        siteMetadata: { title, author },
      },
    }) => (
      <>
        <Helmet>
          {bulmaStyles.map((title, i) => (
            <link
              key={title}
              rel={`${i ? "alternate " : ""}stylesheet`}
              href={`https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.7.2/${title}/bulmaswatch.min.css`}
              title={title}
            />
          ))}
        </Helmet>
        {children}
        <footer className="footer">
          <div className="container is-fluid has-text-centered">
            {title}
            <br />© {new Date().getFullYear()} {author}
          </div>
        </footer>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
