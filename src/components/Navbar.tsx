'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Sun, Moon, ChevronLeft } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const isHome = pathname === '/'
  const showBack = !isHome && !pathname.startsWith('/admin') && !pathname.startsWith('/resident')

  return (
    <nav className="glass-panel border-b border-white/50 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-2 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              title="Go back"
            >
              <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <Link
            href="/"
            className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight"
          >
            SocietyAI
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>
          )}

          {status === 'loading' ? (
            <div className="px-4 py-1.5 text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              {session.user?.role === 'RESIDENT' && (
                <Link href="/resident" className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors">
                  My Portal
                </Link>
              )}
              <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-gray-200 dark:border-slate-700">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{session.user?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{session.user?.role?.toLowerCase()}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
