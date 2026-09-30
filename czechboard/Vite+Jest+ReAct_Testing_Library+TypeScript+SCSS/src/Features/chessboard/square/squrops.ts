export type SquareProps = {
  square: string
  isDark: boolean
  isLegal?: boolean
  isCapture?: boolean
  onClick?: (square: string) => void
}