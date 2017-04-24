import React, { Component } from 'react'
import Board from './Board'
import './Game.css'

const BOARD_SIZE = 9
const BOMB_NUM = 10

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: this._initBoard(),
      gameover: false,
      clear: false
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
      board: this._initBoard(),
      gameover: false,
      clear: false
    })
  }

  handleClickCell(x, y) {
    if (this.state.gameover || this.state.clear) {
      return
    }
    this._open(x, y)
  }

  handleRightClickCell(x, y) {
    if (this.state.gameover || this.state.clear) {
      return
    }
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
      if (board[x][y].bomb) {
        this.setState({ board: board, gameover: true, clear: false })
      } else {
        if (this._isClear(board)) {
          this.setState({ board: board, gameover: false, clear: true })
        } else {
          this.setState({ board: board, gameover: false, clear: false })
        }
      }

      if (bombCount === 0 && !board[x][y].bomb) {
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

  _isClear(board) {
    let openCount = 0
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        }
      })
    })
    return openCount === (BOARD_SIZE * BOARD_SIZE - BOMB_NUM)
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
      <div id="game">
        <h1>Minesweeper</h1>
        <div id="menu">
          <button onClick={this.handleClick.bind(this)} id="restart">Restart</button>
          {this.state.gameover && <span id="gameover">Gameover</span>}
          {this.state.clear && <span id="clear">Clear!</span>}
        </div>
        <Board
          board={board}
          onClick={this.handleClickCell.bind(this)}
          onRightClick={this.handleRightClickCell.bind(this)}
        />
        <div>
          <p>
            <span style={{fontWeight: 'bold', color: 'gray'}}>HOW TO PLAY: </span>
            <span>Click a cell then open it. You can toggle a flag by right click.</span>
          </p>
          <hr />
          <p style={{textAlign: 'right'}}>
            <span>Created by </span>
            <a href="https://github.com/saitoxu">Yosuke Saito</a>
            <br />
            <span>View </span>
            <a href="https://github.com/saitoxu/react-minesweeper">Code</a>
          </p>
        </div>
      </div>
    )
  }
}
