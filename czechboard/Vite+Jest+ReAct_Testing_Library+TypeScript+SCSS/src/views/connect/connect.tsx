import ReAct from 'react'
import type { ConnectProps } from './types'
import './connect.scss'

export const Connect: ReAct.FC<ConnectProps> = ({ joinCode, onJoin }) => {
  return (
    <button
      type="button"
      className="connect"
      onClick={onJoin}
      disabled={!joinCode.trim()}
      data-testid="join-room-btn"
    >
      Подключиться
    </button>
  )
}