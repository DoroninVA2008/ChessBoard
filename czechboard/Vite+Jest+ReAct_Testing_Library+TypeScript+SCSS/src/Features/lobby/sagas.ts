import { call, put, takeLatest, all, fork } from 'redux-saga/effects'
import { createRoom, joinRoom, getRoom } from './lob'
import {
  createRoomRequest,
  createRoomSuccess,
  createRoomFailure,
  joinRoomRequest,
  joinRoomSuccess,
  joinRoomFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
} from './actions'
import { appMounted } from '../../app/store'
import { readSession, clearSession } from './storage'
import type { PlayerColor, ColorChoice } from './types'

const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
const COLOR_KEY = 'chess.myColor'

function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

function* createRoomSaga(action: ReturnType<typeof createRoomRequest>) {
  try {
    const color = action.payload
    const result: Awaited<ReturnType<typeof createRoom>> = yield call(
      createRoom,
      toColorChoice(color),
    )
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(CODE_KEY, result.code)
    localStorage.setItem(COLOR_KEY, result.color)
    yield put(createRoomSuccess({
      code: result.code,
      color: result.color,
      token: result.token,
    }))
  } catch (e) {
    yield put(createRoomFailure(
      e instanceof Error ? e.message : 'Не удалось создать комнату',
    ))
  }
}

function* joinRoomSaga(action: ReturnType<typeof joinRoomRequest>) {
  try {
    const code = action.payload
    const result: Awaited<ReturnType<typeof joinRoom>> = yield call(
      joinRoom,
      code.toUpperCase(),
    )
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(CODE_KEY, result.code)
    localStorage.setItem(COLOR_KEY, result.color)
    yield put(joinRoomSuccess({
      code: result.code,
      color: result.color,
      token: result.token,
    }))
  } catch (e) {
    yield put(joinRoomFailure(
      e instanceof Error ? e.message : 'Не удалось подключиться',
    ))
  }
}

function* restoreSessionSaga() {
  const session = readSession()
  if (!session) {
    yield put(restoreSessionSuccess(null))
    return
  }

  try {
    const info: Awaited<ReturnType<typeof getRoom>> = yield call(
      getRoom,
      session.code,
      session.token,
    )
    localStorage.setItem(COLOR_KEY, info.color)
    yield put(restoreSessionSuccess({ state: info.state, color: info.color }))
  } catch (e) {
    clearSession()
    yield put(restoreSessionFailure(
      e instanceof Error ? e.message : 'restore failed',
    ))
  }
}

export function* lobbySaga() {
  yield all([
    takeLatest(createRoomRequest.type, createRoomSaga),
    takeLatest(joinRoomRequest.type, joinRoomSaga),
    takeLatest(restoreSessionRequest.type, restoreSessionSaga),
    takeLatest(appMounted.type, function* onAppMounted() {
      yield put(restoreSessionRequest())
    }),
  ])
}