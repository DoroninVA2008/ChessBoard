import { ChessBoard } from '../features/chessboard/chessboard'
import { Lobby } from '../features/lobby/lobby'
import { Role } from '../features/lobby/role/role'
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
      {/*<h1 className="app-title">
        <span className="app-title__crown">♔</span>
        <span className="app-title__text">Шахматы</span>
        <span className="app-title__crown">♚</span>
      </h1>*/}

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
        turn={turn}                    // ← ДОБАВИТЬ
      />

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