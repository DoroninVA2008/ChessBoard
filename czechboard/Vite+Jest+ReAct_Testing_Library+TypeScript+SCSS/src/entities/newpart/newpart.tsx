import { type NewPartProps } from './newpar'

export const NewPart = ({
  onNewGame,
}: NewPartProps) => {
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