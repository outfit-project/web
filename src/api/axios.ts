import axios from 'axios'
import { useAuthStore } from '../store/auth.store'
import {refresh} from "./auth.ts";

const createInstance = (baseURL: string) => {
    const instance = axios.create({ baseURL })

    instance.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    instance.interceptors.response.use(
        (response) => response,
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
                    const { access_token, refresh_token } = await refresh(refreshToken)
                    useAuthStore.getState().setAuth(access_token, refresh_token)
                    original.headers.Authorization = `Bearer ${access_token}`
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

export const authAxios     = createInstance(import.meta.env.VITE_AUTH_URL)
export const wardrobeAxios = createInstance(import.meta.env.VITE_WARDROBE_URL)
export const outfitAxios   = createInstance(import.meta.env.VITE_OUTFIT_URL)