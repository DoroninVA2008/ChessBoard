import type { AppDispatch } from '../store'
import { LobbyFeature } from '../../features/lobby'

export const rootThunk = (dispatch: AppDispatch) => {
  dispatch(LobbyFeature.thunks.init())
}