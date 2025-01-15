'use client'

import { useEffect, useState } from 'react'
import { getCookie } from '../api/service/cookie'

export function useAuthHeader() {
  const [authHeader, setAuthHeader] = useState<Record<string, string>>({
    "ngrok-skip-browser-warning": "69420"
  })

  useEffect(() => {
    const token = getCookie('access_token')
    if (token) {
      setAuthHeader(prev => ({
        ...prev,
        "Authorization": `Bearer ${token}`
      }))
    }
  }, [])

  return authHeader
}

