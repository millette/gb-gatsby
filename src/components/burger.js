// npm
import React from "react"

import "./burger.css"

export default ({ onClick, size = "24px", color = "#000", thickness = 12 }) => {
  return (
    <svg
      className={`burger${onClick ? " clicky" : ""}`}
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
        stroke={color}
        d="M15 20L85 20M15 50L85 50M15 80L85 80"
      />
    </svg>
  )
}
