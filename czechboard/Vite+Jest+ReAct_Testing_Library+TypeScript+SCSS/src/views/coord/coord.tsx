import ReAct from 'react'
import type { coordProps } from './types'
import './coord.scss'

export const Coord: ReAct.FC<coordProps> = ({ label }) => {
  return (
    <span className="chessboard-coord">
      {label}
    </span>
  )
}