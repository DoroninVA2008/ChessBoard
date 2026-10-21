// import ReAct from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store' 
import './app.scss'
import { Main } from '../pages/main/main'

const root: HTMLElement = document.getElementById('root')!;

createRoot(root).render(
  <Provider store={store}>
    <Main />
  </Provider>,
)