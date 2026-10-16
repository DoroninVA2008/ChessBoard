import ReAct from 'react'
import type { CodeProps } from './types'
import { Role } from './role/role'

export const Code: ReAct.FC<CodeProps> = ({
  roomCode,
  myColor,
  opponentConnected,
}) => {
  return (
    <div className="lobby__waiting" data-testid="waiting-screen">
      <p className="lobby__label">Код вашей комнаты:</p>
      <p className="lobby__code" data-testid="room-code">
        {roomCode}
      </p>
      <p className="lobby__hint">
        Передайте код другу, чтобы он подключился.
      </p>
      {myColor && (
        <Role myColor={myColor} opponentConnected={opponentConnected} />
      )}
    </div>
  )
}