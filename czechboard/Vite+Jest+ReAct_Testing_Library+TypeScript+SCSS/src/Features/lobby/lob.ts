import { useEffect, useMemo } from 'react'
import { AxiosAPIGETXML, AxiosAPIPOSTXML } from '../../shared/axiosxml.api'
import { useAppDispatch, useAppSelector, type RootState } from '../../app/store'
import type { Piece, PieceColor } from '../chessboard/types'
import type { PlayerColor, LobbyStatus, RoomCode, ColorChoice } from './types'
import { LobbyFeature } from './index'

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

export function useLobby() {
  const dispatch = useAppDispatch()

  const pieces = useAppSelector((s: RootState) => s.lobby.pieces)
  const turn = useAppSelector((s: RootState) => s.lobby.turn)
  const myColor = useAppSelector((s: RootState) => s.lobby.myColor)
  const opponentConnected = useAppSelector((s: RootState) => s.lobby.opponentConnected)
  const status = useAppSelector((s: RootState) => s.lobby.status)
  const roomCode = useAppSelector((s: RootState) => s.lobby.roomCode)
  const error = useAppSelector((s: RootState) => s.lobby.error)
  // Восстановление сессии при старте
  useEffect(() => {
    if (import.meta.env.DEV) return
    dispatch(LobbyFeature.thunks.init())
  }, [dispatch])
  // WebSocket-подключение, когда мы в комнате
  useEffect(() => {
    if (status !== 'waiting-for-opponent' && status !== 'connected') return
    return LobbyFeature.socket.connect(dispatch)
  }, [status, dispatch])
  // Обработчики из фабрики
  const handlers = useMemo(
    () => LobbyFeature.handlers.create(dispatch),
    [dispatch],
  )

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return {
    pieces,
    turn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    error,
    ...handlers,
  }
}