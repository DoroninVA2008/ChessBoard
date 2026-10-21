import ReAct from 'react'
import './role.scss'
import type { Prolles } from './types'
import { Chos } from '../../views/chos/chos'
import { Opponent } from '../../views/opponent/opponent'
import { useSelector } from 'react-redux'
import { LobbyFeature } from '../../features/lobby'

export const Role: ReAct.FC<Prolles> = ({ myColor, opponentConnected }) => {
  // const myColor = useSelector(LobbyFeature.selectors.myColor);

  return (
    <div className="game-info">
      <Chos myColor={myColor} />
        <Opponent opponentConnected={opponentConnected} />
    </div>
  )
}