import ReAct from 'react'
import type { CodeProps } from './types'
import './code.scss'
import { Role } from '../role/role'

/**
 * 
 * @param param0 
 * @returns 
 */
export const Code: ReAct.FC<CodeProps> = ({
  roomCode,
  myColor,
  opponentConnected,
}) => {
  return (
    <div className="cody__waiting" data-testid="waiting-screen">
      <p className="cody__label">Код вашей комнаты:</p>
      <p className="cody__code" data-testid="room-code">
        {roomCode}
      </p>
      <p className="cody__hint">
        Передайте код другу, чтобы он подключился.
      </p>
      {myColor && (
        <Role myColor={myColor} opponentConnected={opponentConnected} />
      )}
    </div>
  )
}