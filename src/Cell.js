import React, { Component } from 'react'
import Flag from 'react-icons/lib/fa/flag'
import Bomb from 'react-icons/lib/fa/certificate'

const baseStyle = {
  width: 24,
  height: 24,
  backgroundColor: 'lightgray',
  border: 'outset 4px white',
  textAlign: 'center',
  lineHeight: '24px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const openStyle = {
  width: 30,
  height: 30,
  lineHeight: '30px',
  backgroundColor: 'lightgray',
  border: 'solid 1px darkgray'
}

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
    let content = this.props.cell.flagged ? <Flag /> : ''
    let style = baseStyle
    if (this.props.cell.open) {
      style = Object.assign({}, style, openStyle)
      if (this.props.cell.bomb) {
        content = <Bomb style={{ marginTop: -3 }} />
        style = Object.assign({}, style, { backgroundColor: 'red' })
      } else {
        if (this.props.cell.bombCount > 0) {
          content = this.props.cell.bombCount
          switch (content) {
            case 1:
              style = Object.assign({}, style, { color: 'blue' })
              break
            case 2:
              style = Object.assign({}, style, { color: 'green' })
              break
            case 3:
              style = Object.assign({}, style, { color: 'red' })
              break
            case 4:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 5:
              style = Object.assign({}, style, { color: 'darkred' })
              break
            case 6:
              style = Object.assign({}, style, { color: 'deepskyblue' })
              break
            case 7:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 8:
              style = Object.assign({}, style, { color: 'gray' })
              break
            default:
              break
          }
        } else {
          content = ''
        }
      }
    }
    return (
      <div
        style={style}
        onClick={this._handleClick.bind(this)}
        onContextMenu={this._handleRightClick.bind(this)}
      >
        {content}
      </div>
    )
  }
}
