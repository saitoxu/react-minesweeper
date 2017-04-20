import React, { Component } from 'react'
import Board from './Board'

const BOARD_SIZE = 9
const BOMB_NUM = 10

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: this.initBoard()
    }
  }

  initBoard() {
    const bombPlaces = this._initBombPlaces()
    console.log(bombPlaces)
    return {}
  }

  _initBombPlaces() {
    const bombPlaces = []
    while (bombPlaces.length < BOMB_NUM) {
      const x = Math.floor(Math.random() * BOARD_SIZE)
      const y = Math.floor(Math.random() * BOARD_SIZE)
      if (bombPlaces.length === 0) {
        bombPlaces.push({ x: x, y: y })
      } else {
        const duplicated = bombPlaces.filter((place) => {
          return place.x === x && place.y === y
        }).length > 0
        if (!duplicated) {
          bombPlaces.push({ x: x, y: y })
        }
      }
    }
    return bombPlaces
  }

  handleClick(e) {
    e.preventDefault()
  }

  render() {
    const board = this.state.board
    return (
      <div>
        <button onClick={this.handleClick.bind(this)}>Restart</button>
        <Board board={board} />
      </div>
    )
  }
}
