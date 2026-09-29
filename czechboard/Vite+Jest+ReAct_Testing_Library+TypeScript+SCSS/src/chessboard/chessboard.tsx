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

type Drag = { id: string; offsetX: number; offsetY: number; x: number; y: number }

type HistoryEntry = {
  pieces: Piece[]
  turn: PieceColor
}

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
  const [flipped, setFlipped] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])

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

  // ===== Координаты с учётом переворота доски =====

  /** Шахматная клетка → экранная позиция (col, row). */
  const toScreen = useCallback(
    (square: Square) => {
      const { col, row } = squareToCoords(square)
      return {
        col: flipped ? 7 - col : col,
        row: flipped ? 7 - row : row,
      }
    },
    [flipped]
  )

  /** Экранная позиция (x, y) → шахматная клетка. */
  const fromScreen = useCallback(
    (x: number, y: number): Square | null => {
      const col = Math.floor(x / SQUARE_SIZE)
      const row = Math.floor(y / SQUARE_SIZE)
      if (col < 0 || col > 7 || row < 0 || row > 7) return null
      const realCol = flipped ? 7 - col : col
      const realRow = flipped ? 7 - row : row
      return `${FILES[realCol]}${8 - realRow}`
    },
    [flipped]
  )

  const tryMove = useCallback(
    (pieceId: string, to: Square): boolean => {
      const piece = pieces.find((p) => p.id === pieceId)
      if (!piece) return false
      if (piece.color !== turn) return false
      if (!isLegalMove(pieces, piece, to)) return false

      const captured = pieces.find((p) => p.square === to && p.id !== pieceId)

      setHistory((prev) => [
        ...prev,
        { pieces: pieces.map((p) => ({ ...p })), turn },
      ])

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
        if (pieceHere.color !== turn) {
          if (selectedId) tryMove(selectedId, square)
          return
        }
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
    // ВАЖНО: координаты экранные с учётом переворота
    const { col, row } = toScreen(piece.square)
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
    if (!drag) return
    const rect = boardRef.current!.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    setDrag((d) => d && { ...d, x: px - d.offsetX, y: py - d.offsetY })
  }

  const onPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!drag) return
    const rect = boardRef.current!.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const cx = px - drag.offsetX + SQUARE_SIZE / 2
    const cy = py - drag.offsetY + SQUARE_SIZE / 2
    // ВАЖНО: превращаем экранные координаты в шахматную клетку с учётом переворота
    const target = fromScreen(cx, cy)

    if (target) tryMove(drag.id, target)

    setDrag(null)
    setSelectedId(null)
  }

  // ===== Кнопки управления =====
  const handleNewGame = () => {
    setPieces(initialPieces ?? initialPosition())
    setTurn(initialTurn)
    setSelectedId(null)
    setHistory([])
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setPieces(last.pieces)
    setTurn(last.turn)
    setHistory((prev) => prev.slice(0, -1))
    setSelectedId(null)
  }

  const handleFlip = () => {
    setFlipped((f) => !f)
  }

  // ===== Порядок линий и колонок с учётом переворота =====
  const rankOrder = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
  const fileOrder = flipped ? [...FILES].reverse() : FILES

  return (
    <div className={`chessboard-wrapper ${className ?? ''}`}>
      <div className="chessboard-with-coords">
        {/* Сверху: буквы a–h */}
        <div className="chessboard-coords chessboard-coords--top">
          <span className="chessboard-coords__corner" />
          {fileOrder.map((file) => (
            <span key={file} className="chessboard-coords__label">
              {file}
            </span>
          ))}
          <span className="chessboard-coords__corner" />
        </div>

        {/* Средняя строка: цифры слева + доска + цифры справа */}
        <div className="chessboard-row">
          <div className="chessboard-coords chessboard-coords--left">
            {rankOrder.map((rank) => (
              <span key={rank} className="chessboard-coords__label">
                {rank}
              </span>
            ))}
          </div>

          <div className="chessboard" role="grid" ref={boardRef}>
            <div className="squares-layer">
              {rankOrder.map((rank) =>
                fileOrder.map((file) => {
                  const square = `${file}${rank}`
                  const isDark = (FILES.indexOf(file) + rank) % 2 !== 0
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
                // ВАЖНО: экранные координаты с учётом переворота
                const { col, row } = toScreen(piece.square)
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

          <div className="chessboard-coords chessboard-coords--right">
            {rankOrder.map((rank) => (
              <span key={rank} className="chessboard-coords__label">
                {rank}
              </span>
            ))}
          </div>
        </div>

        {/* Снизу: буквы a–h */}
        <div className="chessboard-coords chessboard-coords--bottom">
          <span className="chessboard-coords__corner" />
          {fileOrder.map((file) => (
            <span key={file} className="chessboard-coords__label">
              {file}
            </span>
          ))}
          <span className="chessboard-coords__corner" />
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="chessboard-controls">
        <button
          type="button"
          className="chessboard-btn"
          onClick={handleNewGame}
          data-testid="new-game-btn"
        >
          Новая партия
        </button>
        <button
          type="button"
          className="chessboard-btn"
          onClick={handleUndo}
          disabled={history.length === 0}
          data-testid="undo-btn"
        >
          Отменить ход
        </button>
        <button
          type="button"
          className="chessboard-btn"
          onClick={handleFlip}
          data-testid="flip-btn"
        >
          Поменять сторону
        </button>
      </div>
    </div>
  )
}

const WHITE_GLYPHS: Record<Piece['type'], string> = {
  king: '♔',
  queen: '♕',
  rook: '♖',
  bishop: '♗',
  knight: '♘',
  pawn: '♙',
}

const BLACK_GLYPHS: Record<Piece['type'], string> = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
}

const pieceGlyph = (p: Piece) =>
  p.color === 'white' ? WHITE_GLYPHS[p.type] : BLACK_GLYPHS[p.type]