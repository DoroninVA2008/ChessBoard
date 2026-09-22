import { useState, useRef, useMemo, useCallback } from 'react'
import './chessboard.scss'
import {
  type Piece, type Square, type PieceColor,
  getLegalMoves, isLegalMove, initialPosition,
} from './moves'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const SQUARE_SIZE = 60

const squareToCoords = (square: Square) => ({
  col: FILES.indexOf(square[0]),
  row: 8 - Number(square[1]),
})

const coordsToSquare = (x: number, y: number): Square | null => {
  const col = Math.floor(x / SQUARE_SIZE)
  const row = Math.floor(y / SQUARE_SIZE)
  if (col < 0 || col > 7 || row < 0 || row > 7) return null
  return `${FILES[col]}${8 - row}`
}

type Drag = { id: string; offsetX: number; offsetY: number; x: number; y: number }

export type MovePayload = {
  from: Square
  to: Square
  pieceId: string
  capturedId?: string
}

type ChessBoardProps = {
  initialPieces?: Piece[]
  initialTurn?: PieceColor
  className?: string
  onMove?: (move: MovePayload) => void
}

export const ChessBoard = ({
  initialPieces,
  initialTurn = 'white',
  className,
  onMove,
}: ChessBoardProps = {}) => {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces ?? initialPosition())
  const [turn, setTurn] = useState<PieceColor>(initialTurn)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const selectedPiece = useMemo(
    () => pieces.find((p) => p.id === selectedId) ?? null,
    [pieces, selectedId]
  )

  // Легальные ходы только для выбранной фигуры своего цвета.
  const legalMoves = useMemo(
    () =>
      selectedPiece && selectedPiece.color === turn
        ? getLegalMoves(pieces, selectedPiece)
        : [],
    [pieces, selectedPiece, turn]
  )

  const tryMove = useCallback(
  (pieceId: string, to: Square): boolean => {
    const piece = pieces.find((p) => p.id === pieceId)
    if (!piece) return false
    if (piece.color !== turn) return false
    if (!isLegalMove(pieces, piece, to)) return false

    const captured = pieces.find((p) => p.square === to && p.id !== pieceId)

    setPieces((prev) =>
      prev
        .filter((p) => p.id !== captured?.id)
        .map((p) => (p.id === pieceId ? { ...p, square: to } : p))
    )
    setSelectedId(null)
    setTurn((t) => (t === 'white' ? 'black' : 'white'))

    onMove?.({
      from: piece.square,
      to,
      pieceId,
      capturedId: captured?.id,
    })

    return true
  },
  [pieces, turn, onMove]
)

  const handleSquareClick = useCallback(
    (square: Square) => {
      const pieceHere = pieces.find((p) => p.square === square)

      if (pieceHere) {
        // Чужую фигуру выбрать нельзя.
        if (pieceHere.color !== turn) {
          // Но если что-то уже выбрано — попробуем побить её.
          if (selectedId) tryMove(selectedId, square)
          return
        }
        // Своя — выбираем или снимаем выделение.
        setSelectedId((prev) => (prev === pieceHere.id ? null : pieceHere.id))
        return
      }

      if (selectedId) tryMove(selectedId, square)
    },
    [pieces, turn, selectedId, tryMove]
  )

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>, piece: Piece) => {
  if (piece.color !== turn) return
  e.preventDefault()
  e.stopPropagation()
  const rect = boardRef.current!.getBoundingClientRect()
  const { col, row } = squareToCoords(piece.square)
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top

  if (typeof e.currentTarget.setPointerCapture === 'function') {
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  setSelectedId(piece.id)
  setDrag({
    id: piece.id,
    offsetX: px - col * SQUARE_SIZE,
    offsetY: py - row * SQUARE_SIZE,
    x: col * SQUARE_SIZE,
    y: row * SQUARE_SIZE,
  })
}

const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
  if (!drag) {
    return
  }
  const rect = boardRef.current!.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top
  setDrag((d) => d && { ...d, x: px - d.offsetX, y: py - d.offsetY })
}

const onPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
  if (!drag) {
    return
  }
  const rect = boardRef.current!.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top
  const cx = px - drag.offsetX + SQUARE_SIZE / 2
  const cy = py - drag.offsetY + SQUARE_SIZE / 2
  const target = coordsToSquare(cx, cy)

  if (target) {
    tryMove(drag.id, target)
  }

  setDrag(null)
  setSelectedId(null)
}

  return (
    <div className={`chessboard-wrapper ${className ?? ''}`}>
      <div
        className={`turn-indicator turn-indicator--${turn}`}
        data-testid="turn-indicator"
        role="status"
        aria-live="polite"
      >
        Ход {turn === 'white' ? 'белых' : 'чёрных'}
      </div>

      <div className="chessboard" role="grid" ref={boardRef}>
        <div className="squares-layer">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) =>
            FILES.map((file) => {
              const square = `${file}${rank}`
              const isDark = (FILES.indexOf(file) + rank) % 2 === 0
              const isLegal = legalMoves.includes(square)
              const isCapture = isLegal && pieces.some((p) => p.square === square)

              return (
                <button
                  key={square}
                  role="gridcell"
                  aria-label={square}
                  data-testid={`square-${square}`}
                  data-square={square}
                  data-legal={isLegal}
                  className={[
                    'square',
                    isDark ? 'dark' : 'light',
                    isLegal ? 'legal' : '',
                    isCapture ? 'capture' : '',
                  ].join(' ')}
                  onClick={() => handleSquareClick(square)}
                />
              )
            })
          )}
        </div>

        <div className="pieces-layer">
          {pieces.map((piece) => {
            const isDragging = drag?.id === piece.id
            const { col, row } = squareToCoords(piece.square)
            const x = isDragging ? drag!.x : col * SQUARE_SIZE
            const y = isDragging ? drag!.y : row * SQUARE_SIZE
            const isSelected = piece.id === selectedId
            const isPlayable = piece.color === turn

            return (
              <span
                key={piece.id}
                data-testid={`piece-${piece.id}`}
                data-square={piece.square}
                data-piece-type={piece.type}
                data-piece-color={piece.color}
                aria-label={`${piece.color} ${piece.type}`}
                aria-selected={isSelected}
                className={[
                  'piece',
                  `piece--${piece.color}`,
                  isSelected ? 'selected' : '',
                  isDragging ? 'dragging' : '',
                  !isPlayable ? 'piece--inactive' : '',
                ].join(' ')}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                onPointerDown={(e) => onPointerDown(e, piece)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {pieceGlyph(piece)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const GLYPHS: Record<Piece['type'], string> = {
  rook: '♜', pawn: '♟', bishop: '♝', knight: '♞', queen: '♛', king: '♚',
}
const pieceGlyph = (p: Piece) => GLYPHS[p.type]