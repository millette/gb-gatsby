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
      styles.forEach(({ title, disabled }) =>
        buttons.push({ title, active: !disabled })
      )
      this.setState({ styles, buttons })
    }, 0)
  }

  pick(ev) {
    // prevents some flickering
    const buttons = this.state.buttons
    this.state.styles.forEach((el, i) => {
      if (el.title !== ev.target.innerText) el.disabled = true
      buttons[i].active = el.title === ev.target.innerText
    })
    this.setState({ buttons })
    this.state.styles.forEach((el) => {
      el.disabled = el.title !== ev.target.innerText
    })
  }

  render() {
    return (
      <div>
        <Burger onClick={this.clicky} />
        <div className="buttons">
          {this.state.buttons.map((s, i) => (
            <StyleButton key={i} {...s} pick={this.pick} />
          ))}
        </div>
      </div>
    )
  }
}

export default Menubar
