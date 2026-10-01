import { useState } from 'react'
import { ChessBoard } from '../Features/chessboard/chessboard'
import { Lobby } from '../Features/lobby/lobby'
import { Role } from '../Features/chessboard/role/role'
import { Step } from '../Features/chessboard/step/step'
import {
  type Piece,
  type PieceColor,
  initialPosition,
} from '../Features/chessboard/chesbor'
import type { LobbyStatus, RoomCode, PlayerColor } from '../Features/lobby/types'
import './App.scss'

export default function App() {
  const [pieces, setPieces] = useState<Piece[]>(initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PieceColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)

  // создать комнату
  function handleCreateRoom() {
    setStatus('choosing-side')
  }

  // финальное создание комнаты
  function finalizeCreateRoom(color: PlayerColor) {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    setRoomCode(code)
    setMyColor(color)
    setStatus('waiting-for-opponent')
  }

  function handleChooseSide(color: PlayerColor) {
    finalizeCreateRoom(color)
  }

  function handleRandomSide() {
    const color: PlayerColor = Math.random() < 0.5 ? 'white' : 'black'
    finalizeCreateRoom(color)
  }

  function handleBackFromSideChoice() {
    setStatus('idle')
  }

  // зайти в комнату
  function handleJoinRoom(_code: string) {
    setStatus('connected')
    setMyColor('black')
    setOpponentConnected(true)
  }

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return (
    <div className="app">
      <h1 className="app-title">
        <span className="app-title__crown">♔</span>
        <span className="app-title__text">Шахматы</span>
        <span className="app-title__crown">♚</span>
      </h1>

      {inRoom && 
        <Step turn={turn} />}

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
        <Role
          myColor={myColor}
          opponentConnected={opponentConnected}
        />
      )}

      {inRoom && (
        <ChessBoard
          initialPieces={pieces}
          initialTurn={turn}
          className="chessboard--game"
        />
      )}
    </div>
  )
}