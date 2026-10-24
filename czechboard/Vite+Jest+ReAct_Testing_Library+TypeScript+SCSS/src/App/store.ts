import { useDispatch, useSelector } from 'react-redux'
import { configureStore, createAction } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { LobbyFeature } from '../features/lobby'
import { rootSaga } from './rootSaga/rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    ...LobbyFeature.reducer,
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector = useSelector.withTypes<RootState>()
export const appMounted = createAction('app/mounted')