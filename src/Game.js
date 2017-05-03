import React, { Component } from 'react'
import Bomb from 'react-icons/lib/fa/certificate'
import Board from './Board'
import Config from './Config'
import './Game.css'

const config = Config

export default class Game extends Component {
  constructor(props) {
    super(props)
    const difficulty = 'easy'
    this.state = {
      board: this._initBoard(difficulty),
      gameover: false,
      clear: false,
      bomb: config[difficulty].bombNum,
      difficulty: difficulty
    }
  }

  _initBoard(difficulty) {
    const bombPlaces = this._initBombPlaces(difficulty)
    const { boardWidth, boardHeight } = config[difficulty]
    const board = Array.from(
      new Array(boardWidth), () => new Array(boardHeight).fill(
        { bomb: false, bombCount: 0, open: false, flagged: false }
      )
    )
    for (let place of bombPlaces) {
      board[place.x][place.y] = Object.assign({}, board[place.x][place.y], { bomb: true })
    }
    return board
  }

  _initBombPlaces(difficulty) {
    const bombPlaces = []
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
    while (bombPlaces.length < bombNum) {
      const x = Math.floor(Math.random() * boardWidth)
      const y = Math.floor(Math.random() * boardHeight)
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
    const difficulty = this.state.difficulty
    this.setState({
      board: this._initBoard(difficulty),
      gameover: false,
      clear: false,
      bomb: config[difficulty].bombNum
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

  handleDoubleClickCell(x, y) {
    const { boardWidth, boardHeight } = config[this.state.difficulty]
    if (this.state.gameover || this.state.clear) {
      return
    }
    if (!this.state.board[x][y].open) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
            (j < 0 || j >= boardHeight) ||
            (i === x && j === y) ||
            (this.state.board[i][j].flagged)) {
          continue
        }
        this._open(i, j)
      }
    }
  }

  changeDifficulty(e) {
    const difficulty = e.target.value
    this.setState({
      board: this._initBoard(difficulty),
      gameover: false,
      clear: false,
      bomb: config[difficulty].bombNum,
      difficulty: difficulty
    })
  }

  _open(x, y) {
    const board = [].concat(this.state.board)
    const { boardWidth, boardHeight } = config[this.state.difficulty]
    if (!board[x][y].open) {
      let bombCount = 0
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if ((i < 0 || i >= boardWidth) ||
              (j < 0 || j >= boardHeight) ||
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
        this.setState({ board: board, gameover: true })
      } else {
        if (this._isClear(board)) {
          this.setState({ board: board, clear: true })
        } else {
          this.setState({ board: board })
        }
      }

      if (bombCount === 0 && !board[x][y].bomb) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= boardWidth) ||
                (j < 0 || j >= boardHeight) ||
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
    const { boardWidth, boardHeight, bombNum } = config[this.state.difficulty]
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        }
      })
    })
    return openCount === (boardWidth * boardHeight - bombNum)
  }

  _toggleFlag(x, y) {
    const board = [].concat(this.state.board)
    let newBomb = this.state.bomb
    if (!board[x][y].flagged) {
      board[x][y] = Object.assign({}, board[x][y], { flagged: true })
      newBomb--
    } else {
      board[x][y] = Object.assign({}, board[x][y], { flagged: false })
      newBomb++
    }
    this.setState({ board: board, bomb: newBomb })
  }

  render() {
    const board = this.state.board
    const { boardWidth, cellSize } = config[this.state.difficulty]
    const boardWidthPx = boardWidth * cellSize
    let status = <span className="status"></span>
    if (this.state.gameover) {
      status = <span id="gameover" className="status">Gameover</span>
    } else if (this.state.clear) {
      status = <span id="clear" className="status">Clear!</span>
    }
    return (
      <div id="game" style={{ width: boardWidthPx }}>
        <h1>Minesweeper</h1>
        <div id="menu">
          <button onClick={this.handleClick.bind(this)} id="restart">Restart</button>
          <select value={this.state.difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
            <option value={'easy'} key={'easy'}>Easy</option>
            <option value={'normal'} key={'normal'}>Normal</option>
            <option value={'hard'} key={'hard'}>Hard</option>
            <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
            <option value={'maniac'} key={'maniac'}>Maniac</option>
          </select>
          <span id="bomb"><Bomb style={{ marginTop: -3 }} /> {this.state.bomb}</span>
          {status}
        </div>
        <Board
          board={board}
          cellSize={cellSize}
          onClick={this.handleClickCell.bind(this)}
          onRightClick={this.handleRightClickCell.bind(this)}
          onDoubleClick={this.handleDoubleClickCell.bind(this)}
        />
        <div>
          <p>
            <span style={{ fontWeight: 'bold' }}>HOW TO PLAY</span><br />
            <span style={{ fontSize: 14 }}>Click: Open a cell.</span><br />
            <span style={{ fontSize: 14 }}>Right Click: Toggle a flag.</span><br />
            <span style={{ fontSize: 14 }}>Double Click: Open cells around open cell except flagged at once. Only enable for open cell.</span>
          </p>
          <hr />
          <p style={{ textAlign: 'right' }}>
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
