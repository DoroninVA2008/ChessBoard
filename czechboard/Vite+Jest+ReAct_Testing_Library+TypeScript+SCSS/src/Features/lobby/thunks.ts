import { createAsyncThunk, type Dispatch } from '@reduxjs/toolkit'
import { createRoom, joinRoom, getRoom } from './lob'
import { actions } from './state'
import type { PlayerColor, ColorChoice } from './types'
import type { RoomStateFromServer } from '../../shared/ws/room'

const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
const COLOR_KEY = 'chess.myColor'

export function readSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const code = localStorage.getItem(CODE_KEY)
  return token && code ? { token, code } : null
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CODE_KEY)
  localStorage.removeItem(COLOR_KEY)
}

function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

export const createRoomThunk = createAsyncThunk<
  { code: string; color: PlayerColor; token: string },
  PlayerColor,
  { rejectValue: string }
>('lobby/createRoom', async (color, { rejectWithValue }) => {
  try {
    const result = await createRoom(toColorChoice(color))
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(CODE_KEY, result.code)
    localStorage.setItem(COLOR_KEY, result.color)
    return { code: result.code, color: result.color, token: result.token }
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Не удалось создать комнату',
    )
  }
})

export const joinRoomThunk = createAsyncThunk<
  { code: string; color: PlayerColor; token: string },
  string,
  { rejectValue: string }
>('lobby/joinRoom', async (code, { rejectWithValue }) => {
  try {
    const result = await joinRoom(code.toUpperCase())
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(CODE_KEY, result.code)
    localStorage.setItem(COLOR_KEY, result.color)
    return { code: result.code, color: result.color, token: result.token }
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Не удалось подключиться',
    )
  }
})

export const restoreSessionThunk = createAsyncThunk<
  { state: RoomStateFromServer; color: PlayerColor } | null,
  void,
  { rejectValue: string }
>('lobby/restoreSession', async (_, { rejectWithValue }) => {
  const session = readSession()
  if (!session) return null

  try {
    const info = await getRoom(session.code, session.token)
    localStorage.setItem(COLOR_KEY, info.color)
    return { state: info.state, color: info.color }
  } catch (e) {
    clearSession()
    return rejectWithValue(
      e instanceof Error ? e.message : 'restore failed',
    )
  }
})
/**
 * Фабрика обработчиков: принимает dispatch и возвращает функции,
 * которые раньше были в useLobby. Не React-хук — можно вызывать
 * из любого места, где есть dispatch.
 */
export function createLobbyHandlers(dispatch: Dispatch) {
  const finalizeCreateRoom = (color: PlayerColor) => {
    dispatch(createRoomThunk(color))
  }

  return {
    handleCreateRoom: () => dispatch(actions.openSideChoice()),
    handleChooseSide: (color: PlayerColor) => finalizeCreateRoom(color),
    handleRandomSide: () => {
      const color: PlayerColor = Math.random() < 0.5 ? 'white' : 'black'
      finalizeCreateRoom(color)
    },
    handleBackFromSideChoice: () => dispatch(actions.backFromSideChoice()),
    handleJoinRoom: (code: string) => dispatch(joinRoomThunk(code)),
  }
}

export const thunks = {
  init: restoreSessionThunk,
  createRoom: createRoomThunk,
  joinRoom: joinRoomThunk,
  restoreSession: restoreSessionThunk,
}