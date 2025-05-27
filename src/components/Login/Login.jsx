import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth.js'
import useAuth from '../../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function Login() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handle = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    try {
      const { access_token } = await login(form)
      setToken(access_token)
      navigate('/home')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card p-4">
          <h2 className="card-title text-center mb-4">Login</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={form.username}
                onChange={handle}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handle}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign In (TEST for change)
            </button>
          </form>

          <div className="mt-3 text-center">
            <Link to="/register" className="btn btn-secondary w-100">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}