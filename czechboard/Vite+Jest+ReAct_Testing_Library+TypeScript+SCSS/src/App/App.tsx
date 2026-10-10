import ReAct from 'react'
import { ChessBoard } from '../features/chessboard/chessboard'
import { Lobby } from '../features/lobby/lobby'
import { store } from './store'
import './app.scss'

export const App: ReAct.FC = () => {
  const {
    pieces,
    turn,
    setTurn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  } = store()

  return (
    <div className="app">
      <Lobby
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onChooseSide={handleChooseSide}
        onRandomSide={handleRandomSide}
        onBackFromSideChoice={handleBackFromSideChoice}
        status={status}
        roomCode={roomCode}
        myColor={myColor}
        opponentConnected={opponentConnected}
        turn={turn}
      />
        {inRoom && (
          <ChessBoard
            initialPieces={pieces}
            initialTurn={turn}
            className="chessboard--game"
            onTurnChange={setTurn}
          />
        )}
    </div>
  )
}