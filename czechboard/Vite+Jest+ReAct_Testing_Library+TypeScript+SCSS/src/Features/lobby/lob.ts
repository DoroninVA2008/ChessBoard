import { AxiosAPIGETXML, AxiosAPIPOSTXML } from '../../shared/axiosxml.api'

// ─── Типы ответов бэка ─────────────────────────────────────────────
export type PlayerColor = 'white' | 'black'
export type ColorChoice = 'WHITE' | 'BLACK' | 'RANDOM'
export interface PlayerSlot {
  connected: boolean
}

export interface RoomState {
  code: string
  status: 'waiting' | 'playing' | 'finished'
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

export const Lob = AxiosAPIGETXML(`../api` || `http://localhost:8080/api`) // /api
export const Lobov = AxiosAPIGETXML(`../room` || `http://localhost:8080/room`) // /room

/** POST /api/rooms — создать комнату */
export function createRoom(color: ColorChoice = 'RANDOM') {
  return AxiosAPIPOSTXML<JoinResult, { color: ColorChoice }>(
    '/rooms',
    { color },
  )
}

/** POST /api/rooms/{code}/join — присоединиться к комнате */
export function joinRoom(code: string, color: ColorChoice = 'RANDOM') {
  return AxiosAPIPOSTXML<JoinResult, { color: ColorChoice }>(
    `/rooms/${code}/join`,
    { color },
  )
}

/** GET /api/rooms/{code} — получить состояние комнаты */
export function getRoom(code: string, token?: string) {
  return AxiosAPIGETXML<RoomState>(`/rooms/${code}`, {
    headers: token ? { 'X-Player-Token': token } : undefined,
  })
}