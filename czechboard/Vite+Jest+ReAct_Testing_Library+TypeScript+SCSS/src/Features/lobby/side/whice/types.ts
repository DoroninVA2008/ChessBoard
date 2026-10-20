import type { PlayerColor } from '../../../lobby/types'

export type WhiteProps = {
  onChoose: (color: PlayerColor) => void
}