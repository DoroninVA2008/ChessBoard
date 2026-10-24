import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { LobbyFeature } from './index'
import type { PlayerColor } from './types'

export function useLobby() {
  const dispatch = useAppDispatch()

  const pieces = useAppSelector((s) => s.lobby.pieces)
  const turn = useAppSelector((s) => s.lobby.turn)
  const myColor = useAppSelector((s) => s.lobby.myColor)
  const opponentConnected = useAppSelector((s) => s.lobby.opponentConnected)
  const status = useAppSelector((s) => s.lobby.status)
  const roomCode = useAppSelector((s) => s.lobby.roomCode)
  const error = useAppSelector((s) => s.lobby.error)

  useEffect(() => {
    if (status !== 'waiting-for-opponent' && status !== 'connected') return
    return LobbyFeature.socket.connect(dispatch)
  }, [status, dispatch])

  const handlers = {
    handleCreateRoom: () => dispatch(LobbyFeature.actions.openSideChoice()),
    handleChooseSide: (color: PlayerColor) =>
      dispatch(LobbyFeature.actions.createRoomRequest(color)),
    handleRandomSide: () => {
      const color: PlayerColor = Math.random() < 0.5 ? 'white' : 'black'
      dispatch(LobbyFeature.actions.createRoomRequest(color))
    },
    handleBackFromSideChoice: () =>
      dispatch(LobbyFeature.actions.backFromSideChoice()),
    handleJoinRoom: (code: string) =>
      dispatch(LobbyFeature.actions.joinRoomRequest(code)),
  }

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return {
    pieces, turn, myColor, opponentConnected, status, roomCode, inRoom, error,
    ...handlers,
  }
}