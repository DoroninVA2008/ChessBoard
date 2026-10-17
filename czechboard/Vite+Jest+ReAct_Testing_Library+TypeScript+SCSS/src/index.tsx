// import ReAct from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store' 
import './index.scss'
import { App } from './app/app'

const root: HTMLElement = document.getElementById('root')!;

createRoot(root).render(
  <Provider store={store}>
    <App />
  </Provider>,
)