import api from './axios'
import type { AuthResponse, LoginRequest, RegisterRequest, VerifyRequest } from '../types/auth'

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const r = await api.post<AuthResponse>('/auth/login', data)
  return r.data
}

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post('/auth/register', data)
}

export const verify = async (data: VerifyRequest): Promise<AuthResponse> => {
  const r = await api.post<AuthResponse>('/auth/verify', data)
  return r.data
}

export const resendCode = async (email: string): Promise<void> => {
  await api.post('/auth/resend-code', { email })
}

export const refreshTokens = async (token: string): Promise<AuthResponse> => {
  const r = await api.post<AuthResponse>('/auth/refresh', { refresh_token: token })
  return r.data
}
