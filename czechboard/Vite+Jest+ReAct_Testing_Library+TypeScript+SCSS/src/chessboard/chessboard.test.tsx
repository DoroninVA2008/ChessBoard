import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ChessBoard } from './chessboard'
import type { Piece } from './moves'

describe('ChessBoard: начальная расстановка', () => {
  it('на старте рендерится 32 фигуры', () => {
    render(<ChessBoard />)
    expect(screen.getAllByTestId(/^piece-/)).toHaveLength(32)
  })

  it('белые пешки стоят на 2-й линии', () => {
    render(<ChessBoard />)
    for (const file of 'abcdefgh') {
      expect(screen.getByTestId(`piece-w-pawn-${file}2`)).toHaveAttribute(
        'data-square',
        `${file}2`,
      )
    }
  })

  it('чёрные пешки стоят на 7-й линии', () => {
    render(<ChessBoard />)
    for (const file of 'abcdefgh') {
      expect(screen.getByTestId(`piece-b-pawn-${file}7`)).toHaveAttribute(
        'data-square',
        `${file}7`,
      )
    }
  })

  it('initialPieces заменяет стандартную расстановку', () => {
    const custom: Piece[] = [
      { id: 'w-king-e1', type: 'king', color: 'white', square: 'e1' },
      { id: 'b-king-e8', type: 'king', color: 'black', square: 'e8' },
    ]
    render(<ChessBoard initialPieces={custom} />)
    expect(screen.getAllByTestId(/^piece-/)).toHaveLength(2)
    expect(screen.getByTestId('piece-w-king-e1')).toBeInTheDocument()
    expect(screen.getByTestId('piece-b-king-e8')).toBeInTheDocument()
  })
})

describe('ChessBoard: очерёдность хода', () => {
  it('начинают белые', () => {
    render(<ChessBoard />)
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')
  })

  it('после хода белых — ход чёрных', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e4'))

    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')
  })

  it('белые не могут сходить дважды подряд', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e4'))

    await user.click(screen.getByTestId('square-d2'))
    await user.click(screen.getByTestId('square-d4'))

    expect(screen.getByTestId('piece-w-pawn-d2')).toHaveAttribute('data-square', 'd2')
    expect(screen.getByTestId('piece-w-pawn-e2')).toHaveAttribute('data-square', 'e4')
  })

  it('чёрные ходят после белых', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e4'))

    await user.click(screen.getByTestId('square-e7'))
    await user.click(screen.getByTestId('square-e5'))

    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('data-square', 'e5')
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')
  })

  it('можно стартовать с хода чёрных через initialTurn', async () => {
    render(<ChessBoard initialTurn="black" />)
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')
  })

  it('при initialTurn="black" чёрные могут ходить, белые — нет', async () => {
    const user = userEvent.setup()
    render(<ChessBoard initialTurn="black" />)

    // Белые не могут выбрать свою пешку.
    await user.click(screen.getByTestId('square-e2'))
    expect(screen.getByTestId('piece-w-pawn-e2')).toHaveAttribute('aria-selected', 'false')

    // Чёрные могут.
    await user.click(screen.getByTestId('square-e7'))
    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByTestId('square-e5'))
    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('data-square', 'e5')
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')
  })

  it('полный цикл: белые → чёрные → белые', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e4'))
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')

    await user.click(screen.getByTestId('square-e7'))
    await user.click(screen.getByTestId('square-e5'))
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')

    await user.click(screen.getByTestId('square-g1'))
    await user.click(screen.getByTestId('square-f3'))
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')
  })
})

describe('ChessBoard: выделение', () => {
  it('нельзя выделить чужую фигуру', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e7'))

    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('aria-selected', 'false')

    const legal = screen
      .getAllByRole('gridcell')
      .filter((s) => s.getAttribute('data-legal') === 'true')
    expect(legal).toHaveLength(0)
  })

  it('повторный клик по выбранной фигуре снимает выделение', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e2'))
    expect(screen.getByTestId('piece-w-pawn-e2')).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByTestId('square-e2'))
    expect(screen.getByTestId('piece-w-pawn-e2')).toHaveAttribute('aria-selected', 'false')
  })

  it('клик по пустой клетке без выделения ничего не делает', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e4'))

    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')
    const legal = screen
      .getAllByRole('gridcell')
      .filter((s) => s.getAttribute('data-legal') === 'true')
    expect(legal).toHaveLength(0)
  })

  it('клик по своей фигуре не превращается в съедение, а переключает выделение', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-d2'))

    expect(screen.getByTestId('piece-w-pawn-e2')).toBeInTheDocument()
    expect(screen.getByTestId('piece-w-pawn-d2')).toBeInTheDocument()
    expect(screen.getByTestId('piece-w-pawn-d2')).toHaveAttribute('aria-selected', 'true')
  })
})

describe('ChessBoard: взятия', () => {
  it('можно побить чужую фигуру', async () => {
    const user = userEvent.setup()
    const custom: Piece[] = [
      { id: 'w-pawn-e4', type: 'pawn', color: 'white', square: 'e4' },
      { id: 'b-pawn-d5', type: 'pawn', color: 'black', square: 'd5' },
    ]
    render(<ChessBoard initialPieces={custom} initialTurn="white" />)

    await user.click(screen.getByTestId('square-e4'))
    await user.click(screen.getByTestId('square-d5'))

    expect(screen.getByTestId('piece-w-pawn-e4')).toHaveAttribute('data-square', 'd5')
    expect(screen.queryByTestId('piece-b-pawn-d5')).not.toBeInTheDocument()
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')
  })

  it('onMove вызывается с корректными параметрами', async () => {
    const user = userEvent.setup()
    const onMove = jest.fn()
    const custom: Piece[] = [
      { id: 'w-pawn-e4', type: 'pawn', color: 'white', square: 'e4' },
      { id: 'b-pawn-d5', type: 'pawn', color: 'black', square: 'd5' },
    ]
    render(<ChessBoard initialPieces={custom} initialTurn="white" onMove={onMove} />)

    await user.click(screen.getByTestId('square-e4'))
    await user.click(screen.getByTestId('square-d5'))

    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledWith({
      from: 'e4',
      to: 'd5',
      pieceId: 'w-pawn-e4',
      capturedId: 'b-pawn-d5',
    })
  })

  it('onMove не вызывается при нелегальном ходе', async () => {
    const user = userEvent.setup()
    const onMove = jest.fn()
    render(<ChessBoard onMove={onMove} />)

    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e5'))

    expect(onMove).not.toHaveBeenCalled()
  })
})