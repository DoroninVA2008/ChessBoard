import { type UnDoProps } from './un'

export const UnDo = ({
  onUndo,
  canUndo
}: UnDoProps) => {
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