import { NewPart } from '../../../entities/newpart/newpart'
import { UnDo } from '../../../entities/undo/undo'
import { Flip } from '../../../entities/flip/flip'
import './chesbutons.scss'

export const ChessButtons = ({
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