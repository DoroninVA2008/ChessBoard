import { actions, name, reducer, connectRoomSocket } from './state'
import { thunks,
  createLobbyHandlers,
  readSession,
  clearSession } from './thunks'

export const LobbyFeature = {
  reducer: {
    [name]: reducer,
  },
  actions,
  thunks,
  handlers: {
    create: createLobbyHandlers,
  },
  socket: {
    connect: connectRoomSocket,
  },
  session: {
    read: readSession,
    clear: clearSession,
  },
}