import { useState, useEffect, useRef } from 'react'
import type { Piece, PieceColor } from '../features/chessboard/types'
import type { LobbyStatus, RoomCode, PlayerColor } from '../features/lobby/types'
import { initialPosition } from '../features/chessboard/moves'
import {
  createRoom,
  joinRoom,
  getRoom,
  type ColorChoice,
} from '../features/lobby/lob'
import {
  openRoomSocket,
  type RoomSocket,
  type RoomStateFromServer,
} from '../shared/ws/room'

const TOKEN_KEY = 'chess.roomToken'
const CODE_KEY = 'chess.roomCode'
const COLOR_KEY = 'chess.myColor'

function toColorChoice(color: PlayerColor): ColorChoice {
  return color === 'white' ? 'WHITE' : 'BLACK'
}

function fromServerColor(color: 'white' | 'black'): PlayerColor {
  return color
}

// RoomState — общая структура, приходит и из WS-топика, и внутри getRoom().state
function applyRoomState(
  state: RoomStateFromServer,
  setters: {
    setTurn: (t: PieceColor) => void
    setOpponentConnected: (v: boolean) => void
    setStatus: (s: LobbyStatus) => void
  },
) {
  const { setTurn, setOpponentConnected, setStatus } = setters

  setTurn(state.turn)

  const whiteConnected = state.players?.white?.connected === true
  const blackConnected = state.players?.black?.connected === true
  setOpponentConnected(whiteConnected && blackConnected)

  if (state.status === 'ready' || state.status === 'playing') {
    setStatus('connected')
  } else if (state.status === 'waiting') {
    setStatus('waiting-for-opponent')
  }
}

export function store() {
  const [pieces, setPieces] = useState<Piece[]>(initialPosition())
  const [turn, setTurn] = useState<PieceColor>('white')
  const [myColor, setMyColor] = useState<PlayerColor>('white')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [status, setStatus] = useState<LobbyStatus>('idle')
  const [roomCode, setRoomCode] = useState<RoomCode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<RoomSocket | null>(null)

  // ─── Создание комнаты ────────────────────────────────────────────

  function handleCreateRoom() {
    setError(null)
    setStatus('choosing-side')
  }

  async function finalizeCreateRoom(color: PlayerColor) {
    setError(null)
    try {
      const result = await createRoom(toColorChoice(color))

      localStorage.setItem(TOKEN_KEY, result.token)
      localStorage.setItem(CODE_KEY, result.code)
      localStorage.setItem(COLOR_KEY, result.color)

      setRoomCode(result.code)
      setMyColor(fromServerColor(result.color))
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
    void finalizeCreateRoom('white')
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
      localStorage.setItem(COLOR_KEY, result.color)

      setRoomCode(result.code)
      setMyColor(fromServerColor(result.color))
      setStatus('connected')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Не удалось подключиться'
      setError(msg)
      console.error('joinRoom failed:', e)
    }
  }

  // ─── Восстановление сессии при перезагрузке страницы ─────────────

  useEffect(() => {
    if (import.meta.env.DEV) return

  const token = localStorage.getItem(TOKEN_KEY)
  const code = localStorage.getItem(CODE_KEY)
    const savedColor = localStorage.getItem(COLOR_KEY) as PlayerColor | null
    if (!token || !code) return

    let cancelled = false

    getRoom(code, token)
      .then((info) => {
        if (cancelled) return

        // getRoom возвращает { color, state }
        setRoomCode(info.state.code)

        // Цвет: берём из ответа бэка (надёжно), а не из localStorage
        setMyColor(fromServerColor(info.color))
        localStorage.setItem(COLOR_KEY, info.color)

        applyRoomState(info.state, { setTurn, setOpponentConnected, setStatus })
      })
      .catch((e) => {
        if (cancelled) return
        console.warn('restore session failed:', e)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(CODE_KEY)
        localStorage.removeItem(COLOR_KEY)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // ─── WebSocket: real-time обновления от бэка ─────────────────────

  useEffect(() => {
    if (status !== 'waiting-for-opponent' && status !== 'connected') {
      return
    }

    if (socketRef.current) return

    const token = localStorage.getItem(TOKEN_KEY)
    const code = localStorage.getItem(CODE_KEY)
    if (!token || !code) return

    const setters = { setTurn, setOpponentConnected, setStatus }

    const socket = openRoomSocket({
      code,
      token,

      // WS-топик присылает RoomState напрямую (без обёртки { color, state })
      onState: (state) => applyRoomState(state, setters),

      onConnected: () => {
        console.log('[WS] connected to room', code)
      },

      // После SUBSCRIBE — дернуть GET /api/rooms/{code}
      onSubscribed: () => {
        console.log('[WS] subscribed, fetching initial state via REST')
        getRoom(code, token)
          .then((info) => {
            // 👇 Ключевое: передаём info.state, а не info
            applyRoomState(info.state, setters)
          })
          .catch((e) => console.error('[WS] initial getRoom failed:', e))
      },

      onDisconnected: () => {
        console.log('[WS] disconnected from room', code)
      },

      onError: (msg) => {
        console.error('[WS] error:', msg)
      },
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [status])

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