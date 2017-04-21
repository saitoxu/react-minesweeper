import React, { Component } from 'react'
import Cell from './Cell'

export default class Row extends Component {
  renderCells() {
    const cells = []
    this.props.row.forEach((cell, i) => {
      cells.push(<Cell key={i} cell={cell} />)
    })
    return cells
  }

  render() {
    return (
      <div>
        {this.renderCells()}
      </div>
    )
  }
}
