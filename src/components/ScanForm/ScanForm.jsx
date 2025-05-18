import React, { useState, useRef } from 'react'
import { triggerScan } from '../../api/scan.js'
import useAuth from '../../hooks/useAuth.js'

export default function ScanForm() {
  const { token, logout } = useAuth()
  const [inputs, setInputs] = useState({
    target: '',
    scan_type: 'all',      // default to “scan all ports”
    version: false,
    ports: ''
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)
   const abortController = useRef(null)

  const handle = e => {
    const { name, value, type, checked } = e.target
    setInputs(i => ({
      ...i,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const submit = async e => {
    e.preventDefault()
    setError('')
    setResult(null)
     // initialize abort controller
     abortController.current = new AbortController()
     setLoading(true)
    try {
      const { ports, version, scan_type, target } = inputs
      const params = { target, scan_type, version: version.toString() }
      if (scan_type === 'custom') params.ports = ports
       const data = await triggerScan(params, token, abortController.current.signal)
      setResult(data)
    } catch (e) {
       if (e.name === 'AbortError') {
         setError('Scan cancelled')
       } else {
         setError(e.message)
       }
    } finally {
       setLoading(false)
    }
  }

   const handleCancel = () => {
     if (abortController.current) {
       abortController.current.abort()
     }
   }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="card w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">New Scan</h5>
          <button onClick={logout} className="btn btn-outline-secondary btn-sm">
            Logout
          </button>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="target" className="form-label">
                Target
              </label>
              <input
                id="target"
                name="target"
                type="text"
                value={inputs.target}
                onChange={handle}
                className="form-control"
                placeholder="example.com or 192.168.1.1"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="scan_type" className="form-label">
                Scan Type
              </label>
              <select
                id="scan_type"
                name="scan_type"
                value={inputs.scan_type}
                onChange={handle}
                className="form-select"
                disabled={loading}
              >
                <option value="all">All Ports</option>
                <option value="top10">Quick (Top 10)</option>
                <option value="top100">Top 100</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="version"
                name="version"
                checked={inputs.version}
                onChange={handle}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="version">
                Detect Version
              </label>
            </div>

            {inputs.scan_type === 'custom' && (
              <div className="mb-3">
                <label htmlFor="ports" className="form-label">
                  Ports (comma-separated)
                </label>
                <input
                  id="ports"
                  name="ports"
                  type="text"
                  value={inputs.ports}
                  onChange={handle}
                  className="form-control"
                  placeholder="22,80,443"
                  required
                  disabled={loading}
                />
              </div>
            )}

             <div className="d-flex gap-2">
               <button
                 type="submit"
                 className="btn btn-primary flex-grow-1"
                 disabled={loading}
               >
                 {loading ? 'Scanning...' : 'Run Scan'}
               </button>
               {loading && (
                 <button
                   type="button"
                   className="btn btn-danger"
                   onClick={handleCancel}
                 >
                   Cancel
                 </button>
               )}
             </div>
          </form>

          {result && (
            <pre
              className="mt-4 p-3 bg-light border rounded"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
