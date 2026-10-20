import ReAct from 'react'
import { White } from '../../../../views/white/white'
import type { WhiteProps } from './types'

export const Whice: ReAct.FC<WhiteProps> = ({ onChoose }) => {
  return (
    <article className="side-card" data-testid="side-card-white">
      <div className="side-card__icon" aria-hidden>
        ♔
      </div>
      <h3 className="side-card__name">
        Белые
      </h3>
      <p className="side-card__desc">
        Ходят первыми. Задают темп партии. Классический выбор для тех, кто любит атаковать.
      </p>
        <White onChoose={onChoose} />
    </article>
  )
}