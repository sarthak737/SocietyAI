'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'resident'
  const { data: session, status } = useSession()
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(errorParam ? 'Invalid credentials' : '')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect immediately
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const userRole = (session.user as any).role
      if (userRole === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/resident')
      }
    }
  }, [status, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError('Invalid credentials')
        setLoading(false)
      } else {
        // Trigger a router refresh so session propagates to Navbar
        router.refresh()
        // Then navigate
        const redirectUrl = role === 'admin' ? '/admin' : '/resident'
        router.push(redirectUrl)
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('An error occurred during sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md shadow-xl border border-white/60">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{role} Login</h2>
          <p className="text-gray-500">
            {role === 'admin'
              ? 'Login with admin@gmail.com and admin@123'
              : 'Enter your resident credentials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white shadow-md transition-all flex justify-center items-center ${
              role === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-gray-800'
            } disabled:opacity-70`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>}>
      <LoginForm />
    </Suspense>
  )
}
