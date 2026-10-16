import ReAct from 'react'
import type { StatusProps } from './types'

export const Status: ReAct.FC<StatusProps> = ({ opponentConnected }) => {
  return (
    <div className="lobby__connected" data-testid="connected-screen">
      <p className={`lobby__opponent ${opponentConnected ? 'is-online' : 'is-offline'}`} data-testid="opponent-status">
        Соперник: {opponentConnected ? 'подключён' : 'не подключён'}
      </p>
    </div>
  )
}