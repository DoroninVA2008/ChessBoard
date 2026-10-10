export type PieceType = | 'rook' | 'pawn' | 'bishop' | 'knight' | 'queen' | 'king'
export type PieceColor = 'white' | 'black'
export type Square = string
export type Piece = {
  id: string
  type: PieceType
  color: PieceColor
  square: Square
}
export type MovePayload = {
  from: Square
  to: Square
  pieceId: string
  capturedId?: string
}
export type Props = {
  initialPieces?: Piece[]
  initialTurn?: PieceColor
  className?: string
  onMove?: (payload: MovePayload) => void
  onTurnChange?: (turn: PieceColor) => void
}
export type DragState = {
  id: string
  offsetXPct: number
  offsetYPct: number
  xPct: number
  yPct: number
}
export type HistoryEntry = {
  pieces: Piece[]
  turn: PieceColor
}