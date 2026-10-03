export type RoomCode = string

export type LobbyStatus =
  | 'idle'
  | 'choosing-side'          // ← НОВЫЙ статус
  | 'waiting-for-opponent'
  | 'joining'
  | 'connected'

export type PlayerColor = 'white' | 'black'

export type LobbyProps = {
  onCreateRoom: () => RoomCode
  onJoinRoom: (code: string) => void
  onChooseSide: (color: PlayerColor) => void
  onRandomSide: () => void
  onBackFromSideChoice: () => void
  status: LobbyStatus
  roomCode: RoomCode | null
  myColor: PlayerColor | null
  opponentConnected: boolean
}