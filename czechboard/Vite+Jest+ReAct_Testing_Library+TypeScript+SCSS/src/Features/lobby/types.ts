import type { PieceColor } from '../chessboard/chesbor'

export type LobbyStatus =
  | 'idle'
  | 'choosing-side'
  | 'waiting-for-opponent'
  | 'joining'
  | 'connected'

export type PlayerColor = 'white' | 'black'
export type RoomCode = string

export type LobbyProps = {
  onCreateRoom: () => void
  onJoinRoom: (code: RoomCode) => void
  onChooseSide: (color: PlayerColor) => void
  onRandomSide: () => void
  onBackFromSideChoice: () => void
  status: LobbyStatus
  roomCode: RoomCode | null
  myColor: PlayerColor | null
  opponentConnected: boolean
  turn: PieceColor
}