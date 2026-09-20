import { useState, useRef } from 'react'
import './chessboard.scss'

type Square = string
type Piece = { id: string; type: 'rook' | 'pawn'; color: 'white' | 'black'; square: Square }

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

export const ChessBoard = () => {
  const [pieces, setPieces] = useState<Piece[]>([
    { id: 'rook-1', type: 'rook', color: 'white', square: 'a1' },
    { id: 'pawn-1', type: 'pawn', color: 'white', square: 'e2' },
    { id: 'pawn-2', type: 'pawn', color: 'black', square: 'e7' },
  ])
  const [drag, setDrag] = useState<Drag | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>, piece: Piece) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = boardRef.current!.getBoundingClientRect()
    const { col, row } = squareToCoords(piece.square)
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    e.currentTarget.setPointerCapture(e.pointerId)
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
    // берём центр фигуры, а не курсор — иначе «бросить» сложно
    const cx = px - drag.offsetX + SQUARE_SIZE / 2
    const cy = py - drag.offsetY + SQUARE_SIZE / 2
    const target = coordsToSquare(cx, cy)

    if (target) {
      const occupant = pieces.find((p) => p.square === target)
      if (!occupant || occupant.id === drag.id) {
        setPieces((prev) => prev.map((p) => (p.id === drag.id ? { ...p, square: target } : p)))
      }
    }
    setDrag(null)
  }

  return (
    <div className="chessboard" role="grid" ref={boardRef}>
      <div className="squares-layer">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) =>
          FILES.map((file) => {
            const square = `${file}${rank}`
            const isDark = (FILES.indexOf(file) + rank) % 2 === 0
            return (
              <button
                key={square}
                role="gridcell"
                data-testid={`square-${square}`}
                className={`square ${isDark ? 'dark' : 'light'}`}
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

          return (
            <span
              key={piece.id}
              data-testid={`piece-${piece.id}`}
              data-square={piece.square}
              className={`piece piece--${piece.color} ${isDragging ? 'dragging' : ''}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onPointerDown={(e) => onPointerDown(e, piece)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {piece.type === 'rook' ? '♜' : '♟'}
            </span>
          )
        })}
      </div>
    </div>
  )
}