import type { PlayerColor } from '../types'

export type SideChoiceProps = {
  onChoose: (color: PlayerColor) => void
  onRandom: () => void
  onBack: () => void
}