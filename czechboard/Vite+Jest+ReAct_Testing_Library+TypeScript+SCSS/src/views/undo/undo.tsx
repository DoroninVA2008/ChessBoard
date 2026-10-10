import ReAct from 'react'
import type { UnDoProps } from './types'

export const UnDo: ReAct.FC<UnDoProps> = ({ onUndo, canUndo }) => {
  return (
    <button
      type="button"
      className="chessboard-btn"
      onClick={onUndo}
      disabled={!canUndo}
      data-testid="undo-btn"
    >
      Отменить ход
    </button>
  )
}