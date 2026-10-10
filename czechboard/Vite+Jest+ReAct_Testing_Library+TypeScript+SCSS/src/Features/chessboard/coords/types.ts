import { FILES, CELLS, squareToCoords } from '../moves'
import { type Square } from '../types'

export type coordsSide = 'top' | 'bottom' | 'left' | 'right'

export type coordsProps = {
  side: coordsSide
  labels: (string | number)[]
}

export function getCellSize(boardEl: HTMLDivElement | null): number {
  if (!boardEl) return 1
  return boardEl.clientWidth / CELLS
}

export function toScreen(square: Square, flipped: boolean) {
  const { col, row } = squareToCoords(square)
  return {
    col: flipped ? 7 - col : col,
    row: flipped ? 7 - row : row,
  }
}

export function fromScreen(
  x: number,
  y: number,
  flipped: boolean,
  boardEl: HTMLDivElement | null,
): Square | null {
  const cell = getCellSize(boardEl)
  if (!cell) return null

  const col = Math.floor(x / cell)
  const row = Math.floor(y / cell)
  if (col < 0 || col > 7 || row < 0 || row > 7) return null

  const realCol = flipped ? 7 - col : col
  const realRow = flipped ? 7 - row : row
  return `${FILES[realCol]}${8 - realRow}`
}