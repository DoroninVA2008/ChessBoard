import { useState } from 'react'
import type { Piece, PieceColor } from '../features/chessboard/types'
import type { LobbyStatus, RoomCode, PlayerColor } from '../features/lobby/types'
import { initialPosition } from '../features/chessboard/moves'

export function store() {
  const [pieces, setPieces] = useState<Piece[]>(initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PieceColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)

  function handleCreateRoom() {
    setStatus('choosing-side')
  }

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

  function handleJoinRoom(_code: string) {
    setStatus('connected')
    setMyColor('black')
    setOpponentConnected(true)
  }

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return {
    pieces,
    setPieces,
    turn,
    setTurn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  }
}