import { AxiosAPIGETXML, AxiosAPIPOSTXML } from '../../shared/axiosxml.api'
import type { Piece, PieceColor } from '../chessboard/types'
import type { PlayerColor, LobbyStatus, RoomCode, ColorChoice } from './types'

export interface PlayerSlot {
  connected: boolean
}

export interface RoomState {
  code: string
  status: 'waiting' | 'ready' | 'playing' | 'finished'
  turn: PlayerColor
  players: {
    white: PlayerSlot | null
    black: PlayerSlot | null
  }
  moves: unknown[]
}

export interface JoinResult {
  code: string
  token: string
  color: PlayerColor
  state: RoomState
}

export interface RoomInfo {
  color: PlayerColor
  state: RoomState
}

export interface LobbyState {
  pieces: Piece[]
  turn: PieceColor
  myColor: PlayerColor
  opponentConnected: boolean
  status: LobbyStatus
  roomCode: RoomCode | null
  error: string | null
}

export function createRoom(color: ColorChoice = 'RANDOM') {
  return AxiosAPIPOSTXML<JoinResult, { color: ColorChoice }>(
    '/rooms',
    { color },
  )
}

export function joinRoom(code: string) {
  return AxiosAPIPOSTXML<JoinResult>(`/rooms/${code}/join`)
}

export function getRoom(code: string, token?: string) {
  return AxiosAPIGETXML<RoomInfo>(`/rooms/${code}`, {
    headers: token ? { 'X-Player-Token': token } : undefined,
  })
}