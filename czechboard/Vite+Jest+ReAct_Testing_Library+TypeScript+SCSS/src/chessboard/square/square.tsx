import './square.scss'

export type SquareProps = {
  /** Шахматная клетка, например 'e4' */
  square: string
  /** Тёмная ли клетка */
  isDark: boolean
  /** Легальный ли ход в эту клетку для выбранной фигуры */
  isLegal?: boolean
  /** Есть ли на этой клетке фигура соперника (взятие) */
  isCapture?: boolean
  /** Клик по клетке */
  onClick?: (square: string) => void
}

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