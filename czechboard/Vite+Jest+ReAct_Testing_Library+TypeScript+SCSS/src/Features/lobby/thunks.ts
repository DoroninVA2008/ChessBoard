import { createRoom } from './lob'
import type { PlayerColor } from './types'

export const createRoomThunk = createAsyncThunk<{ code: string; color: PlayerColor; token: string }, PlayerColor, { rejectValue: string }>('lobby/createRoom', async (color, { rejectWithValue }) => {
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

export const joinRoomThunk = createAsyncThunk<{ code: string; color: PlayerColor; token: string }, string, { rejectValue: string }>('lobby/joinRoom', async (code, { rejectWithValue }) => {
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

export const thunks = {
    *init() {
        // Что то что должно загружаться при инициализации этой фичи например createRoomThunk и тут же соотносишь экшины и санки!!!
    }
}