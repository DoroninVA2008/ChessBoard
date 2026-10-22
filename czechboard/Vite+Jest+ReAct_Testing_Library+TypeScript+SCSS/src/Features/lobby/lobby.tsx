import ReAct, { useState } from 'react'
import { useLobby } from './lob'
import './lobby.scss'
import { Create } from '../../views/create/create'
import { Connect } from '../../views/connect/connect'
import { SideChoice } from '../../widgets/side/side'
import { Code } from '../../widgets/code/code'
import { Step } from '../../views/step/step'
import { Status } from '../../views/status/status'

export const Lobby: ReAct.FC = () => {
  const {
    status,
    roomCode,
    myColor,
    opponentConnected,
    turn,
    error,
    handleCreateRoom,
    handleJoinRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
  } = useLobby()

  const [joinCode, setJoinCode] = useState('')

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase()
    if (!code) return
    handleJoinRoom(code)
  }

  const showIdleContent = status === 'idle' || status === 'choosing-side'

  return (
    <div className="lobby" data-testid="lobby">
      {showIdleContent && (
        <>
          <h2 className="lobby__title">Сетевая игра</h2>
          <div className="lobby__start">
            <Create onCreate={handleCreateRoom} />
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
              <Connect joinCode={joinCode} onJoin={handleJoin} />
            </div>
            {error && <p className="lobby__error">{error}</p>}
          </div>
        </>
      )}

      {status === 'waiting-for-opponent' && roomCode && (
        <Code roomCode={roomCode} myColor={myColor} opponentConnected={opponentConnected} />
      )}

      {(status === 'joining' || status === 'connected') && (
        <Status opponentConnected={opponentConnected} />
      )}

      {(status === 'waiting-for-opponent' || status === 'connected') && (
        <Step turn={turn} />
      )}

      {status === 'choosing-side' && (
        <SideChoice
          onChoose={handleChooseSide}
          onRandom={handleRandomSide}
          onBack={handleBackFromSideChoice}
        />
      )}
    </div>
  )
}