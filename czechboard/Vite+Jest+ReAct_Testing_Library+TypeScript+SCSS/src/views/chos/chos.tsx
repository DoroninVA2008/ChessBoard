import ReAct from 'react'
import type { Choose } from './types'
// import './chos.scss'

export const Chos: ReAct.FC<Choose> = ({ myColor }) => {
  return (
    <div className="game-info__item">
      Вы играете за:{' '}
      <strong>
        {myColor === 'white' ? 'белых' : 'чёрных'}
      </strong>
    </div>
  )
}