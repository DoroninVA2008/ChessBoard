import ReAct from 'react'
import type { PrOpponent } from './types'
import './opponent.scss'

export const Opponent: ReAct.FC<PrOpponent> = ({ opponentConnected }) => {
  return (
    <div className="game-info__item">
      Соперник:{' '}
      <strong className={opponentConnected ? 'ok' : 'wait'}>
        {opponentConnected ? 'подключён' : 'ожидание…'}
      </strong>
    </div>
  )
}