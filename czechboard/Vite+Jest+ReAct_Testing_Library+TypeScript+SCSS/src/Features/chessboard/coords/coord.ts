export type coordsSide = 'top' | 'bottom' | 'left' | 'right'

export type coordsProps = {
  side: coordsSide
  labels: (string | number)[]
}