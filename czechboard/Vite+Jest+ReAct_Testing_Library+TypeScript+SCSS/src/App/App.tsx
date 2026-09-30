import { useCallback, useState } from 'react'
import { ChessBoard } from '../Features/chessboard/chessboard'
import { Lobby } from '../Features/lobby/lobby'
import {
  type Piece,
  type PieceColor,
  type Square,
  initialPosition,
  isLegalMove,
} from '../Features/chessboard/moves'
import type { LobbyStatus, RoomCode, PlayerColor } from '../Features/lobby/types'
import './App.scss'

export default function App() {
  const [pieces, setPieces] = useState<Piece[]>(() => initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PieceColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)

  const handleCreateRoom = useCallback(() => {
    setStatus('choosing-side')
  }, [])

  const finalizeCreateRoom = useCallback((color: PlayerColor) => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    setRoomCode(code)
    setMyColor(color)
    setStatus('waiting-for-opponent')
  }, [])

  const handleChooseSide = useCallback(
    (color: PlayerColor) => {
      finalizeCreateRoom(color)
    },
    [finalizeCreateRoom],
  )

  const handleRandomSide = useCallback(() => {
    const color: PlayerColor = Math.random() < 0.5 ? 'white' : 'black'
    finalizeCreateRoom(color)
  }, [finalizeCreateRoom])

  const handleBackFromSideChoice = useCallback(() => {
    setStatus('idle')
  }, [])

  const handleJoinRoom = useCallback((_code: string) => {
    setStatus('connected')
    setMyColor('black')
    setOpponentConnected(true)
  }, [])

  const handleMove = useCallback(
    (from: Square, to: Square) => {
      const piece = pieces.find((p) => p.square === from)
      if (!piece || piece.color !== turn || piece.color !== myColor) return
      if (!isLegalMove(pieces, piece, to)) return

      const captured = pieces.find((p) => p.square === to && p.id !== piece.id)
      setPieces((prev) =>
        prev
          .filter((p) => p.id !== captured?.id)
          .map((p) => (p.id === piece.id ? { ...p, square: to } : p)),
      )
      setTurn((t) => (t === 'white' ? 'black' : 'white'))
    },
    [pieces, turn, myColor],
  )

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return (
    <div className="app">
      
      <h1 className="app-title">
        <span className="app-title__crown">♔</span>
        <span className="app-title__text">Шахматы</span>
        <span className="app-title__crown">♚</span>
      </h1>

      {inRoom && (
        <div
          className="turn-banner"
          data-testid="turn-indicator"
          role="status"
          aria-live="polite"
        >
          Ход {turn === 'white' ? 'белых' : 'чёрных'}
        </div>
      )}

      <Lobby
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onChooseSide={handleChooseSide}
        onRandomSide={handleRandomSide}
        onBackFromSideChoice={handleBackFromSideChoice}
        status={status}
        roomCode={roomCode}
        myColor={myColor}
        opponentConnected={opponentConnected}
      />

      {inRoom && (
        <div className="game-info">
          <div className="game-info__item">
            Вы играете за:{' '}
            <strong>{myColor === 'white' ? 'белых' : 'чёрных'}</strong>
          </div>
          <div className="game-info__item">
            Соперник:{' '}
            <strong className={opponentConnected ? 'ok' : 'wait'}>
              {opponentConnected ? 'подключён' : 'ожидание…'}
            </strong>
          </div>
        </div>
      )}

      {inRoom && (
        <ChessBoard
          pieces={pieces}
          turn={turn}
          myColor={myColor}
          onMove={handleMove}
        />
      )}
    </div>
  )
}