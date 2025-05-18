import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
