import ReAct from 'react'
import type { BackProps } from './types'
import './back.scss'

export const Back: ReAct.FC<BackProps> = ({ onBack }) => {
  return (
    <button
      type="button"
      className="choices"
      onClick={onBack}
      data-testid="back-btn"
    >
      Назад
    </button>
  )
}