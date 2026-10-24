import { all, fork } from 'redux-saga/effects'
import { LobbyFeature } from '../../features/lobby'

export function* rootSaga() {
  yield all([
    fork(LobbyFeature.sagas.lobby),
  ])
}