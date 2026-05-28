import { useState, useEffect } from 'react'
import type { User } from '../types/skill'
import { getMe, logout as apiLogout, login as apiLogin, register as apiRegister } from '../api/skills'

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

  const login = async (username: string, password: string) => {
    const res = await apiLogin(username, password)
    setUser(res.user)
    return res
  }

  const register = async (username: string, password: string) => {
    const res = await apiRegister(username, password)
    setUser(res.user)
    return res
  }

  return { user, loading, login, register, logout }
}
