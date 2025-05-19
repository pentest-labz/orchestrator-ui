import React, { useState, useRef } from 'react'
import { triggerSqlInject } from '../../api/sql_injection.js'
import useAuth from '../../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function SqlInjectForm() {
  const { token, logout } = useAuth()
  const [inputs, setInputs] = useState({
    target_url: '',
    method: 'GET',
    params: {},
    payloads: ''
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const abortController = useRef(null)

  const handleChange = e => {
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
      const paramsObj = Object.fromEntries(
        inputs.params
          .split(',')
          .map(pair => pair.split('=').map(s => s.trim()))
          .filter(pair => pair.length === 2)
      )
      const body = {
        target_url: inputs.target_url,
        method: inputs.method,
        params: paramsObj,
        ...(inputs.payloads
          ? { payloads: inputs.payloads.split(',').map(p => p.trim()) }
          : {})
      }
      const data = await triggerSqlInject(body, token, abortController.current.signal)
      setResult(data)
    } catch (e) {
      if (e.name === 'AbortError') setError('Test cancelled')
      else setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const cancel = () => abortController.current?.abort()

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="card w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">SQL Injection Test</h5>
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
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com/search"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="method" className="form-label">Method</label>
              <select
                id="method"
                name="method"
                value={inputs.method}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option>GET</option>
                <option>POST</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="params" className="form-label">
                Params (key=value, comma-separated)
              </label>
              <input
                id="params"
                name="params"
                type="text"
                value={inputs.params}
                onChange={handleChange}
                className="form-control"
                placeholder="q=search,page=1"
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="payloads" className="form-label">
                Payloads (optional, comma-separated)
              </label>
              <input
                id="payloads"
                name="payloads"
                type="text"
                value={inputs.payloads}
                onChange={handleChange}
                className="form-control"
                placeholder="' OR '1'='1',' OR '1'='1' --"
                disabled={loading}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                {loading ? 'Testing...' : 'Run Test'}
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
