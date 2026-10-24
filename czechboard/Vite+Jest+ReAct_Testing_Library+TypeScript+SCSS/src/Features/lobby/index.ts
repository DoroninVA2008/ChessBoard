import { actions, name, reducer, connectRoomSocket } from './state'
import * as lobbyActions from './actions'
import { lobbySaga } from './sagas'
import { readSession, clearSession } from './storage'

export const LobbyFeature = {
  reducer: { [name]: reducer },
  actions: {
    ...actions,
    ...lobbyActions,
  },
  sagas: {
    lobby: lobbySaga,
  },
  socket: {
    connect: connectRoomSocket,
  },
  session: {
    read: readSession,
    clear: clearSession,
  },
}