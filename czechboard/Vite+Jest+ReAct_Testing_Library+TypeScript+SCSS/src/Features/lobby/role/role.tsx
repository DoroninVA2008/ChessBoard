import type { Prolles } from './roll'
import './role.scss'

export function Role({ myColor, opponentConnected }: Prolles) {
  return (
    <div className="game-info">
      <div className="game-info__item">
        Вы играете за:{' '}
        <strong>{myColor === 'white' ? 'белых' : 'чёрных'}</strong>
      </div>

      <div className="game-info__item">
        Соперник:{' '}
        <strong className={opponentConnected ? 'ok' : 'wait'}>
          {opponentConnected ? 'подключён' : 'ожидание…'}
        </strong>
      </div>
    </div>
  )
}