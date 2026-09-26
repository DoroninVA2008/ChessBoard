import { useState } from 'react'
import './lobby.scss'
import type { RoomCode, LobbyStatus, PlayerColor } from './types'

type LobbyProps = {
  onCreateRoom: () => RoomCode
  onJoinRoom: (code: string) => void
  status: LobbyStatus
  roomCode: RoomCode | null
  myColor: PlayerColor | null
  opponentConnected: boolean
}

export const Lobby = ({
  onCreateRoom,
  onJoinRoom,
  status,
  roomCode,
  myColor,
  opponentConnected,
}: LobbyProps) => {
  const [joinCode, setJoinCode] = useState('')

  const handleCreate = () => {
    onCreateRoom()
  }

  const handleJoin = () => {
    if (!joinCode.trim()) return
    onJoinRoom(joinCode.trim().toUpperCase())
  }

  return (
    <div className="lobby" data-testid="lobby">
      <h2 className="lobby__title">Сетевая игра</h2>

      {status === 'idle' && (
        <div className="lobby__start">
          <button
            type="button"
            className="lobby__btn lobby__btn--primary"
            onClick={handleCreate}
            data-testid="create-room-btn"
          >
            Создать игру
          </button>

          <div className="lobby__divider">или</div>

          <div className="lobby__join">
            <input
              type="text"
              className="lobby__input"
              placeholder="Код комнаты"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value)}
              data-testid="join-code-input"
            />
            <button
                type="button"
                className="lobby__btn"
                onClick={handleJoin}
                disabled={!joinCode.trim()}
                data-testid="join-room-btn"
            >
              Подключиться
            </button>
          </div>
        </div>
      )}

      {status === 'waiting-for-opponent' && roomCode && (
        <div className="lobby__waiting" data-testid="waiting-screen">
          <p className="lobby__label">Код вашей комнаты:</p>
          <p className="lobby__code" data-testid="room-code">
            {roomCode}
          </p>
          {myColor && (
            <p className="lobby__color" data-testid="my-color">
              Вы играете за:{' '}
              <strong>{myColor === 'white' ? 'белых' : 'чёрных'}</strong>
            </p>
          )}
          <p className="lobby__hint">Передайте код другу, чтобы он подключился.</p>
          <p className="lobby__status">Ожидание соперника…</p>
        </div>
      )}

      {(status === 'joining' || status === 'connected') && (
        <div className="lobby__connected" data-testid="connected-screen">
          {myColor && (
            <p className="lobby__color" data-testid="my-color">
              Вы играете за:{' '}
              <strong>{myColor === 'white' ? 'белых' : 'чёрных'}</strong>
            </p>
          )}
          <p
            className={`lobby__opponent ${opponentConnected ? 'is-online' : 'is-offline'}`}
            data-testid="opponent-status"
          >
            Соперник: {opponentConnected ? 'подключён' : 'не подключён'}
          </p>
        </div>
      )}
    </div>
  )
}