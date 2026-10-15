import { Client, type IMessage } from '@stomp/stompjs'

export interface RoomStateFromServer {
  code: string
  status: 'waiting' | 'ready' | 'playing' | 'finished'
  turn: 'white' | 'black'
  players: {
    white: { connected: boolean } | null
    black: { connected: boolean } | null
  }
  moves: unknown[]
}

export interface RoomSocketOptions {
  code: string
  token: string
  onState: (state: RoomStateFromServer) => void
  onConnected?: () => void
  onSubscribed?: () => void
  onDisconnected?: () => void
  onError?: (error: string) => void
}

export interface RoomSocket {
  disconnect: () => void
}

export function openRoomSocket(options: RoomSocketOptions): RoomSocket {
  const {
    code,
    token,
    onState,
    onConnected,
    onSubscribed,
    onDisconnected,
    onError,
  } = options

  const client = new Client({
    brokerURL: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`,

    connectHeaders: { roomCode: code, playerToken: token },

    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (msg) => {
      console.log('[STOMP]', msg)
    },

    onConnect: () => {
      onConnected?.()

      client.subscribe(`/topic/rooms/${code}`, (message: IMessage) => {
        try {
          const state = JSON.parse(message.body) as RoomStateFromServer
          onState(state)
        } catch (e) {
          console.error('Failed to parse room state:', e, message.body)
        }
      })
      
      onSubscribed?.()
    },

    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body)
      onError?.(frame.headers['message'] ?? 'STOMP error')
    },

    onWebSocketClose: () => {
      onDisconnected?.()
    },

    onWebSocketError: (event) => {
      console.error('WebSocket error:', event)
      onError?.('WebSocket error')
    },
  })

  client.activate()

  return {
    disconnect: () => {
      void client.deactivate()
    },
  }
}