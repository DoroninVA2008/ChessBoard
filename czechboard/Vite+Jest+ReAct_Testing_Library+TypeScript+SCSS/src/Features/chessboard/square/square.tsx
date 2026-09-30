import './square.scss'
import { type SquareProps } from './squrops'

export const Square = ({
  square,
  isDark,
  isLegal = false,
  isCapture = false,
  onClick,
}: SquareProps) => {
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