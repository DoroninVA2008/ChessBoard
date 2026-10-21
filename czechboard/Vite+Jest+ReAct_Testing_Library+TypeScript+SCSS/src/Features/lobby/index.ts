import { actions, name, reducer } from './state'
import { thunks } from './thunks'

export const LobbyFeature = {
    reducer: {
        [name]: reducer
    },
    actions,
    thunks: {
        init: thunks.init
    }
}