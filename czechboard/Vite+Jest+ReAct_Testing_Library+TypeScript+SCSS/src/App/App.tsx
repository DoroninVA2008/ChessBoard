import { ChessBoard } from '../Features/chessboard/chessboard'
import { Lobby } from '../Features/lobby/lobby'
import { Role } from '../Features/chessboard/role/role'
import { Step } from '../Features/chessboard/step/step'
import { store } from './store'
import './App.scss'

export default function App() {
  const {
    pieces,
    turn,
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
      <h1 className="app-title">
        <span className="app-title__crown">♔</span>
        <span className="app-title__text">Шахматы</span>
        <span className="app-title__crown">♚</span>
      </h1>

      {inRoom && <Step turn={turn} />}

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
      />

      {inRoom && (
        <Role myColor={myColor} opponentConnected={opponentConnected} />
      )}

      {inRoom && (
        <ChessBoard
          initialPieces={pieces}
          initialTurn={turn}
          className="chessboard--game"
        />
      )}
    </div>
  )
}