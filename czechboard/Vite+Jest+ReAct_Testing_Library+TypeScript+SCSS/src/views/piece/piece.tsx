import ReAct from 'react'
import type { PieceProps } from './types'
import { pieceGlyph } from './pie'
import './piece.scss'

export const PieceItem: ReAct.FC<PieceProps> = ({
  piece,
  isDragging,
  isSelected,
  isPlayable,
  xPct,
  yPct,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  return (
    <span
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
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: `translate(${xPct}%, ${yPct}%)` }}
      onPointerDown={(e) => onPointerDown(e, piece)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {pieceGlyph(piece)}
    </span>
  )
}