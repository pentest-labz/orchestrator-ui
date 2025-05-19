import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/Login/Login.jsx'
import BruteForm from '../components/BruteForm/BruteForm.jsx'
import SqlInjectForm from '../components/SqlInjectForm/SqlInjectForm.jsx'
import Register from '../components/Register/Register.jsx'
import ScanForm from '../components/ScanForm/ScanForm.jsx'
import Home from '../components/Home/Home.jsx'
import useAuth from '../hooks/useAuth.js'

export default function AppRouter() {
  const { token } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root based on auth */}
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />

        {/* Protected routes */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/scan" element={token ? <ScanForm /> : <Navigate to="/login" replace />} />
        <Route path="/brute" element={token ? <BruteForm /> : <Navigate to="/login" replace />} />
        <Route path="/sqlinject" element={token ? <SqlInjectForm /> : <Navigate to="/login" replace />} />

        {/* Public routes with redirect if already authenticated */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/home" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            token ? <Navigate to="/home" replace /> : <Register />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
