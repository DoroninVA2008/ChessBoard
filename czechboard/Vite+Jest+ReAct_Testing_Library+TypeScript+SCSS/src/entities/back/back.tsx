import type { BackProps } from './bac'
import './back.scss'

export const Back = ({ onBack }: BackProps) => {
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