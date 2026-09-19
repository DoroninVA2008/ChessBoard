import { useState } from 'react'
import './chessboard.scss'

type Square = string; // например, "a1", "e4"
type Piece = { id: string; type: 'rook'; color: 'white'; square: Square };

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];

export const ChessBoard = () => {
  const [pieces, setPieces] = useState<Piece[]>([
    { id: 'rook-1', type: 'rook', color: 'white', square: 'a1' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getPieceAt = (square: Square) =>
    pieces.find((p) => p.square === square);

  const handleSquareClick = (square: Square) => {
    const piece = getPieceAt(square);

    // Клик по фигуре — выбираем её
    if (piece) {
      setSelectedId(piece.id);
      return;
    }

    // Клик по пустой клетке — двигаем выбранную фигуру
    if (selectedId) {
      setPieces((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, square } : p))
      );
      setSelectedId(null);
    }
  };

  return (
    <div className="chessboard" role="grid" aria-label="Шахматная доска">
      {RANKS.slice()
        .reverse()
        .map((rank) =>
          FILES.map((file) => {
            const square = `${file}${rank}`;
            const piece = getPieceAt(square);
            const isDark = (FILES.indexOf(file) + rank) % 2 === 0;
            const isSelected = piece?.id === selectedId;

            return (
              <button
                key={square}
                role="gridcell"
                aria-label={square}
                aria-selected={isSelected}
                data-testid={`square-${square}`}
                className={[
                  'square',
                  isDark ? 'dark' : 'light',
                  isSelected ? 'selected' : '',
                ].join(' ')}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span
                    data-testid={`piece-${piece.id}`}
                    aria-label={`${piece.color} ${piece.type}`}
                    className="piece"
                  >
                    ♜
                  </span>
                )}
              </button>
            );
          })
        )}
    </div>
  );
};