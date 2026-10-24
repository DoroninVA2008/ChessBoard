import { createAction } from '@reduxjs/toolkit'
import type { PlayerColor } from './types'

export const createRoomRequest = createAction<PlayerColor>('lobby/createRoomRequest')
export const createRoomSuccess = createAction<{
  code: string
  color: PlayerColor
  token: string
}>('lobby/createRoomSuccess')
export const createRoomFailure = createAction<string>('lobby/createRoomFailure')

export const joinRoomRequest = createAction<string>('lobby/joinRoomRequest')
export const joinRoomSuccess = createAction<{
  code: string
  color: PlayerColor
  token: string
}>('lobby/joinRoomSuccess')
export const joinRoomFailure = createAction<string>('lobby/joinRoomFailure')

export const restoreSessionRequest = createAction('lobby/restoreSessionRequest')
export const restoreSessionSuccess = createAction<{
  state: import('../../shared/ws/room').RoomStateFromServer
  color: PlayerColor
} | null>('lobby/restoreSessionSuccess')
export const restoreSessionFailure = createAction<string>('lobby/restoreSessionFailure')