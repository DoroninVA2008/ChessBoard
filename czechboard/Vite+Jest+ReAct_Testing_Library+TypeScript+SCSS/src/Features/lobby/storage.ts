export const TOKEN_KEY = 'chess.roomToken'
export const CODE_KEY = 'chess.roomCode'
export const COLOR_KEY = 'chess.myColor'

export function readSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const code = localStorage.getItem(CODE_KEY)
  return token && code ? { token, code } : null
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CODE_KEY)
  localStorage.removeItem(COLOR_KEY)
}