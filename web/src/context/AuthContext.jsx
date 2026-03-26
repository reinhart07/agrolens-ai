/**
 * AgroLens AI — Auth Context
 * Global state untuk autentikasi user
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Load dari localStorage saat app pertama buka
  useEffect(() => {
    const savedToken = localStorage.getItem('agrolens_token')
    const savedUser  = localStorage.getItem('agrolens_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { access_token, user_id, name, role } = res.data

    const userData = { id: user_id, name, role, email }
    localStorage.setItem('agrolens_token', access_token)
    localStorage.setItem('agrolens_user', JSON.stringify(userData))
    setToken(access_token)
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('agrolens_token')
    localStorage.removeItem('agrolens_user')
    setToken(null)
    setUser(null)
  }

  const isLoggedIn = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, loading, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}