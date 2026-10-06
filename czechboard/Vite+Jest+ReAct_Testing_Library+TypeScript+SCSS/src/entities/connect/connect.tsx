import './connect.scss'
import type { ConnectProps } from './connec'

export const Connect = ({ joinCode, onJoin }: ConnectProps) => {
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