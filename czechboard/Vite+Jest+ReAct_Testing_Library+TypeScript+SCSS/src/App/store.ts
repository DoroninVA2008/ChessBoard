import { useState, useCallback, useEffect } from 'react'
import type { Piece, PieceColor } from '../features/chessboard/types'
import type { LobbyStatus, RoomCode, PlayerColor } from '../features/lobby/types'
import { initialPosition } from '../features/chessboard/moves'
import {
  createRoom,
  joinRoom,
  getRoom,
  type ColorChoice,
} from '../features/lobby/lob'

// Ключи localStorage — вынеси в константы, чтобы не путаться
const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
// PlayerColor (белый/чёрный) у бэка зовётся 'white' | 'black'
// ColorChoice (запрос) — 'WHITE' | 'BLACK' | 'RANDOM'
function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

export function store() {
  const [pieces, setPieces] = useState<Piece[]>(initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PieceColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ─── Создание комнаты ────────────────────────────────────────────

  function handleCreateRoom() {
    setError(null)
    setStatus('choosing-side')
  }

  async function finalizeCreateRoom(color: PlayerColor) {
    setError(null)
    try {
      const result = await createRoom(toColorChoice(color))

      // Сохраняем для восстановления сессии при перезагрузке
      localStorage.setItem(TOKEN_KEY, result.token)
      localStorage.setItem(CODE_KEY, result.code)

      setRoomCode(result.code)
      setMyColor(result.color === 'white' ? 'white' : 'black')
      setStatus('waiting-for-opponent')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Не удалось создать комнату'
      setError(msg)
      console.error('createRoom failed:', e)
      setStatus('idle')
    }
  }

  function handleChooseSide(color: PlayerColor) {
    void finalizeCreateRoom(color)
  }

  function handleRandomSide() {
    void finalizeCreateRoom('white') // сервер сам рандомизирует — шлём WHITE и получим случайный
  }

  function handleBackFromSideChoice() {
    setStatus('idle')
    setError(null)
  }

  // ─── Подключение к комнате ───────────────────────────────────────

  async function handleJoinRoom(code: string) {
    setError(null)
    try {
      const result = await joinRoom(code.toUpperCase())

      localStorage.setItem(TOKEN_KEY, result.token)
      localStorage.setItem(CODE_KEY, result.code)

      setRoomCode(result.code)
      setMyColor(result.color === 'white' ? 'white' : 'black')
      setStatus('connected')
      // opponentConnected обновится после WebSocket-подключения
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Не удалось подключиться'
      setError(msg)
      console.error('joinRoom failed:', e)
    }
  }

  // ─── Восстановление сессии при перезагрузке страницы ─────────────

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const code = localStorage.getItem(CODE_KEY)
    if (!token || !code) return

    getRoom(code, token)
      .then((state) => {
        setRoomCode(state.code)
        // Найти себя в players: тот, у кого connected — но по-хорошему нужен color из ответа
        // getRoom возвращает RoomState, а не color. Придётся вычислить по токену:
        // пока просто пробуем определить по players — если white.connected и black null, ты white
        const youAreWhite = state.players.white?.connected === true && !state.players.black
        setMyColor(youAreWhite ? 'white' : 'black')

        setOpponentConnected(
          Boolean(state.players.white?.connected && state.players.black?.connected),
        )
        setStatus(state.status === 'waiting' ? 'waiting-for-opponent' : 'connected')
      })
      .catch((e) => {
        console.warn('restore session failed:', e)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(CODE_KEY)
      })
  }, [])

  const inRoom = status === 'waiting-for-opponent' || status === 'connected'

  return {
    pieces,
    setPieces,
    turn,
    setTurn,
    myColor,
    opponentConnected,
    status,
    roomCode,
    inRoom,
    error,
    handleCreateRoom,
    handleChooseSide,
    handleRandomSide,
    handleBackFromSideChoice,
    handleJoinRoom,
  }
}