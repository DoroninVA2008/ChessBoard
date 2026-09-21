import {
  getLegalMoves, isLegalMove, initialPosition,
  type Piece, type PieceColor, type PieceType,
} from './moves'

const mk = (
  type: PieceType,
  color: PieceColor,
  square: string,
  id = `${color}-${type}-${square}`
): Piece => ({ id, type, color, square })

describe('Начальная расстановка', () => {
  it('32 фигуры', () => {
    expect(initialPosition()).toHaveLength(32)
  })

  it('16 белых и 16 чёрных', () => {
    const board = initialPosition()
    expect(board.filter((p) => p.color === 'white')).toHaveLength(16)
    expect(board.filter((p) => p.color === 'black')).toHaveLength(16)
  })

  it('у каждой стороны по 8 пешек', () => {
    const board = initialPosition()
    expect(board.filter((p) => p.color === 'white' && p.type === 'pawn')).toHaveLength(8)
    expect(board.filter((p) => p.color === 'black' && p.type === 'pawn')).toHaveLength(8)
  })

  it('все id уникальны', () => {
    const ids = initialPosition().map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Ладья', () => {
  it('на пустой доске бьёт 14 клеток из d4', () => {
    const r = mk('rook', 'white', 'd4')
    expect(getLegalMoves([r], r)).toHaveLength(14)
  })

  it('не перепрыгивает свою фигуру', () => {
    const r = mk('rook', 'white', 'd4')
    const blocker = mk('pawn', 'white', 'd6')
    const moves = getLegalMoves([r, blocker], r)
    expect(moves).toContain('d5')
    expect(moves).not.toContain('d6')
    expect(moves).not.toContain('d7')
  })

  it('бьёт чужую и останавливается', () => {
    const r = mk('rook', 'white', 'd4')
    const enemy = mk('pawn', 'black', 'd6')
    const moves = getLegalMoves([r, enemy], r)
    expect(moves).toContain('d6')
    expect(moves).not.toContain('d7')
  })

  it('на старте белая ладья a1 заблокирована своими', () => {
    const board = initialPosition()
    const rook = board.find((p) => p.id === 'w-rook-a1')!
    expect(getLegalMoves(board, rook)).toEqual([])
  })
})

describe('Пешка', () => {
  it('с начальной позиции идёт на 1 и 2', () => {
    const p = mk('pawn', 'white', 'e2')
    const moves = getLegalMoves([p], p)
    expect(moves).toEqual(expect.arrayContaining(['e3', 'e4']))
  })

  it('не с начальной — только на 1', () => {
    const p = mk('pawn', 'white', 'e3')
    expect(getLegalMoves([p], p)).toEqual(['e4'])
  })

  it('не идёт вперёд, если занято', () => {
    const p = mk('pawn', 'white', 'e2')
    const blocker = mk('pawn', 'black', 'e3')
    const moves = getLegalMoves([p, blocker], p)
    expect(moves).not.toContain('e3')
    expect(moves).not.toContain('e4')
  })

  it('бьёт по диагонали только чужую', () => {
    const p = mk('pawn', 'white', 'e2')
    const enemy = mk('pawn', 'black', 'd3')
    const own = mk('pawn', 'white', 'f3')
    const moves = getLegalMoves([p, enemy, own], p)
    expect(moves).toContain('d3')
    expect(moves).not.toContain('f3')
  })

  it('не бьёт по диагонали пустую клетку', () => {
    const p = mk('pawn', 'white', 'e2')
    expect(getLegalMoves([p], p)).not.toContain('d3')
  })

  it('чёрная пешка идёт вниз', () => {
    const p = mk('pawn', 'black', 'e7')
    const moves = getLegalMoves([p], p)
    expect(moves).toEqual(expect.arrayContaining(['e6', 'e5']))
    expect(moves).not.toContain('e8')
  })
})

describe('Конь', () => {
  it('прыгает буквой Г, игнорируя фигуры вокруг', () => {
    const n = mk('knight', 'white', 'd4')
    const blockers: Piece[] = [
      mk('pawn', 'white', 'd3'),
      mk('pawn', 'white', 'd5'),
      mk('pawn', 'white', 'c4'),
      mk('pawn', 'white', 'e4'),
    ]
    const moves = getLegalMoves([n, ...blockers], n)
    expect(moves).toEqual(
      expect.arrayContaining(['c6', 'e6', 'b5', 'f5', 'b3', 'f3', 'c2', 'e2'])
    )
    expect(moves).toHaveLength(8)
  })

  it('на старте у коня g1 два хода', () => {
    const board = initialPosition()
    const knight = board.find((p) => p.square === 'g1')!
    expect(getLegalMoves(board, knight).sort()).toEqual(['f3', 'h3'])
  })

  it('бьёт чужую, не бьёт свою', () => {
    const n = mk('knight', 'white', 'd4')
    const enemy = mk('pawn', 'black', 'e6')
    const own = mk('pawn', 'white', 'f5')
    const moves = getLegalMoves([n, enemy, own], n)
    expect(moves).toContain('e6')
    expect(moves).not.toContain('f5')
  })
})

describe('Слон', () => {
  it('ходит только по диагонали', () => {
    const b = mk('bishop', 'white', 'c1')
    const moves = getLegalMoves([b], b)
    expect(moves.sort()).toEqual(['a3', 'b2', 'd2', 'e3', 'f4', 'g5', 'h6'])
  })

  it('на старте слон c1 заблокирован своими', () => {
    const board = initialPosition()
    const bishop = board.find((p) => p.square === 'c1')!
    expect(getLegalMoves(board, bishop)).toEqual([])
  })
})

describe('Ферзь', () => {
  it('сочетает ходы ладьи и слона', () => {
    const q = mk('queen', 'white', 'd4')
    expect(getLegalMoves([q], q)).toHaveLength(27)
  })
})

describe('Король', () => {
  it('ходит на одну клетку в любую сторону', () => {
    const k = mk('king', 'white', 'd4')
    expect(getLegalMoves([k], k).sort()).toEqual(
      ['c3', 'c4', 'c5', 'd3', 'd5', 'e3', 'e4', 'e5']
    )
  })

  it('на краю — меньше ходов', () => {
    const k = mk('king', 'white', 'a1')
    expect(getLegalMoves([k], k).sort()).toEqual(['a2', 'b1', 'b2'])
  })

  it('не бьёт свою фигуру', () => {
    const k = mk('king', 'white', 'd4')
    const own = mk('pawn', 'white', 'd5')
    expect(getLegalMoves([k, own], k)).not.toContain('d5')
  })
})

describe('isLegalMove', () => {
  it('true для легального хода', () => {
    const p = mk('pawn', 'white', 'e2')
    expect(isLegalMove([p], p, 'e4')).toBe(true)
  })

  it('false для нелегального', () => {
    const p = mk('pawn', 'white', 'e2')
    expect(isLegalMove([p], p, 'e5')).toBe(false)
  })

  it('false при попытке пойти на свою фигуру', () => {
    const r = mk('rook', 'white', 'a1')
    const own = mk('pawn', 'white', 'a2')
    expect(isLegalMove([r, own], r, 'a2')).toBe(false)
  })
})