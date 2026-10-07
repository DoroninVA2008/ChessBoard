import type { WhiteProps } from './whi'
import '../black/black.scss'

export const White = ({ onChoose }: WhiteProps) => {
  return (
    <button
      type="button"
      className="colors"
      onClick={() => onChoose('white')}
      data-testid="choose-white-btn"
    >
      Играть за белых
    </button>
  )
}