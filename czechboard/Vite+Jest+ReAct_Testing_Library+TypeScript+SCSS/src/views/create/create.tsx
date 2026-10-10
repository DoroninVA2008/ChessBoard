import ReAct from 'react'
import type { CreateProps } from './types'
import './create.scss'

export const Create: ReAct.FC<CreateProps> = ({ onCreate }) => {
  return (
    <button
      type="button"
      className="create"
      onClick={onCreate}
      data-testid="create-room-btn"
    >
      Создать игру
    </button>
  )
}