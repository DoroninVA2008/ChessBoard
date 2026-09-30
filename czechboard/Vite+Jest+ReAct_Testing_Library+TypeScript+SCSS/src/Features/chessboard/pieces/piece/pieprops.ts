import type { Piece } from '../../moves'

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

const WHITE_GLYPHS: Record<Piece['type'], string> = {
  king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙',
}

const BLACK_GLYPHS: Record<Piece['type'], string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟',
}

export const pieceGlyph = (p: Piece) =>
  p.color === 'white' ? WHITE_GLYPHS[p.type] : BLACK_GLYPHS[p.type]