import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <div
    style666={{
      background: "rebeccapurple",
      marginBottom: "1.45rem",
    }}
  >
    <div
      style666={{
        margin: "0 auto",
        maxWidth: 960,
        padding: "1.45rem 1.0875rem",
      }}
    >
      <h1 style666={{ margin: 0 }}>
        <Link
          to="/"
          style666={{
            color: "white",
            textDecoration: "none",
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: "",
}

export default Header
