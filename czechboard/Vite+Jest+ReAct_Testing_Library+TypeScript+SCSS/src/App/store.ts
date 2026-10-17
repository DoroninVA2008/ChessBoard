import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { configureStore, createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Piece, PieceColor } from '../features/chessboard/types'
import type { LobbyStatus, RoomCode, PlayerColor, ColorChoice } from '../features/lobby/types'
import { initialPosition } from '../features/chessboard/moves'
import { createRoom, joinRoom, getRoom } from '../features/lobby/lob'
import { openRoomSocket, type RoomSocket, type RoomStateFromServer } from '../shared/ws/room'

const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
const COLOR_KEY = 'chess.myColor'

function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

function fromServerColor(color: 'white' | 'black'): PlayerColor {
  return color
}

let roomSocketRef: RoomSocket | null = null

interface LobbyState {
  pieces: Piece[]
  turn: PieceColor
  myColor: PlayerColor
  opponentConnected: boolean
  status: LobbyStatus
  roomCode: RoomCode | null
  error: string | null
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

const createRoomThunk = createAsyncThunk<{ code: string; color: PlayerColor; token: string }, PlayerColor, { rejectValue: string }>('lobby/createRoom', async (color, { rejectWithValue }) => {
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

const joinRoomThunk = createAsyncThunk<
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

const restoreSessionThunk = createAsyncThunk<
  { state: RoomStateFromServer; color: PlayerColor } | null,
  void,
  { rejectValue: string }
>('lobby/restoreSession', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(TOKEN_KEY)
  const code = localStorage.getItem(CODE_KEY)
  if (!token || !code) return null

  try {
    const info = await getRoom(code, token)
    localStorage.setItem(COLOR_KEY, info.color)
    return { state: info.state, color: info.color }
  } catch (e) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CODE_KEY)
    localStorage.removeItem(COLOR_KEY)
    return rejectWithValue(
      e instanceof Error ? e.message : 'restore failed',
    )
  }
})

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

const {
  openSideChoice,
  backFromSideChoice,
  // clearError,
  roomStateReceived,
} = lobbySlice.actions

export const store = configureStore({
  reducer: {
    lobby: lobbySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const useAppDispatch: () => AppDispatch = useDispatch
const useAppSelector = useSelector.withTypes<RootState>()

export function useReduxStore() {
  const dispatch = useAppDispatch()

  const pieces = useAppSelector((s) => s.lobby.pieces)
  const turn = useAppSelector((s) => s.lobby.turn)
  const myColor = useAppSelector((s) => s.lobby.myColor)
  const opponentConnected = useAppSelector((s) => s.lobby.opponentConnected)
  const status = useAppSelector((s) => s.lobby.status)
  const roomCode = useAppSelector((s) => s.lobby.roomCode)
  const error = useAppSelector((s) => s.lobby.error)

  useEffect(() => {
    if (import.meta.env.DEV) return
    dispatch(restoreSessionThunk())
  }, [dispatch])

  // ---------- ЭФФЕКТ: WebSocket ----------
  useEffect(() => {
    if (status !== 'waiting-for-opponent' && status !== 'connected') {
      return
    }
    if (roomSocketRef) return

    const token = localStorage.getItem(TOKEN_KEY)
    const code = localStorage.getItem(CODE_KEY)
    if (!token || !code) return

    const setters = {
      onState: (state: RoomStateFromServer) =>
        dispatch(roomStateReceived(state)),
    }

    const ws = openRoomSocket({
      code,
      token,
      onState: (state) => setters.onState(state),
      onConnected: () => {
        console.log('[WS] connected to room', code)
      },
      onSubscribed: () => {
        console.log('[WS] subscribed, fetching initial state via REST')
        getRoom(code, token)
          .then((info) => {
            dispatch(roomStateReceived(info.state))
          })
          .catch((e) => console.error('[WS] initial getRoom failed:', e))
      },
      onDisconnected: () => {
        console.log('[WS] disconnected from room', code)
      },
      onError: (msg) => {
        console.error('[WS] error:', msg)
      },
    })

    roomSocketRef = ws

    return () => {
      ws.disconnect()
      roomSocketRef = null
    }
  }, [status, dispatch])

  function handleCreateRoom() {
    dispatch(openSideChoice())
  }

  function finalizeCreateRoom(color: PlayerColor) {
    dispatch(createRoomThunk(color))
  }

  function handleChooseSide(color: PlayerColor) {
    finalizeCreateRoom(color)
  }

  function handleRandomSide() {
    const color: PlayerColor = Math.random() < 0.5 ? 'white' : 'black'
    finalizeCreateRoom(color)
  }

  function handleBackFromSideChoice() {
    dispatch(backFromSideChoice())
  }

  function handleJoinRoom(code: string) {
    dispatch(joinRoomThunk(code))
  }

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return {
    pieces,
    setPieces: (p: Piece[] | ((prev: Piece[]) => Piece[])) => {
      console.warn(
        '[store] setPieces is not implemented in the Redux version yet',
        p,
      )
    },
    turn,
    setTurn: (t: PieceColor) => {
      console.warn(
        '[store] setTurn is not implemented in the Redux version yet',
        t,
      )
    },
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    error,
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  }
}