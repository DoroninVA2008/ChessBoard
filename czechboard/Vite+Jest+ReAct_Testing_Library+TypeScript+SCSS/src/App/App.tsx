import ReAct, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, useAppDispatch, appMounted } from './store'
import { Main } from '../pages/main/main'
import './app.scss'

const App: ReAct.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(appMounted())
  }, [dispatch])

  return <Main />
}

const root: HTMLElement = document.getElementById('root')!

createRoot(root).render(
  <Provider store={store}>
    <App />
  </Provider>,
)