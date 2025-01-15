import { useMutation } from '@tanstack/react-query'
import { post } from '../../api/service/api'
import { setCookie } from '../../api/service/cookie'
import { createQueryKeys } from '../../api/service/queryKeys'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string,
	refresh_token: string
}

export const authKeys = createQueryKeys('auth')
const login = (credentials: LoginCredentials) => 
  post<LoginResponse>('/user/login', credentials)

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setCookie('access_token', data.access_token)
      setCookie('refresh_token', data.refresh_token)
    },
  })
}


