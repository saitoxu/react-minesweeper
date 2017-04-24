import React, { Component } from 'react'
import Board from './Board'

const BOARD_SIZE = 9
const BOMB_NUM = 10

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: this._initBoard()
    }
  }

  _initBoard() {
    const bombPlaces = this._initBombPlaces()
    const board = Array.from(
      new Array(BOARD_SIZE), () => new Array(BOARD_SIZE).fill(
        { bomb: false, bombCount: 0, open: false, flagged: false }
      )
    )
    for (let place of bombPlaces) {
      board[place.x][place.y] = Object.assign({}, board[place.x][place.y], { bomb: true })
    }
    return board
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
    this.setState({
      board: this._initBoard()
    })
  }

  handleClickCell(x, y) {
    this._open(x, y)
  }

  handleRightClickCell(x, y) {
    this._toggleFlag(x, y)
  }

  _open(x, y) {
    const board = [].concat(this.state.board)
    if (!board[x][y].open) {
      let bombCount = 0
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if ((i < 0 || i >= BOARD_SIZE) ||
              (j < 0 || j >= BOARD_SIZE) ||
              (i === x && j === y)) {
            continue
          }
          if (board[i][j].bomb) {
            bombCount++
          }
        }
      }
      board[x][y] = Object.assign({}, board[x][y], { open: true, bombCount: bombCount })
      this.setState({ board: board })

      if (bombCount === 0) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= BOARD_SIZE) ||
                (j < 0 || j >= BOARD_SIZE) ||
                (i === x && j === y)) {
              continue
            }
            this._open(i, j)
          }
        }
      }
    }
  }

  _toggleFlag(x, y) {
    const board = [].concat(this.state.board)
    if (!board[x][y].flagged) {
      board[x][y] = Object.assign({}, board[x][y], { flagged: true })
    } else {
      board[x][y] = Object.assign({}, board[x][y], { flagged: false })
    }
    this.setState({ board: board })
  }

  render() {
    const board = this.state.board
    return (
      <div>
        <h1>Minesweeper</h1>
        <button onClick={this.handleClick.bind(this)}>Restart</button>
        <Board
          board={board}
          onClick={this.handleClickCell.bind(this)}
          onRightClick={this.handleRightClickCell.bind(this)}
        />
      </div>
    )
  }
}
