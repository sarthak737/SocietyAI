'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="glass-panel border-b border-white/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
          SocietyAI
        </Link>
        <div className="flex items-center space-x-6">
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              {session.user?.role === 'RESIDENT' && (
                <Link href="/resident" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  My Portal
                </Link>
              )}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-gray-900">{session.user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{session.user?.role?.toLowerCase()}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
