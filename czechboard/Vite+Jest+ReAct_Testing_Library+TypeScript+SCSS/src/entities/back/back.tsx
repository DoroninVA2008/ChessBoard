import type { BackProps } from './bac'

export const Back = ({ onBack }: BackProps) => {
  return (
    <button
      type="button"
      className="side-choice__btn"
      onClick={onBack}
      data-testid="back-btn"
    >
      Назад
    </button>
  )
}