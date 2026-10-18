import { create } from 'zustand'
import { queryClient } from '../queryClient'

interface AuthState {
  sessionVersion: number
  sessionMessage: string | null
  token: string | null
  refreshToken: string | null
  setAuth: (token: string, refreshToken: string, preserveCache?: boolean) => void
  logout: (message?: string) => void
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
  sessionVersion: 0,
  sessionMessage: null,
  ...readTokensFromStorage(),

  setAuth: (token, refreshToken, preserveCache = false) => {
    if (!preserveCache) queryClient.clear()
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    set(state => ({ token, refreshToken, sessionMessage: null, sessionVersion: state.sessionVersion + (preserveCache ? 0 : 1) }))
  },

  logout: (message) => {
    queryClient.clear()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set(state => ({ token: null, refreshToken: null, sessionMessage: message || null, sessionVersion: state.sessionVersion + 1 }))
  },

  loadFromStorage: () => {
    queryClient.clear()
    set(state => ({ ...readTokensFromStorage(), sessionVersion: state.sessionVersion + 1 }))
  },
}))
