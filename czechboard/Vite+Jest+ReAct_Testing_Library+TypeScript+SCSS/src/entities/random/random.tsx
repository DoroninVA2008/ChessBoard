import { type RandomProps } from './ran'

export const Random = ({ onRandom }: RandomProps) => {
  return (
    <button
      type="button"
      className="side-choice__btn"
      onClick={onRandom}
      data-testid="random-side-btn"
    >
      Случайный выбор
    </button>
  )
}