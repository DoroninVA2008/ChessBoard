import ReAct from 'react'
import type { FliProps } from './types'

export const Flip: ReAct.FC<FliProps> = ({ onFlip }) => {
  return (
    <button
      type="button"
      className="chessboard-btn"
      onClick={onFlip}
      data-testid="flip-btn"
    >
      Поменять сторону
    </button>
  )
}