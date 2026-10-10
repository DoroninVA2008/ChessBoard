import ReAct from 'react'
import type { WhiteProps } from './types'
import '../black/black.scss'

export const White: ReAct.FC<WhiteProps> = ({ onChoose }) => {
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