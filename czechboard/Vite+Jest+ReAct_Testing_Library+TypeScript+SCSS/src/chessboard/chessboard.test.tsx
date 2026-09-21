describe('Очерёдность хода', () => {
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

    // ход белых
    await user.click(screen.getByTestId('square-e2'))
    await user.click(screen.getByTestId('square-e4'))

    // пытаемся сходить ещё раз белой пешкой d2 — не должны смочь
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

    // теперь ход чёрных
    await user.click(screen.getByTestId('square-e7'))
    await user.click(screen.getByTestId('square-e5'))

    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('data-square', 'e5')
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход белых')
  })

  it('нельзя выделить чужую фигуру', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    // ход белых — клик по чёрной пешке e7
    await user.click(screen.getByTestId('square-e7'))

    expect(screen.getByTestId('piece-b-pawn-e7')).toHaveAttribute('aria-selected', 'false')

    // и подсветки нет
    const legal = screen
      .getAllByRole('gridcell')
      .filter((s) => s.getAttribute('data-legal') === 'true')
    expect(legal).toHaveLength(0)
  })

  it('можно побить чужую фигуру (не только выделить)', async () => {
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

  it('можно стартовать с хода чёрных через initialTurn', async () => {
    render(<ChessBoard initialTurn="black" />)
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Ход чёрных')
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