import { useState } from 'react'
import {
  type Piece,
  type PieceColor,
  initialPosition,
} from '../Features/chessboard/chesbor'
import type { LobbyStatus, RoomCode, PlayerColor } from '../Features/lobby/types'

export function store() {
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

  return {// состояние
    pieces,
    setPieces,
    turn,
    setTurn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,// действия
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  }
}