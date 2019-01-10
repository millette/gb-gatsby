// npm
import React from "react"

// self
import "./burger.css"

// Thanks https://openclipart.org/detail/304239/menu
export default ({ onClick, size = 44, thickness = 10 }) => (
  <svg
    className={`button is-text is-small burger${onClick ? " clicky" : ""}`}
    onClick={onClick}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
  >
    <path
      strokeWidth={thickness}
      strokeLinecap="round"
      d="M15 20L85 20M15 50L85 50M15 80L85 80"
    />
  </svg>
)
