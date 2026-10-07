import type { CreateProps } from './crea'
import './create.scss'

export const Create = ({ onCreate }: CreateProps) => {
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