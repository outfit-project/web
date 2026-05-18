import { create } from 'zustand'

interface AuthState {
  token: string | null
  refreshToken: string | null
  setAuth: (token: string, refreshToken: string) => void
  logout: () => void
  loadFromStorage: () => void
}

function readTokensFromStorage(): { token: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { token: null, refreshToken: null }
  return {
    token: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readTokensFromStorage(),

  setAuth: (token, refreshToken) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    set({ token, refreshToken })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ token: null, refreshToken: null })
  },

  loadFromStorage: () => {
    set(readTokensFromStorage())
  },
}))
