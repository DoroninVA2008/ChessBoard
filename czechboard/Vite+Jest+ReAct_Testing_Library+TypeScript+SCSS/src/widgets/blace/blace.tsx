import ReAct from 'react'
import type { BlackProps } from './types'
import { Black } from '../../views/black/black'

export const Blace: ReAct.FC<BlackProps> = ({ onChoose }) => {
  return (
    <article className="side-card" data-testid="side-card-black">
      <div className="side-card__icon" aria-hidden>
        ♚
      </div>
      <h3 className="side-card__name">
        Чёрные
      </h3>
      <p className="side-card__desc">
        Ходят вторыми. Отвечают на ход соперника. Выбор для тех, кто любит контратаку и стратегию.
      </p>
        <Black onChoose={onChoose} />
    </article>
  )
}