// npm
import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet"

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

          <link
            rel="alternate stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.7.2/cerulean/bulmaswatch.min.css"
            title="cerulean"
          />

          <link
            rel="alternate stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.7.2/darkly/bulmaswatch.min.css"
            title="darkly"
          />

          <link
            rel="alternate stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulmaswatch/0.7.2/flatly/bulmaswatch.min.css"
            title="flatly"
          />
        </Helmet>
        <div>
          {children}
          <footer>© {new Date().getFullYear()}</footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
