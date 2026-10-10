import ReAct from 'react'
import { NewPart } from '../../../views/newpart/newpart'
import { UnDo } from '../../../views/undo/undo'
import { Flip } from '../../../views/flip/flip'
import type { ChessButtonsProps } from './types'
import './chesbutons.scss'

export const ChessButtons: ReAct.FC<ChessButtonsProps> = ({
  onNewGame,
  onUndo,
  onFlip,
  canUndo,
}) => {
  return (
    <div className="chessboard-controls">
      <NewPart onNewGame={onNewGame} />
      <UnDo onUndo={onUndo} canUndo={canUndo} />
      <Flip onFlip={onFlip} />
    </div>
  )
}