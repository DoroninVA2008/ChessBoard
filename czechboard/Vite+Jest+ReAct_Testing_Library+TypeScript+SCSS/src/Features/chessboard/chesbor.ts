import { useRef, useState } from 'react'
import { getLegalMoves, isLegalMove } from './moves'

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

export type Props = {
  initialPieces?: Piece[]
  initialTurn?: PieceColor
  className?: string
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

export function useChessBoard(
  initialPieces?: Piece[],
  initialTurn: PieceColor = 'white',
) {
  const [pieces, setPieces] = useState<Piece[]>(
    initialPieces || initialPosition(),
  )
  const [turn, setTurn] = useState<PieceColor>(initialTurn)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const boardRef = useRef<HTMLDivElement>(null)

  const selectedPiece = pieces.find((p) => p.id === selectedId) || null

  const legalMoves =
    selectedPiece && selectedPiece.color === turn
      ? getLegalMoves(pieces, selectedPiece)
      : []

  function getCellSize() {
    if (!boardRef.current) return 1
    return boardRef.current.clientWidth / CELLS
  }

  function toScreen(square: Square) {
    const { col, row } = squareToCoords(square)
    return {
      col: flipped ? 7 - col : col,
      row: flipped ? 7 - row : row,
    }
  }

  function fromScreen(x: number, y: number): Square | null {
    const cell = getCellSize()
    if (!cell) return null

    const col = Math.floor(x / cell)
    const row = Math.floor(y / cell)
    if (col < 0 || col > 7 || row < 0 || row > 7) return null

    const realCol = flipped ? 7 - col : col
    const realRow = flipped ? 7 - row : row
    return `${FILES[realCol]}${8 - realRow}`
  }

  function tryMove(pieceId: string, to: Square): boolean {
    const piece = pieces.find((p) => p.id === pieceId)
    if (!piece) return false
    if (piece.color !== turn) return false
    if (!isLegalMove(pieces, piece, to)) return false

    const captured = pieces.find((p) => p.square === to && p.id !== pieceId)

    setHistory([...history, { pieces: pieces.map((p) => ({ ...p })), turn }])

    setPieces(
      pieces
        .filter((p) => p.id !== captured?.id)
        .map((p) => (p.id === pieceId ? { ...p, square: to } : p)),
    )

    setSelectedId(null)
    setTurn(turn === 'white' ? 'black' : 'white')
    return true
  }

  function handleSquareClick(square: Square) {
    const pieceHere = pieces.find((p) => p.square === square)

    if (pieceHere) {
      if (pieceHere.color !== turn) {
        if (selectedId) tryMove(selectedId, square)
        return
      }
      setSelectedId(selectedId === pieceHere.id ? null : pieceHere.id)
      return
    }

    if (selectedId) tryMove(selectedId, square)
  }

  function onPointerDown(
    e: React.PointerEvent<HTMLSpanElement>,
    piece: Piece,
  ) {
    if (piece.color !== turn) return
    e.preventDefault()
    e.stopPropagation()

    if (!boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const cell = getCellSize()
    const { col, row } = toScreen(piece.square)

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const localXPct = ((px - col * cell) / cell) * 100
    const localYPct = ((py - row * cell) / cell) * 100

    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    setSelectedId(piece.id)
    setDrag({
      id: piece.id,
      offsetXPct: localXPct,
      offsetYPct: localYPct,
      xPct: localXPct,
      yPct: localYPct,
    })
  }

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (!drag || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const cell = getCellSize()

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    setDrag({
      ...drag,
      xPct: (px / cell) * 100 - drag.offsetXPct,
      yPct: (py / cell) * 100 - drag.offsetYPct,
    })
  }

  function onPointerUp(e: React.PointerEvent<HTMLSpanElement>) {
    if (!drag || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const cell = getCellSize()

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const cx = px - (drag.offsetXPct / 100) * cell + cell / 2
    const cy = py - (drag.offsetYPct / 100) * cell + cell / 2
    const target = fromScreen(cx, cy)

    if (target) tryMove(drag.id, target)

    setDrag(null)
    setSelectedId(null)
  }

  function handleNewGame() {
    setPieces(initialPieces || initialPosition())
    setTurn(initialTurn)
    setSelectedId(null)
    setHistory([])
  }

  function handleUndo() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setPieces(last.pieces)
    setTurn(last.turn)
    setHistory(history.slice(0, -1))
    setSelectedId(null)
  }

  function handleFlip() {
    setFlipped(!flipped)
  }

  const rankOrder = flipped
    ? [1, 2, 3, 4, 5, 6, 7, 8]
    : [8, 7, 6, 5, 4, 3, 2, 1]
  const fileOrder = flipped ? [...FILES].reverse() : FILES

  return {
    boardRef,
    pieces,
    turn,
    selectedId,
    drag,
    legalMoves,
    rankOrder,
    fileOrder,
    history,
    toScreen,
    handleSquareClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    handleNewGame,
    handleUndo,
    handleFlip,
  }
}