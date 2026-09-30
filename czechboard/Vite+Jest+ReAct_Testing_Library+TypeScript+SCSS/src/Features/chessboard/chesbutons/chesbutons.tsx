import { type ChessButtonsProps } from './chesbutprops'
import './chesbutons.scss'

export const ChessButtons = ({
  onNewGame,
  onUndo,
  onFlip,
  canUndo,
}: ChessButtonsProps) => {
  return (
    <div className="chessboard-controls">
      <button
        type="button"
        className="chessboard-btn"
        onClick={onNewGame}
        data-testid="new-game-btn"
      >
        Новая партия
      </button>
      <button
        type="button"
        className="chessboard-btn"
        onClick={onUndo}
        disabled={!canUndo}
        data-testid="undo-btn"
      >
        Отменить ход
      </button>
      <button
        type="button"
        className="chessboard-btn"
        onClick={onFlip}
        data-testid="flip-btn"
      >
        Поменять сторону
      </button>
    </div>
  )
}