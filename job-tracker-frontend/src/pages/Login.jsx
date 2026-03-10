import React from 'react'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-800 text-white tracking-tight">
            Job<span className="text-amber-400">Track</span>
          </h1>
          <p className="text-slate-400 mt-2 font-body text-sm">Your job search, organized.</p>
        </div>

        <div className="bg-ink-800 border border-ink-600 rounded-2xl p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-ink-950 font-semibold py-2.5 rounded-lg transition-colors mt-2 font-display disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500 text-center">
            No account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}