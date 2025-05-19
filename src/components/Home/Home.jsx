import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

export default function Home() {
  const { logout } = useAuth()
  const services = [
    {
      title: 'Scanner Service',
      description: 'Run network port scans and view results',
      path: '/scan',
    },
    {
      title: 'Brute-Force Service',
      description: 'Attempt credential brute-force against login forms',
      path: '/brute',
    },
    {
      title: 'SQL Injection Service',
      description: 'Test web endpoints for SQL injection vulnerabilities',
      path: '/sqlinject',
    },
    // add more services here

  ]

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Welcome Home!</h1>
        <div>
          <button onClick={logout} className="btn btn-outline-secondary">
            Logout
          </button>
        </div>
      </div>
      <p className="mb-5">This is your protected dashboard. You are successfully authenticated.</p>

      <div className="row">
        {services.map(service => (
          <div className="col-md-4 mb-4" key={service.path}>
            <Link to={service.path} className="text-decoration-none">
              <div className="card h-100 shadow-sm" style={{ minHeight: '250px' }}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text flex-grow-1">{service.description}</p>
                  <button className="btn btn-primary mt-auto">Go to {service.title}</button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
