import type { Piece, Square as SquareType } from '../moves'

export type PiecesProps = {
  pieces: Piece[]
  turn: Piece['color']
  selectedId: string | null
  draggingId: string | null
  dragXPct: number | null
  dragYPct: number | null
  toScreen: (square: SquareType) => { col: number; row: number }
  onPointerDown: (e: React.PointerEvent<HTMLSpanElement>, piece: Piece) => void
  onPointerMove: (e: React.PointerEvent<HTMLSpanElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLSpanElement>) => void
}