import ReAct from 'react'
import { PieceItem } from '../../../views/piece/piece'
import { type PiecesProps } from './types'
import './pieces.scss'

export const Pieces: ReAct.FC<PiecesProps> = ({
  pieces,
  turn,
  selectedId,
  draggingId,
  dragXPct,
  dragYPct,
  toScreen,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  return (
    <div className="pieces-layer">
      {pieces.map((piece) => {
        const isDragging = draggingId === piece.id
        const { col, row } = toScreen(piece.square)
        const xPct = isDragging && dragXPct !== null ? dragXPct : col * 100
        const yPct = isDragging && dragYPct !== null ? dragYPct : row * 100

        return (
          <PieceItem
            key={piece.id}
            piece={piece}
            isDragging={isDragging}
            isSelected={piece.id === selectedId}
            isPlayable={piece.color === turn}
            xPct={xPct}
            yPct={yPct}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        )
      })}
    </div>
  )
}