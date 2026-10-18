import axios from 'axios'
import { apiBase } from '../config/api'
import { useAuthStore } from '../store/auth.store'
import type { AuthResponse } from '../types/auth'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _sessionVersion?: number
    _retry?: boolean
  }
}

const api = axios.create({ baseURL: apiBase, timeout: 30_000 })
let refreshing: Promise<AuthResponse> | null = null
let refreshOwner: string | null = null
api.interceptors.request.use((config) => {
  const { token, sessionVersion } = useAuthStore.getState()
  config._sessionVersion = sessionVersion
  if (token && !config.url?.startsWith('/auth/')) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config
    if (original?._sessionVersion !== useAuthStore.getState().sessionVersion) return Promise.reject(error)
    if (error.response?.status === 401 && original?._retry) {
      useAuthStore.getState().logout('Your session has expired. Sign in to continue.')
      return Promise.reject(error)
    }
    if (error.response?.status !== 401 || !original || original._retry || original.url?.startsWith('/auth/')) {
      return Promise.reject(error)
    }
    original._retry = true
    const { refreshToken, token } = useAuthStore.getState()
    if (!refreshToken) {
      useAuthStore.getState().logout('Your session has expired. Sign in to continue.')
      return Promise.reject(error)
    }
    try {
      if (original.headers.Authorization !== `Bearer ${token}` && token) return api(original)
      if (!refreshing || refreshOwner !== refreshToken) {
        refreshOwner = refreshToken
        const task = axios.post<AuthResponse>(`${apiBase}/auth/refresh`, { refresh_token: refreshToken }, { timeout: 30_000 })
          .then(({ data }) => {
            if (useAuthStore.getState().refreshToken !== refreshToken) throw new Error('Session changed')
            useAuthStore.getState().setAuth(data.access_token, data.refresh_token, true)
            return data
          }).finally(() => { if (refreshing === task) { refreshing = null; refreshOwner = null } })
        refreshing = task
      }
      const data = await refreshing
      original.headers.Authorization = `Bearer ${data.access_token}`
      return api(original)
    } catch (refreshError) {
      if (useAuthStore.getState().refreshToken === refreshToken && axios.isAxiosError(refreshError) &&
        [401, 403].includes(refreshError.response?.status || 0)) {
        useAuthStore.getState().logout('Your session has expired. Sign in to continue.')
      }
      return Promise.reject(refreshError)
    }
  },
)
export default api
