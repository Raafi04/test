import { useEffect, useState } from 'react'
import api from './api/axios'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'

import './App.css'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')

  useEffect(() => {
    if (!token) {
      return
    }

    setView('home')

    const loadUser = async () => {
      try {
        const response = await api.get('/me')
        setUser(response.data)
      } catch (err) {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        setView('login')
      }
    }

    loadUser()
  }, [token])

  const handleAuthSuccess = (payload) => {
    localStorage.setItem('token', payload.token)
    setToken(payload.token)
    setUser(payload.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
    setView('login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-slate-100">
      {token ? <Navbar user={user} onLogout={handleLogout} /> : null}

      {!token && view === 'login' ? (
        <Login onSuccess={handleAuthSuccess} onSwitch={() => setView('register')} />
      ) : null}
      {!token && view === 'register' ? (
        <Register onSuccess={handleAuthSuccess} onSwitch={() => setView('login')} />
      ) : null}
      {token ? <Home onLogout={handleLogout} /> : null}
    </div>
  )
}

export default App
