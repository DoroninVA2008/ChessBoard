import { ChessBoard } from '../features/chessboard/chessboard'
import { Lobby } from '../features/lobby/lobby'
import { store } from './store'
import './app.scss'

export default function App() {
    const {
    pieces,
    turn,
    setTurn,                    // ← ДОБАВИТЬ
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
        turn={turn}                    // ← ДОБАВИТЬ
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