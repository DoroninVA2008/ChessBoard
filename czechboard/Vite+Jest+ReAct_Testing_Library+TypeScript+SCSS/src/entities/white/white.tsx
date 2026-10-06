import type { WhiteProps } from './whi'

export const White = ({ onChoose }: WhiteProps) => {
  return (
    <button
      type="button"
      className="side-card__btn"
      onClick={() => onChoose('white')}
      data-testid="choose-white-btn"
    >
      Играть за белых
    </button>
  )
}