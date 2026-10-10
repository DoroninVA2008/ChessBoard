import ReAct from 'react'
import { type SquareProps } from './types'
import './square.scss'

export const Square: ReAct.FC<SquareProps> = ({
  square,
  isDark,
  isLegal = false,
  isCapture = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      role="gridcell"
      aria-label={square}
      data-testid={`square-${square}`}
      data-square={square}
      data-legal={isLegal}
      className={[
        'square',
        isDark ? 'dark' : 'light',
        isLegal ? 'legal' : '',
        isCapture ? 'capture' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onClick?.(square)}
    />
  )
}