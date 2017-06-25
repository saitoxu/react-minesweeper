const config = {
  easy: {
    boardWidth: 8,
    boardHeight: 8,
    bombNum: 10,
    cellSize: 40
  },
  normal: {
    boardWidth: 16,
    boardHeight: 16,
    bombNum: 40,
    cellSize: 36
  },
  hard: {
    boardWidth: 30,
    boardHeight: 16,
    bombNum: 99,
    cellSize: 32
  },
  veryHard: {
    boardWidth: 48,
    boardHeight: 24,
    bombNum: 256,
    cellSize: 28
  },
  maniac: {
    boardWidth: 68,
    boardHeight: 48,
    bombNum: 777,
    cellSize: 24
  }
}

export default config
