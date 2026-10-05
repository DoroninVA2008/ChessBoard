import { type FliProps } from './fli'

export const Flip = ({
  onFlip,
}: FliProps) => {
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