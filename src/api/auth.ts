import { authAxios } from './axios'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>('/auth/login', data)
    return response.data
}

export const register = async (data: RegisterRequest): Promise<void> => {
    await authAxios.post('/auth/register', data)
}

export const refresh = async (token: string): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>('/auth/refresh', { refresh_token: token })
    return response.data
}

export const verify = async (code: string): Promise<void> => {
    await authAxios.post('/auth/verify', { code })
}

export const resendCode = async (email: string): Promise<void> => {
    await authAxios.post('/auth/resend', { email })
}