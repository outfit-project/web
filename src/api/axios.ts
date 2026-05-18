import axios from 'axios'
import { apiBase } from '../config/api'
import { useAuthStore } from '../store/auth.store'

const addInterceptors = (instance: ReturnType<typeof axios.create>) => {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) {
          useAuthStore.getState().logout()
          return Promise.reject(error)
        }
        try {
          const { data } = await axios.post(
            `${apiBase.auth}/auth/refresh`,
            { refresh_token: refreshToken }
          )
          useAuthStore.getState().setAuth(data.access_token, data.refresh_token)
          original.headers.Authorization = `Bearer ${data.access_token}`
          return instance(original)
        } catch {
          useAuthStore.getState().logout()
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const authAxios = addInterceptors(axios.create({ baseURL: apiBase.auth }))
export const wardrobeAxios = addInterceptors(axios.create({ baseURL: apiBase.wardrobe }))
export const outfitAxios = addInterceptors(axios.create({ baseURL: apiBase.outfit }))
