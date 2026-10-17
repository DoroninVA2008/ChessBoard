import ReAct from 'react'
import { Chos } from './chos/chos'
import { Opponent } from './opponent/opponent'
import type { Prolles } from './types'
import './role.scss'

export const Role: ReAct.FC<Prolles> = ({ myColor, opponentConnected }) => {
  return (
    <div className="game-info">
      <Chos myColor={myColor} />
        <Opponent opponentConnected={opponentConnected} />
    </div>
  )
}