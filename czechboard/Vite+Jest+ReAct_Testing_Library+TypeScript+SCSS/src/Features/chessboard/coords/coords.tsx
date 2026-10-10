import ReAct from 'react'
import { type coordsProps } from './types'
import './coords.scss'

export const Coords: ReAct.FC<coordsProps> = ({ 
  side, 
  labels 
}) => {
  return (
    <div
      className={`chessboard-coords chessboard-coords--${side}`}
      aria-hidden
    >
      <span className="chessboard-coords__corner" />
      {labels.map((label) => (
        <span key={label} className="chessboard-coords__label">
          {label}
        </span>
      ))}
      <span className="chessboard-coords__corner" />
    </div>
  )
}