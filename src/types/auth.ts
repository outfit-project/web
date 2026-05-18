export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface VerifyRequest {
  email: string
  code: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
}

export interface UserPayload {
  user_id: string
  username: string
  email: string
}
