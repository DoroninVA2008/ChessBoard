import type { PlayerColor } from '../../features/lobby/types'

export type BlackProps = {
  onChoose: (color: PlayerColor) => void
}