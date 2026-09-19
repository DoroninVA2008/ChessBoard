// import { useState } from 'react'
import { ChessBoard } from './chessboard/chessboard'
import './App.scss'

function App() {
  return (
    <>
      <div className="app">
        <h1>
          ReAct`ивная шахматная доска!
        </h1>
        <ChessBoard />
      </div>
    </>
  )
}

export default App
