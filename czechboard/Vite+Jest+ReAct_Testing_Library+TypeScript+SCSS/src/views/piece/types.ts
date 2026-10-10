import type { Piece } from '../../features/chessboard/types'

export type PieceProps = {
  piece: Piece
  isDragging: boolean
  isSelected: boolean
  isPlayable: boolean
  xPct: number
  yPct: number
  onPointerDown: (e: React.PointerEvent<HTMLSpanElement>, piece: Piece) => void
  onPointerMove: (e: React.PointerEvent<HTMLSpanElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLSpanElement>) => void
}