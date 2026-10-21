import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import type { Piece, PieceColor } from '../features/chessboard/types'
import type {/*LobbyStatus, RoomCode,*/ PlayerColor, ColorChoice } from '../features/lobby/types'
import { createRoom, joinRoom, getRoom } from '../features/lobby/lob'
import { openRoomSocket, type RoomSocket, type RoomStateFromServer } from '../shared/ws/room'
import { LobbyFeature } from '../features/lobby'

const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
const COLOR_KEY = 'chess.myColor'

function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

let roomSocketRef: RoomSocket | null = null

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

export const store = configureStore({
  reducer: {
    ...LobbyFeature.reducer
  },
})