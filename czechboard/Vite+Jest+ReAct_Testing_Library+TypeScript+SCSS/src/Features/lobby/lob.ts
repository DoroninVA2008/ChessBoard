import { AxiosAPIGETXML, AxiosAPIPOSTXML } from '../../shared/axiosxml.api'

// ─── Типы ответов бэка ─────────────────────────────────────────────
export type PlayerColor = 'white' | 'black'
export type ColorChoice = 'WHITE' | 'BLACK' | 'RANDOM'

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

/** Ответ POST /api/rooms и POST /api/rooms/{code}/join */
export interface JoinResult {
  code: string
  token: string
  color: PlayerColor
  state: RoomState
}

/** Ответ GET /api/rooms/{code} — обёртка {color, state} */
export interface RoomInfo {
  color: PlayerColor
  state: RoomState
}

// ─── Эндпоинты (пути БЕЗ /api — baseURL его подставит) ────────────

/**
 * POST /api/rooms
 * Тело: { color: 'WHITE' | 'BLACK' | 'RANDOM' }
 * Ответ: 201 { code, token, color, state }
 *
 * Создаёт новую комнату. Создатель сразу получает токен и свой цвет
 * (при RANDOM бэк сам выбирает и возвращает реальный цвет).
 */
export function createRoom(color: ColorChoice = 'RANDOM') {
  return AxiosAPIPOSTXML<JoinResult, { color: ColorChoice }>(
    '/rooms',
    { color },
  )
}

/**
 * POST /api/rooms/{code}/join
 * Тело: пустое (по README)
 * Ответ: 200 { code, token, color, state }
 *
 * Подключает второго игрока. Цвет выбирается автоматически:
 * противоположный тому, который занят создателем.
 * Ошибки: 404 ROOM_NOT_FOUND, 409 ROOM_FULL, 409 ROOM_CLOSED.
 */
export function joinRoom(code: string) {
  return AxiosAPIPOSTXML<JoinResult>(`/rooms/${code}/join`)
}

/**
 * GET /api/rooms/{code}
 * Заголовок: X-Player-Token
 * Ответ: 200 { color, state }
 *
 * Возвращает состояние комнаты и твой цвет в ней (по токену).
 * Используется для восстановления сессии и после SUBSCRIBE,
 * чтобы не пропустить первый снимок из WS-топика.
 */
export function getRoom(code: string, token?: string) {
  return AxiosAPIGETXML<RoomInfo>(`/rooms/${code}`, {
    headers: token ? { 'X-Player-Token': token } : undefined,
  })
}