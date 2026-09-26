export type RoomCode = string

export type LobbyStatus =
  | 'idle'
  | 'waiting-for-opponent'
  | 'joining'
  | 'connected'

export type PlayerColor = 'white' | 'black'