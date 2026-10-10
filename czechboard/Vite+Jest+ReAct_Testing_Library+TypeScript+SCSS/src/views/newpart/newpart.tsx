import ReAct from 'react'
import type { NewPartProps } from './types'

export const NewPart: ReAct.FC<NewPartProps> = ({ onNewGame }) => {
  return (
    <button
      type="button"
      className="chessboard-btn"
      onClick={onNewGame}
      data-testid="new-game-btn"
    >
      Новая партия
    </button>
  )
}