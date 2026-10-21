import type { PlayerColor } from '../types'

export type CodeProps = {
  roomCode: string
  myColor: PlayerColor | null
  opponentConnected: boolean
}