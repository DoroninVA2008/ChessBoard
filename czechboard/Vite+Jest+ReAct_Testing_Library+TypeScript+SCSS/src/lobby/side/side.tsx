import './side.scss'
import type { PlayerColor } from '../types'

type SideChoiceProps = {
  onChoose: (color: PlayerColor) => void
  onRandom: () => void
  onBack: () => void
}

export const SideChoice = ({ onChoose, onRandom, onBack }: SideChoiceProps) => {
  return (
    <div className="side-choice" data-testid="side-choice">
      <header className="side-choice__header">
        <span className="side-choice__crown" aria-hidden>♔</span>
        <h2 className="side-choice__title">ВЫБОР СТОРОНЫ</h2>
        <span className="side-choice__crown" aria-hidden>♚</span>
      </header>
      <p className="side-choice__subtitle">За кого будешь играть?</p>

      <div className="side-choice__cards">
        {/* Белые */}
        <article className="side-card" data-testid="side-card-white">
          <div className="side-card__icon" aria-hidden>♔</div>
          <h3 className="side-card__name">Белые</h3>
          <p className="side-card__desc">
            Ходят первыми. Задают темп партии. Классический выбор для тех, кто любит атаковать.
          </p>
          <button
            type="button"
            className="side-card__btn"
            onClick={() => onChoose('white')}
            data-testid="choose-white-btn"
          >
            Играть за белых
          </button>
        </article>

        {/* Чёрные */}
        <article className="side-card" data-testid="side-card-black">
          <div className="side-card__icon" aria-hidden>♚</div>
          <h3 className="side-card__name">Чёрные</h3>
          <p className="side-card__desc">
            Ходят вторыми. Отвечают на ход соперника. Выбор для тех, кто любит контратаку и стратегию.
          </p>
          <button
            type="button"
            className="side-card__btn"
            onClick={() => onChoose('black')}
            data-testid="choose-black-btn"
          >
            Играть за чёрных
          </button>
        </article>
      </div>

      <div className="side-choice__actions">
        <button
          type="button"
          className="side-choice__btn"
          onClick={onRandom}
          data-testid="random-side-btn"
        >
          Случайный выбор
        </button>
        <button
          type="button"
          className="side-choice__btn"
          onClick={onBack}
          data-testid="back-btn"
        >
          Назад
        </button>
      </div>
    </div>
  )
}