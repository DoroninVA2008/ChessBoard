import type { BlackProps } from './blak'
import './black.scss'

export const Black = ({ onChoose }: BlackProps) => {
  return (
    <button
      type="button"
      className="colors"
      onClick={() => onChoose('black')}
      data-testid="choose-black-btn"
    >
      Играть за чёрных
    </button>
  )
}