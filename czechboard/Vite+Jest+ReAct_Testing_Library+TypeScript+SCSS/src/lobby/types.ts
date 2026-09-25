export type RoomCode = string

export type LobbyStatus =
  | 'idle'
  | 'creating'
  | 'waiting-for-opponent'
  | 'joining'
  | 'connected'

export type PlayerColor = 'white' | 'black'