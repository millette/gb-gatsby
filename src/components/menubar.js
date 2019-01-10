// npm
import React, { Component } from "react"

// self
import Burger from "./burger.js"

const StyleButton = ({ title, active, pick }) => (
  <button
    onClick={pick}
    className={`button is-small${active ? " is-primary" : ""}`}
  >
    {title}
  </button>
)

class Menubar extends Component {
  constructor(props) {
    super(props)
    this.state = { hidden: false, styles: [], buttons: [] }
    this.pick = this.pick.bind(this)
    this.clicky = this.clicky.bind(this)
  }

  clicky(ev) {
    console.log("CLICKY", ev)
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
      <div>
        <div className="buttons">
          <Burger onClick={this.clicky} />
          {this.state.buttons.map((s, i) => (
            <StyleButton key={i} {...s} pick={this.pick} />
          ))}
        </div>
      </div>
    )
  }
}

export default Menubar
