import { type coordsProps } from './coord'
import './coords.scss'

export const Coords = ({ side, labels }: coordsProps) => {
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