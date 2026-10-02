import './chessboard.scss'
import type { Props } from './chesbor'
import { FILES, useChessBoard } from './chesbor'
import { Square as SquareComp } from './square/square'
import { Pieces } from './pieces/pieces'
import { Coords } from './coords/coords'
import { ChessButtons } from './chesbutons/chesbutons'

export function ChessBoard({
  initialPieces,
  initialTurn = 'white',
  className,
}: Props = {}) {
  const {
    boardRef,
    pieces,
    turn,
    selectedId,
    drag,
    legalMoves,
    rankOrder,
    fileOrder,
    history,
    toScreen,
    handleSquareClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    handleNewGame,
    handleUndo,
    handleFlip,
  } = useChessBoard(initialPieces, initialTurn)

  return (
    <div className={`chessboard-wrapper ${className || ''}`}>
      <div className="chessboard-with-coords">
        <Coords side="top" labels={fileOrder} />

        <div className="chessboard-row">
          <Coords side="left" labels={rankOrder} />

          <div className="chessboard" role="grid" ref={boardRef}>
            <div className="squares-layer">
              {rankOrder.map((rank) =>
                fileOrder.map((file) => {
                  const square = `${file}${rank}`
                  const isDark = (FILES.indexOf(file) + rank) % 2 !== 0
                  const isLegal = legalMoves.includes(square)
                  const isCapture =
                    isLegal && pieces.some((p) => p.square === square)

                  return (
                    <SquareComp
                      key={square}
                      square={square}
                      isDark={isDark}
                      isLegal={isLegal}
                      isCapture={isCapture}
                      onClick={handleSquareClick}
                    />
                  )
                }),
              )}
            </div>

            <Pieces
              pieces={pieces}
              turn={turn}
              selectedId={selectedId}
              draggingId={drag ? drag.id : null}
              dragXPct={drag ? drag.xPct : null}
              dragYPct={drag ? drag.yPct : null}
              toScreen={toScreen}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          </div>

          <Coords side="right" labels={rankOrder} />
        </div>

        <Coords side="bottom" labels={fileOrder} />
      </div>

      <ChessButtons
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        onFlip={handleFlip}
        canUndo={history.length > 0}
      />
    </div>
  )
}