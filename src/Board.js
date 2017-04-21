import React, { Component } from 'react'
import Row from './Row'
import './Board.css'

export default class Board extends Component {
  renderRows() {
    const rows = []
    this.props.board.forEach((row, i) => {
      rows.push(<Row key={i} row={row} />)
    })
    return rows
  }

  render() {
    return (
      <div className="board">
        {this.renderRows()}
      </div>
    )
  }
}
