import React, { useState, useRef } from 'react'
import { triggerBrute } from '../../api/brute.js'
import useAuth from '../../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function BruteForm() {
  const { token, logout } = useAuth()
  const [inputs, setInputs] = useState({
    target_url: '',
    username: '',
    form_fields: { username: 'username', password: 'password' },
    passwords: []
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const abortController = useRef(null)

  const handle = e => {
    const { name, value } = e.target
    setInputs(i => ({ ...i, [name]: value }))
  }

  const submit = async e => {
    e.preventDefault()
    setError('')
    setResult(null)
    abortController.current = new AbortController()
    setLoading(true)

    try {
        const { target_url, username, form_fields, passwords } = inputs
        const body = { target_url, username, form_fields }

        // include passwords array only if user entered something
        if (typeof passwords === 'string' && passwords.trim() !== '') {
        body.passwords = passwords
            .split(',')
            .map(pw => pw.trim())
            .filter(pw => pw !== '')
        }

        const data = await triggerBrute(body, token, abortController.current.signal)
        setResult(data)
    } catch (err) {
        if (err.name === 'AbortError') {
        setError('Brute-force cancelled')
        } else {
        setError(err.message)
        }
    } finally {
        setLoading(false)
    }
  }

  const cancel = () => {
    abortController.current?.abort()
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="card w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Brute-Force Login</h5>
          <div>
            <Link to="/" className="btn btn-outline-primary btn-sm me-2">Home</Link>
            <button onClick={logout} className="btn btn-outline-secondary btn-sm">Logout</button>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="target_url" className="form-label">Target URL</label>
              <input
                id="target_url"
                name="target_url"
                type="text"
                value={inputs.target_url}
                onChange={handle}
                className="form-control"
                placeholder="https://example.com/login"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={inputs.username}
                onChange={handle}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwords" className="form-label">
                Passwords (optional, comma-separated)
              </label>
              <input
                id="passwords"
                name="passwords"
                type="text"
                value={inputs.passwords}
                onChange={handle}
                className="form-control"
                placeholder="admin123,password,123456"
                disabled={loading}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                {loading ? 'Running...' : 'Start Brute-Force'}
              </button>
              {loading && (
                <button type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
              )}
            </div>
          </form>
          {result && (
            <pre className="mt-4 p-3 bg-light border rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
