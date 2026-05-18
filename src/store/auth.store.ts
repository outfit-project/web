import { create } from 'zustand'

interface AuthState {
    token: string | null
    refreshToken: string | null
    setAuth: (token: string, refreshToken: string) => void
    logout: () => void
    loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    refreshToken: null,

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
        const token = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')
        if (token && refreshToken) {
            set({ token, refreshToken })
        }
    },
}))