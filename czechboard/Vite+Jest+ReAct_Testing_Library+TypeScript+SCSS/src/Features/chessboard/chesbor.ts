export type PieceType =
  | 'rook'
  | 'pawn'
  | 'bishop'
  | 'knight'
  | 'queen'
  | 'king'

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

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const CELLS = 8

const BACK_RANK: PieceType[] = [
  'rook',
  'knight',
  'bishop',
  'queen',
  'king',
  'bishop',
  'knight',
  'rook',
]

export function initialPosition(): Piece[] {
  const pieces: Piece[] = []

  FILES.forEach((file, i) => {
    const type = BACK_RANK[i]

    pieces.push({
      id: `w-${type}-${file}1`,
      type,
      color: 'white',
      square: `${file}1`,
    })
    pieces.push({
      id: `w-pawn-${file}2`,
      type: 'pawn',
      color: 'white',
      square: `${file}2`,
    })

    pieces.push({
      id: `b-pawn-${file}7`,
      type: 'pawn',
      color: 'black',
      square: `${file}7`,
    })
    pieces.push({
      id: `b-${type}-${file}8`,
      type,
      color: 'black',
      square: `${file}8`,
    })
  })

  return pieces
}

export function squareToCoords(square: Square) {
  return {
    col: FILES.indexOf(square[0]),
    row: 8 - Number(square[1]),
  }
}