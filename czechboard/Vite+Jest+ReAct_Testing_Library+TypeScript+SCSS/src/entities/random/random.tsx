import { type RandomProps } from './ran'
import '../back/back.scss'

export const Random = ({ onRandom }: RandomProps) => {
  return (
    <button
      type="button"
      className="choices"
      onClick={onRandom}
      data-testid="random-side-btn"
    >
      Случайный выбор
    </button>
  )
}