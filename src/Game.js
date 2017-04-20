import React, { Component } from 'react'
import Board from './Board'

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleClick(e) {
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this)}>Restart</button>
        <Board />
      </div>
    )
  }
}
