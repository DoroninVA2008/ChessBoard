import ReAct, { useState, useRef } from 'react'
import './chessboard.scss'
import type {
  Piece,
  PieceColor,
  Square,
  Props,
  DragState,
  HistoryEntry,
} from './types'
import { getLegalMoves, 
  isLegalMove, 
  initialPosition,
  squareToCoords,
  FILES,
  CELLS } from './moves'
import { Square as SquareComp } from './square/square'
import { Pieces } from './pieces/pieces'
import { Coords } from './coords/coords'
import { ChessButtons } from './chesbutons/chesbutons'

export const ChessBoard: ReAct.FC<Props> = ({
  initialPieces,
  initialTurn = 'white',
  className,
  onMove,
  onTurnChange,
}) => {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces || initialPosition())
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

    if (onMove) {
      onMove({
        from: piece.square,
        to,
        pieceId,
        capturedId: captured?.id,
      })
    }

    const nextTurn = turn === 'white' ? 'black' : 'white'

    if (onTurnChange) onTurnChange(nextTurn)

    setSelectedId(null)
    setTurn(nextTurn)
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

  function onPointerDown(e: React.PointerEvent<HTMLSpanElement>, piece: Piece) {
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
      xPct: col * 100,
      yPct: row * 100,
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
    if (onTurnChange) onTurnChange(initialTurn)
  }

  function handleUndo() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setPieces(last.pieces)
    setTurn(last.turn)
    setHistory(history.slice(0, -1))
    setSelectedId(null)
    if (onTurnChange) onTurnChange(last.turn)
  }

  function handleFlip() {
    setFlipped(!flipped)
  }

  const rankOrder = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
  const fileOrder = flipped ? [...FILES].reverse() : FILES

  return (
    <div className={`chessboard-wrapper ${className || ''}`}>
      {/* 👇 Индикатор хода 
        <div className="turn-indicator" data-testid="turn-indicator">
          {turn === 'white' ? 'Ход белых' : 'Ход чёрных'}
        </div>
      */}
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
                    <SquareComp
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
              draggingId={drag ? drag.id : null}
              dragXPct={drag ? drag.xPct : null}
              dragYPct={drag ? drag.yPct : null}
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