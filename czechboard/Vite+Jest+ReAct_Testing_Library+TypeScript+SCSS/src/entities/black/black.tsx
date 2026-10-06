import type { BlackProps } from './blak'

export const Black = ({ onChoose }: BlackProps) => {
  return (
    <button
      type="button"
      className="side-card__btn"
      onClick={() => onChoose('black')}
      data-testid="choose-black-btn"
    >
      Играть за чёрных
    </button>
  )
}