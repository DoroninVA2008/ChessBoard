import {
  type Piece,
  type Square,
  FILES,
} from './chesbor'

export function fileIndex(square: Square): number {
  return FILES.indexOf(square[0])
}

export function rankIndex(square: Square): number {
  return Number(square[1])
}

export function isOnBoard(file: number, rank: number): boolean {
  return file >= 0 && file < 8 && rank >= 1 && rank <= 8
}

export function toSquare(file: number, rank: number): Square | null {
  if (!isOnBoard(file, rank)) return null
  return `${FILES[file]}${rank}`
}

function pieceAt(board: Piece[], square: Square): Piece | undefined {
  return board.find((p) => p.square === square)
}

function sameColor(a: Piece, b: Piece): boolean {
  return a.color === b.color
}

function slidingMoves(
  board: Piece[],
  piece: Piece,
  dirs: number[][],
): Square[] {
  const moves: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)

  for (const [df, dr] of dirs) {
    let f = f0 + df
    let r = r0 + dr

    while (isOnBoard(f, r)) {
      const sq = toSquare(f, r)!
      const target = pieceAt(board, sq)

      if (!target) {
        moves.push(sq)
      } else {
        if (!sameColor(target, piece)) moves.push(sq)
        break
      }

      f += df
      r += dr
    }
  }

  return moves
}

function pawnMoves(board: Piece[], piece: Piece): Square[] {
  const moves: Square[] = []
  const f = fileIndex(piece.square)
  const r = rankIndex(piece.square)

  const dir = piece.color === 'white' ? 1 : -1

  const startRank = piece.color === 'white' ? 2 : 7

  const one = toSquare(f, r + dir)
  if (one && !pieceAt(board, one)) {
    moves.push(one)

    if (r === startRank) {
      const two = toSquare(f, r + dir * 2)
      if (two && !pieceAt(board, two)) moves.push(two)
    }
  }

  for (const df of [-1, 1]) {
    const diag = toSquare(f + df, r + dir)
    if (!diag) continue

    const target = pieceAt(board, diag)
    if (target && !sameColor(target, piece)) moves.push(diag)
  }

  return moves
}

function knightMoves(board: Piece[], piece: Piece): Square[] {
  const moves: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)

  const jumps = [
    [1, 2], [2, 1], [2, -1], [1, -2],
    [-1, -2], [-2, -1], [-2, 1], [-1, 2],
  ]

  for (const [df, dr] of jumps) {
    const sq = toSquare(f0 + df, r0 + dr)
    if (!sq) continue

    const target = pieceAt(board, sq)
    if (!target || !sameColor(target, piece)) moves.push(sq)
  }

  return moves
}

function kingMoves(board: Piece[], piece: Piece): Square[] {
  const moves: Square[] = []
  const f0 = fileIndex(piece.square)
  const r0 = rankIndex(piece.square)

  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue

      const sq = toSquare(f0 + df, r0 + dr)
      if (!sq) continue

      const target = pieceAt(board, sq)
      if (!target || !sameColor(target, piece)) moves.push(sq)
    }
  }

  return moves
}

export function getLegalMoves(board: Piece[], piece: Piece): Square[] {
  switch (piece.type) {
    case 'rook':
      return slidingMoves(board, piece, [[1, 0], [-1, 0], [0, 1], [0, -1]])

    case 'bishop':
      return slidingMoves(board, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1]])

    case 'queen':
      return slidingMoves(board, piece, [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1],
      ])

    case 'pawn':
      return pawnMoves(board, piece)

    case 'knight':
      return knightMoves(board, piece)

    case 'king':
      return kingMoves(board, piece)
  }
}

export function isLegalMove(board: Piece[], piece: Piece, to: Square): boolean {
  return getLegalMoves(board, piece).includes(to)
}