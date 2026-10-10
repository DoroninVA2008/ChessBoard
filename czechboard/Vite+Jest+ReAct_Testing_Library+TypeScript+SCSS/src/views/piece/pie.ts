import type { Piece } from '../../features/chessboard/types'

const WHITE_GLYPHS: Record<Piece['type'], string> = {
  king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙',
}

const BLACK_GLYPHS: Record<Piece['type'], string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟',
}

export const pieceGlyph = (p: Piece) =>
  p.color === 'white' ? WHITE_GLYPHS[p.type] : BLACK_GLYPHS[p.type]