import ReAct from 'react'
import type { RandomProps } from './types'
import '../back/back.scss'

export const Random: ReAct.FC<RandomProps> = ({ onRandom }) => {
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