// npm
import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet"

const bulmaStyles = [
  "cerulean",
  "cosmo",
  "cyborg",
  "darkly",
  "flatly",
  "journal",
  "litera",
  "lumen",
  "lux",
  "materia",
  "minty",
  "nuclear",
  "pulse",
  "sandstone",
  "simplex",
  "slate",
  "solar",
  "spacelab",
  "superhero",
  "united",
  "yeti",
]

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data) => (
      <>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css"
            title="default"
            integrity="sha256-2pUeJf+y0ltRPSbKOeJh09ipQFYxUdct5nTY6GAXswA="
            crossorigin="anonymous"
          />
          {bulmaStyles.map((title) => (
            <link
              key={title}
              rel="alternate stylesheet"
              href={`https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.7.2/${title}/bulmaswatch.min.css`}
              title={title}
            />
          ))}
        </Helmet>
        {children}
        <footer className="footer">
          <div className="container is-fluid has-text-centered">
            © {new Date().getFullYear()}
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
