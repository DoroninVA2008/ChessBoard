import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Dispatch } from '@reduxjs/toolkit'
import { initialPosition } from '../chessboard/moves'
import { openRoomSocket, type RoomSocket, type RoomStateFromServer } from '../../shared/ws/room'
import { getRoom, type LobbyState } from './lob'
import { createRoomThunk, joinRoomThunk, restoreSessionThunk, readSession } from './thunks'
import type { PlayerColor } from './types'

function fromServerColor(color: 'white' | 'black'): PlayerColor {
  return color
}

const initialState: LobbyState = {
  pieces: initialPosition(),
  turn: 'white',
  myColor: 'white',
  opponentConnected: false,
  status: 'idle',
  roomCode: null,
  error: null,
}

function applyRoomStateToDraft(
  draft: LobbyState,
  state: RoomStateFromServer,
) {
  draft.turn = state.turn

  const whiteConnected = state.players?.white?.connected === true
  const blackConnected = state.players?.black?.connected === true
  draft.opponentConnected = whiteConnected && blackConnected

  if (state.status === 'ready' || state.status === 'playing') {
    draft.status = 'connected'
  } else if (state.status === 'waiting') {
    draft.status = 'waiting-for-opponent'
  }
}

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    openSideChoice(state) {
      state.error = null
      state.status = 'choosing-side'
    },
    backFromSideChoice(state) {
      state.status = 'idle'
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    roomStateReceived(state, action: PayloadAction<RoomStateFromServer>) {
      applyRoomStateToDraft(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRoomThunk.pending, (state) => {
      state.error = null
    })
    builder.addCase(createRoomThunk.fulfilled, (state, action) => {
      state.roomCode = action.payload.code
      state.myColor = fromServerColor(action.payload.color)
      state.status = 'waiting-for-opponent'
    })
    builder.addCase(createRoomThunk.rejected, (state, action) => {
      state.error = action.payload ?? 'Не удалось создать комнату'
      state.status = 'idle'
    })

    builder.addCase(joinRoomThunk.pending, (state) => {
      state.error = null
    })
    builder.addCase(joinRoomThunk.fulfilled, (state, action) => {
      state.roomCode = action.payload.code
      state.myColor = fromServerColor(action.payload.color)
      state.status = 'connected'
    })
    builder.addCase(joinRoomThunk.rejected, (state, action) => {
      state.error = action.payload ?? 'Не удалось подключиться'
    })

    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      if (!action.payload) return
      state.roomCode = action.payload.state.code
      state.myColor = fromServerColor(action.payload.color)
      applyRoomStateToDraft(state, action.payload.state)
    })
    builder.addCase(restoreSessionThunk.rejected, (state) => {
      state.status = 'idle'
    })
  },
})

export const { name, reducer, actions } = lobbySlice

let roomSocketRef: RoomSocket | null = null
/**
 * Подключение к комнате через WebSocket.
 * Возвращает cleanup-функцию для useEffect.
 * Живёт в state.ts, потому что это «боковой эффект состояния» фичи.
 */
export function connectRoomSocket(dispatch: Dispatch) {
  if (roomSocketRef) return () => {}

  const session = readSession()
  if (!session) return () => {}

  const { code, token } = session

  const ws = openRoomSocket({
    code,
    token,
    onState: (state) => dispatch(actions.roomStateReceived(state)),
    onConnected: () => console.log('[WS] connected to room', code),
    onSubscribed: () => {
      getRoom(code, token)
        .then((info) => dispatch(actions.roomStateReceived(info.state)))
        .catch((e) => console.error('[WS] initial getRoom failed:', e))
    },
    onDisconnected: () => console.log('[WS] disconnected from room', code),
    onError: (msg) => console.error('[WS] error:', msg),
  })

  roomSocketRef = ws

  return () => {
    ws.disconnect()
    roomSocketRef = null
  }
}