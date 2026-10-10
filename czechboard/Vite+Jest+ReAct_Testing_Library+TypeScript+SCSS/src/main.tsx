import ReAct from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { App } from './app/app'

const root: HTMLElement = document.getElementById('root')!;

createRoot(root).render(
  <ReAct.StrictMode>
    <App />
  </ReAct.StrictMode>,
)