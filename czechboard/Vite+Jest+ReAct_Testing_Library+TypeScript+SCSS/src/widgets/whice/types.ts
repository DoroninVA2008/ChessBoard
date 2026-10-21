import type { PlayerColor } from '../../features/lobby/types'

export type WhiteProps = {
  onChoose: (color: PlayerColor) => void
}