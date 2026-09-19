import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChessBoard } from './chessboard'

describe('ChessBoard', () => {
  it('рендерит 64 клетки', () => {
    render(<ChessBoard />);
    const squares = screen.getAllByRole('gridcell');
    expect(squares).toHaveLength(64);
  });

  it('ладья стартует на клетке a1', () => {
    render(<ChessBoard />);
    const rook = screen.getByTestId('piece-rook-1');
    expect(rook).toBeInTheDocument();

    const a1 = screen.getByTestId('square-a1');
    expect(a1).toContainElement(rook);
  });

  it('клик по фигуре выделяет её', async () => {
    const user = userEvent.setup();
    render(<ChessBoard />);

    const a1 = screen.getByTestId('square-a1');
    await user.click(a1);

    expect(a1).toHaveAttribute('aria-selected', 'true');
  });

  it('клик по пустой клетке перемещает выбранную фигуру', async () => {
    const user = userEvent.setup();
    render(<ChessBoard />);

    // Выбираем ладью
    await user.click(screen.getByTestId('square-a1'));

    // Двигаем на e4
    await user.click(screen.getByTestId('square-e4'));

    const rook = screen.getByTestId('piece-rook-1');
    const e4 = screen.getByTestId('square-e4');
    expect(e4).toContainElement(rook);

    // На старой клетке фигуры больше нет
    const a1 = screen.getByTestId('square-a1');
    expect(a1).not.toContainElement(rook);
  });

  it('после перемещения фигура больше не выделена', async () => {
    const user = userEvent.setup();
    render(<ChessBoard />);

    await user.click(screen.getByTestId('square-a1'));
    await user.click(screen.getByTestId('square-e4'));

    const e4 = screen.getByTestId('square-e4');
    expect(e4).toHaveAttribute('aria-selected', 'false');
  });

  it('клик по пустой клетке без выбранной фигуры ничего не делает', async () => {
    const user = userEvent.setup();
    render(<ChessBoard />);

    const e4 = screen.getByTestId('square-e4');
    await user.click(e4);

    const rook = screen.getByTestId('piece-rook-1');
    const a1 = screen.getByTestId('square-a1');
    expect(a1).toContainElement(rook);
    expect(e4).not.toContainElement(rook);
  });
});