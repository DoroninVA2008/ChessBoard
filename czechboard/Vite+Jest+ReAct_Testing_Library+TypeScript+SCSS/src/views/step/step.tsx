import ReAct from 'react'
import type { SteProps } from './types'
import './step.scss'

export const Step: ReAct.FC<SteProps> = ({ turn }) => {
  return (
    <div className="turn-banner" data-testid="turn-indicator" role="status">
      Ход {turn === 'white' ? 'белых' : 'чёрных'}
    </div>
  )
}