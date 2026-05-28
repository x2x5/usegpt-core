import { useState, useEffect } from 'react'
import type { User } from '../types/skill'
import { getMe, logout as apiLogout } from '../api/skills'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(res => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  const login = () => {
    window.location.href = '/api/auth/github'
  }

  return { user, loading, login, logout }
}
