import { useState, useRef, useMemo, useCallback } from 'react'
import './chessboard.scss'
import {
  type Piece, type Square as SquareType, type PieceColor,
  getLegalMoves, isLegalMove, initialPosition,
} from './moves'
import { Square } from './square/square'
import { Pieces } from './pieces/pieces'
import { Coords } from './coords/coords'
import { ChessButtons } from './chesbutons/chesbutons'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const CELLS = 8

const squareToCoords = (square: SquareType) => ({
  col: FILES.indexOf(square[0]),
  row: 8 - Number(square[1]),
})

type Drag = {
  id: string
  offsetXPct: number
  offsetYPct: number
  xPct: number
  yPct: number
}

type HistoryEntry = {
  pieces: Piece[]
  turn: PieceColor
}

export type MovePayload = {
  from: SquareType
  to: SquareType
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

  const legalMoves = useMemo(
    () =>
      selectedPiece && selectedPiece.color === turn
        ? getLegalMoves(pieces, selectedPiece)
        : [],
    [pieces, selectedPiece, turn]
  )

  const toScreen = useCallback(
    (square: SquareType) => {
      const { col, row } = squareToCoords(square)
      return {
        col: flipped ? 7 - col : col,
        row: flipped ? 7 - row : row,
      }
    },
    [flipped]
  )

  // Реальный размер клетки в пикселях берём из DOM — никаких констант.
  const getCellSize = useCallback(() => {
    const board = boardRef.current
    if (!board) return 1
    return board.clientWidth / CELLS
  }, [])

  const fromScreen = useCallback(
    (x: number, y: number): SquareType | null => {
      const cell = getCellSize()
      if (!cell) return null
      const col = Math.floor(x / cell)
      const row = Math.floor(y / cell)
      if (col < 0 || col > 7 || row < 0 || row > 7) return null
      const realCol = flipped ? 7 - col : col
      const realRow = flipped ? 7 - row : row
      return `${FILES[realCol]}${8 - realRow}`
    },
    [flipped, getCellSize]
  )

  const tryMove = useCallback(
    (pieceId: string, to: SquareType): boolean => {
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
    (square: SquareType) => {
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

  const onPointerDown = (
    e: React.PointerEvent<HTMLSpanElement>,
    piece: Piece
  ) => {
    if (piece.color !== turn) return
    e.preventDefault()
    e.stopPropagation()

    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cell = getCellSize()
    const { col, row } = toScreen(piece.square)

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    // локальное смещение пальца внутри клетки, в процентах от клетки
    const localXPct = ((px - col * cell) / cell) * 100
    const localYPct = ((py - row * cell) / cell) * 100

    if (typeof e.currentTarget.setPointerCapture === 'function') {
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

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!drag) return
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cell = getCellSize()

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    // позиция в процентах от клетки, минус захват
    setDrag((d) =>
      d && {
        ...d,
        xPct: (px / cell) * 100 - d.offsetXPct,
        yPct: (py / cell) * 100 - d.offsetYPct,
      }
    )
  }

  const onPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!drag) return
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cell = getCellSize()

    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    // центр фигуры = позиция курсора - захват + половина клетки
    const cx = px - (drag.offsetXPct / 100) * cell + cell / 2
    const cy = py - (drag.offsetYPct / 100) * cell + cell / 2
    const target = fromScreen(cx, cy)

    if (target) tryMove(drag.id, target)

    setDrag(null)
    setSelectedId(null)
  }

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

  const rankOrder = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
  const fileOrder = flipped ? [...FILES].reverse() : FILES

  return (
    <div className={`chessboard-wrapper ${className ?? ''}`}>
      <div className="chessboard-with-coords">
        <Coords side="top" labels={fileOrder} />

        <div className="chessboard-row">
          <Coords side="left" labels={rankOrder} />

          <div className="chessboard" role="grid" ref={boardRef}>
            <div className="squares-layer">
              {rankOrder.map((rank) =>
                fileOrder.map((file) => {
                  const square = `${file}${rank}`
                  const isDark = (FILES.indexOf(file) + rank) % 2 !== 0
                  const isLegal = legalMoves.includes(square)
                  const isCapture =
                    isLegal && pieces.some((p) => p.square === square)

                  return (
                    <Square
                      key={square}
                      square={square}
                      isDark={isDark}
                      isLegal={isLegal}
                      isCapture={isCapture}
                      onClick={handleSquareClick}
                    />
                  )
                })
              )}
            </div>

            <Pieces
              pieces={pieces}
              turn={turn}
              selectedId={selectedId}
              draggingId={drag?.id ?? null}
              dragXPct={drag?.xPct ?? null}
              dragYPct={drag?.yPct ?? null}
              toScreen={toScreen}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          </div>

          <Coords side="right" labels={rankOrder} />
        </div>

        <Coords side="bottom" labels={fileOrder} />
      </div>

      <ChessButtons
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        onFlip={handleFlip}
        canUndo={history.length > 0}
      />
    </div>
  )
}