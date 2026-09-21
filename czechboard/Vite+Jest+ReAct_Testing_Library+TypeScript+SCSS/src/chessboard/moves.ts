export type Square = string
export type PieceType = 'rook' | 'pawn' | 'bishop' | 'knight' | 'queen' | 'king'
export type PieceColor = 'white' | 'black'
export type Piece = {
  id: string
  type: PieceType
  color: PieceColor
  square: Square
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export const fileIndex = (square: Square) => FILES.indexOf(square[0])
export const rankIndex = (square: Square) => Number(square[1])

export const isOnBoard = (file: number, rank: number) =>
  file >= 0 && file < 8 && rank >= 1 && rank <= 8

export const toSquare = (file: number, rank: number): Square | null =>
  isOnBoard(file, rank) ? `${FILES[file]}${rank}` : null

const pawnDir = (color: PieceColor) => (color === 'white' ? 1 : -1)

type Board = Piece[]

const pieceAt = (board: Board, square: Square) =>
  board.find((p) => p.square === square)

const isSameColor = (a: Piece, b: Piece) => a.color === b.color

export const getLegalMoves = (board: Board, piece: Piece): Square[] => {
  switch (piece.type) {
    case 'rook':   return rookMoves(board, piece)
    case 'pawn':   return pawnMoves(board, piece)
    case 'bishop': return slidingMoves(board, piece, [[1,1],[1,-1],[-1,1],[-1,-1]])
    case 'knight': return knightMoves(board, piece)
    case 'queen':  return slidingMoves(board, piece, [
      [1,0],[-1,0],[0,1],[0,-1],
      [1,1],[1,-1],[-1,1],[-1,-1],
    ])
    case 'king':   return kingMoves(board, piece)
  }
}

const rookMoves = (board: Board, piece: Piece): Square[] =>
  slidingMoves(board, piece, [[1,0],[-1,0],[0,1],[0,-1]])

const slidingMoves = (
  board: Board,
  piece: Piece,
  dirs: [number, number][]
): Square[] => {
  const result: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)

  for (const [df, dr] of dirs) {
    let f = f0 + df
    let r = r0 + dr
    while (isOnBoard(f, r)) {
      const sq = toSquare(f, r)!
      const target = pieceAt(board, sq)
      if (!target) {
        result.push(sq)
      } else {
        if (!isSameColor(target, piece)) result.push(sq)
        break
      }
      f += df
      r += dr
    }
  }
  return result
}

const pawnMoves = (board: Board, piece: Piece): Square[] => {
  const result: Square[] = []
  const f = fileIndex(piece.square)
  const r = rankIndex(piece.square)
  const dir = pawnDir(piece.color)
  const startRank = piece.color === 'white' ? 2 : 7

  const oneFwd = toSquare(f, r + dir)
  if (oneFwd && !pieceAt(board, oneFwd)) {
    result.push(oneFwd)
    if (r === startRank) {
      const twoFwd = toSquare(f, r + dir * 2)
      if (twoFwd && !pieceAt(board, twoFwd)) result.push(twoFwd)
    }
  }

  for (const df of [-1, 1]) {
    const diag = toSquare(f + df, r + dir)
    if (!diag) continue
    const target = pieceAt(board, diag)
    if (target && !isSameColor(target, piece)) result.push(diag)
  }

  return result
}

const knightMoves = (board: Board, piece: Piece): Square[] => {
  const result: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)
  const jumps: [number, number][] = [
    [1,2],[2,1],[2,-1],[1,-2],
    [-1,-2],[-2,-1],[-2,1],[-1,2],
  ]
  for (const [df, dr] of jumps) {
    const sq = toSquare(f0 + df, r0 + dr)
    if (!sq) continue
    const target = pieceAt(board, sq)
    if (!target || !isSameColor(target, piece)) result.push(sq)
  }
  return result
}

const kingMoves = (board: Board, piece: Piece): Square[] => {
  const result: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue
      const sq = toSquare(f0 + df, r0 + dr)
      if (!sq) continue
      const target = pieceAt(board, sq)
      if (!target || !isSameColor(target, piece)) result.push(sq)
    }
  }
  return result
}

export const isLegalMove = (board: Board, piece: Piece, to: Square): boolean =>
  getLegalMoves(board, piece).includes(to)

// ---------- Начальная расстановка ----------

const BACK_RANK: PieceType[] = [
  'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
]

export const initialPosition = (): Piece[] => {
  const pieces: Piece[] = []

  FILES.forEach((file, i) => {
    const type = BACK_RANK[i]

    // белые
    pieces.push({ id: `w-${type}-${file}1`, type, color: 'white', square: `${file}1` })
    pieces.push({ id: `w-pawn-${file}2`,    type: 'pawn', color: 'white', square: `${file}2` })

    // чёрные
    pieces.push({ id: `b-pawn-${file}7`,    type: 'pawn', color: 'black', square: `${file}7` })
    pieces.push({ id: `b-${type}-${file}8`, type, color: 'black', square: `${file}8` })
  })

  return pieces
}