import type { SteProps } from './staps'
import './step.scss'

export function Step({ turn }: SteProps) {
  return (
    <div className="turn-banner" data-testid="turn-indicator" role="status">
      Ход {turn === 'white' ? 'белых' : 'чёрных'}
    </div>
  )
}