import ReAct from 'react'
import { useLobby } from '../../features/lobby/lob' // Исправить
import './main.scss'
import { ChessBoard } from '../../features/chessboard/chessboard'
import { Lobby } from '../../features/lobby/lobby'

export const Main: ReAct.FC = () => {
  const {
    pieces,
    turn,
    setTurn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    error,
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  } = useLobby()

  return (
    <div className="main">
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
        error={error}
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