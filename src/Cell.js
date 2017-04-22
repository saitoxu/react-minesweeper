import React, { Component } from 'react'

export default class Cell extends Component {
  _handleClick(e) {
    e.preventDefault()
    this.props.onClick(this.props.x, this.props.y)
  }

  _handleRightClick(e) {
    e.preventDefault()
    this.props.onRightClick(this.props.x, this.props.y)
  }

  render() {
    return (
      <div
        style={{width: 30, height: 30, backgroundColor: 'lightgray', border: 'solid 1px darkgray'}}
        onClick={this._handleClick.bind(this)}
        onContextMenu={this._handleRightClick.bind(this)}
      >
      </div>
    )
  }
}
