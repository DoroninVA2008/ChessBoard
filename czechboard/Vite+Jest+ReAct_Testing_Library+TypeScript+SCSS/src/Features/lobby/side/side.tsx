import { useEffect } from 'react'
import './side.scss'
import type { PlayerColor } from '../types'

type SideChoiceProps = {
  onChoose: (color: PlayerColor) => void
  onRandom: () => void
  onBack: () => void
}

export const SideChoice = ({ onChoose, onRandom, onBack }: SideChoiceProps) => {
  // Закрытие по Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onBack])

  // Клик строго по фону, не по окну
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onBack()
  }

  return (
    <div
      className="side-choice-overlay"
      onClick={handleOverlayClick}
      data-testid="side-choice-overlay"
    >
      <div
        className="side-choice"
        data-testid="side-choice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-choice-title"
      >
        <header className="side-choice__header">
          <span className="side-choice__crown" aria-hidden>♔</span>
          <h2 id="side-choice-title" className="side-choice__title">
            ВЫБОР СТОРОНЫ
          </h2>
          <span className="side-choice__crown" aria-hidden>♚</span>
        </header>
        <p className="side-choice__subtitle">За кого будешь играть?</p>

        <div className="side-choice__cards">
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
    </div>
  )
}