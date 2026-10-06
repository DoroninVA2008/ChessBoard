import type { CreateProps } from './crea'
// import './creat.scss'

export const Create = ({ onCreate }: CreateProps) => {
  return (
    <button
      type="button"
      className="lobby__btn lobby__btn--primary"
      onClick={onCreate}
      data-testid="create-room-btn"
    >
      Создать игру
    </button>
  )
}