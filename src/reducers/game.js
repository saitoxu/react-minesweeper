import {
  TOGGLE_FLAG,
  INIT,
  CHANGE_DIFFICULTY,
  GAMEOVER,
  CLEAR
} from '../actions/types'
import config from '../config'

const initialState = {
  gameover: false,
  clear: false,
  bomb: config['easy'].bombNum,
  difficulty: 'easy'
}

const game = (state = initialState, action) => {
  switch(action.type) {
    case TOGGLE_FLAG: {
      const { flagged } = action.payload
      let { bomb } = state
      if (flagged) {
        bomb -= 1
      } else {
        bomb += 1
      }
      return Object.assign({}, state, { bomb })
    }
    case INIT: {
      return {
        gameover: false,
        clear: false,
        bomb: config[state.difficulty].bombNum,
        difficulty: state.difficulty
      }
    }
    case CHANGE_DIFFICULTY: {
      const { difficulty } = action.payload
      return {
        gameover: false,
        clear: false,
        bomb: config[difficulty].bombNum,
        difficulty
      }
    }
    case GAMEOVER: {
      return Object.assign({}, state, { gameover: true })
    }
    case CLEAR: {
      return Object.assign({}, state, { clear: true })
    }
    default: return state
  }
}

export default game
