import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChessBoard } from './chessboard'

describe('ChessBoard', () => {
  it('рендерит 64 клетки', () => {
    render(<ChessBoard />)
    expect(screen.getAllByRole('gridcell')).toHaveLength(64)
  })

  it('ладья стартует на клетке a1', () => {
    render(<ChessBoard />)
    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toBeInTheDocument()
    expect(rook).toHaveAttribute('data-square', 'a1')
  })

  it('клик по фигуре выделяет её', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-a1'))

    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toHaveAttribute('aria-selected', 'true')
  })

  it('клик по пустой клетке перемещает выбранную фигуру', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-a1'))
    await user.click(screen.getByTestId('square-e4'))

    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toHaveAttribute('data-square', 'e4')
  })

  it('фигура получает transform, соответствующий новой клетке', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-a1'))
    await user.click(screen.getByTestId('square-e4'))

    // e4: col=4, row=4  ->  translate(240px, 240px)
    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toHaveStyle({ transform: 'translate(240px, 240px)' })
  })

  it('после перемещения фигура больше не выделена', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-a1'))
    await user.click(screen.getByTestId('square-e4'))

    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toHaveAttribute('aria-selected', 'false')
  })

  it('клик по пустой клетке без выбранной фигуры ничего не делает', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e4'))

    const rook = screen.getByTestId('piece-rook-1')
    expect(rook).toHaveAttribute('data-square', 'a1')
  })
})