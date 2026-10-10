import ReAct from 'react'
import type { BlackProps } from './types'
import './black.scss'

export const Black: ReAct.FC<BlackProps> = ({ onChoose }) => {
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