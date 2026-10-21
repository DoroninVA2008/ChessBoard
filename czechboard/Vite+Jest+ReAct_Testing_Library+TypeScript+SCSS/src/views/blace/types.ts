import type { PlayerColor } from '../../../lobby/types'

export type BlackProps = {
  onChoose: (color: PlayerColor) => void
}