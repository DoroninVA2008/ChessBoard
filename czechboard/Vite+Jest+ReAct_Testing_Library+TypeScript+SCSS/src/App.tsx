import { useCallback, useState } from 'react'
import { ChessBoard } from './chessboard/chessboard'
import { Lobby } from './lobby/lobby'
import {
  type Piece,
  type PieceColor,
  type Square,
  initialPosition,
  isLegalMove,
} from './chessboard/moves'
import type { LobbyStatus, RoomCode } from './lobby/types'
import './App.scss'

function App() {
  const [pieces, setPieces] = useState<Piece[]>(() => initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PieceColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)

  // Заглушки: сервера нет, всё живёт только в этом браузере.
  const handleCreateRoom = useCallback(() => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    setRoomCode(code)
    setStatus('waiting-for-opponent')
    setMyColor('white')
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
      <h1>ReAct`ивная шахматная доска!</h1>

      <Lobby
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
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
            Сейчас ход:{' '}
            <strong>{turn === 'white' ? 'белых' : 'чёрных'}</strong>
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

export default App