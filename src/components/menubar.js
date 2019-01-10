// npm
import React, { Component } from "react"
import { Link } from "gatsby"

// self
import Burger from "./burger.js"

const style = {
  position: "sticky",
  top: 0,
  zIndex: 100,
}

const StyleButton = ({ title, active, pick }) => (
  <button onClick={pick} className={`button${active ? " is-primary" : ""}`}>
    {title}
  </button>
)

class Menubar extends Component {
  constructor(props) {
    super(props)
    this.state = { styles: [], buttons: [] }
    this.pick = this.pick.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      const styles = document.querySelectorAll(
        "link[rel='stylesheet'],link[rel='alternate stylesheet']"
      )
      const buttons = []
      styles.forEach(
        ({ title, disabled }) =>
          title && buttons.push({ title, active: !disabled })
      )

      document.querySelector("body").className = `bulma-${buttons[0].title}`
      this.setState({ styles, buttons })
    }, 0)
  }

  pick(ev) {
    // prevents some flickering
    const buttons = this.state.buttons
    let i = 0
    this.state.styles.forEach((el) => {
      if (!el.title) return
      if (el.title === ev.target.innerText) {
        const ggg = document.querySelector("body")
        ggg.className = `bulma-${el.title}`
      } else {
        el.disabled = true
      }
      buttons[i].active = el.title === ev.target.innerText
      ++i
    })
    this.setState({ buttons })
    this.state.styles.forEach((el) => {
      if (!el.title) return
      el.disabled = el.title !== ev.target.innerText
    })
  }

  render() {
    return (
      <nav
        style={style}
        className="pagination is-centered notification is-info is-radiusless"
        role="navigation"
        aria-label="pagination"
      >
        {this.props.prev && (
          <Link
            title={this.props.prev.value}
            className="pagination-previous"
            to={this.props.prev.href}
          >
            Page précédente
          </Link>
        )}
        {this.props.next && (
          <Link
            title={this.props.next.value}
            className="pagination-next"
            to={this.props.next.href}
          >
            Page suivante
          </Link>
        )}
        <ul className="pagination-list">
          <Burger onClick={this.props.clicky} />
          {this.state.buttons.map((s, i) => (
            <StyleButton key={i} {...s} pick={this.pick} />
          ))}
        </ul>
      </nav>
    )
  }
}

export default Menubar
