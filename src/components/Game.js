import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bomb from 'react-icons/lib/fa/certificate'
import Board from './Board'
import config from '../config'
import { toggle, init, changeDifficulty, gameover, clear } from '../actions'
import '../styles/Game.css'

class Game extends Component {
  constructor(props) {
    super(props)
    const { difficulty } = this.props
    this.state = { board: this._initBoard(difficulty) }
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCell = this.handleClickCell.bind(this)
    this.handleRightClickCell = this.handleRightClickCell.bind(this)
    this.handleDoubleClickCell = this.handleDoubleClickCell.bind(this)
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
    const { difficulty } = this.props
    this.props.dispatch(init())
    this.setState({ board: this._initBoard(difficulty) })
  }

  handleClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear) {
      return
    }
    this._open(x, y)
  }

  handleRightClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear) {
      return
    }
    this._toggleFlag(x, y)
  }

  handleDoubleClickCell(x, y) {
    const { gameover, clear, difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    const { board } = this.state
    if (gameover || clear) {
      return
    }
    if (!board[x][y].open) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
            (j < 0 || j >= boardHeight) ||
            (i === x && j === y) ||
            (board[i][j].flagged)) {
          continue
        }
        this._open(i, j)
      }
    }
  }

  changeDifficulty(e) {
    const difficulty = e.target.value
    this.props.dispatch(changeDifficulty(difficulty))
    this.setState({ board: this._initBoard(difficulty) })
  }

  _open(x, y) {
    const board = [].concat(this.state.board)
    const { boardWidth, boardHeight } = config[this.props.difficulty]
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
      this.setState({ board })
      if (board[x][y].flagged) {
        this._toggleFlag(x, y)
      }
      if (board[x][y].bomb) {
        this.props.dispatch(gameover())
      }
      if (this._isClear(board)) {
        this.props.dispatch(clear())
      }

      if (bombCount === 0 && !board[x][y].bomb) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= boardWidth) ||
                (j < 0 || j >= boardHeight) ||
                (i === x && j === y) ||
                (board[i][j].flagged)) {
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
    const { difficulty } = this.props
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
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
    const { flagged } = board[x][y]
    board[x][y] = Object.assign({}, board[x][y], { flagged: !flagged })
    this.setState({ board })
    this.props.dispatch(toggle(!flagged))
  }

  render() {
    const { board } = this.state
    const { difficulty, gameover, clear, bomb } = this.props
    const { boardWidth, cellSize } = config[difficulty]
    const boardWidthPx = boardWidth * cellSize
    let status = <span className="status"></span>
    if (gameover) {
      status = <span id="gameover" className="status">Gameover</span>
    } else if (clear) {
      status = <span id="clear" className="status">Clear!</span>
    }
    return (
      <div id="game" style={{ width: boardWidthPx }}>
        <h1>Minesweeper</h1>
        <div id="menu">
          <button onClick={this.handleClick} id="restart">Restart</button>
          <select value={difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
            <option value={'easy'} key={'easy'}>Easy</option>
            <option value={'normal'} key={'normal'}>Normal</option>
            <option value={'hard'} key={'hard'}>Hard</option>
            <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
            <option value={'maniac'} key={'maniac'}>Maniac</option>
          </select>
          <span id="bomb"><Bomb style={{ marginTop: -3 }} /> {bomb}</span>
          {status}
        </div>
        <Board
          board={board}
          cellSize={cellSize}
          onClick={this.handleClickCell}
          onRightClick={this.handleRightClickCell}
          onDoubleClick={this.handleDoubleClickCell}
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

const mapStateToProps = (state) => state.game

export default connect(mapStateToProps)(Game)
