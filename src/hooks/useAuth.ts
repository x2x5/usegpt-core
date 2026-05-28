import { useState, useEffect } from 'react'
import type { User } from '../types/skill'
import { getMe, logout as apiLogout, login as apiLogin } from '../api/skills'

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

  const login = async (username: string) => {
    const res = await apiLogin(username)
    setUser(res.user)
    return res
  }

  return { user, loading, login, logout }
}
