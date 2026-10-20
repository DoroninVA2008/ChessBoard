import ReAct from 'react'
import './choice.scss'

export const Choice: ReAct.FC = () => {
  return (
    <header className="choicer">
      <span className="chown" aria-hidden>
        ♔
      </span>
      <h2 id="side-choice-title" className="choitle">
        ВЫБОР СТОРОНЫ
      </h2>
      <span className="chown" aria-hidden>
        ♚
      </span>
    </header>
  )
}