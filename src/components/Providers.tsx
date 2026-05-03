'use client'

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { Toaster } from 'react-hot-toast'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import GlobalSpinner from './GlobalSpinner'

interface LoadingContextType {
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export default function Providers({
  children,
  session
}: {
  children: ReactNode
  session?: Session | null
}) {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  // Reset loading state on route change or safety timeout
  useEffect(() => {
    setLoading(false)
    
    // Safety timeout: Never allow the spinner to stay up more than 15 seconds
    const timer = setTimeout(() => {
      setLoading(false)
    }, 15000)
    
    return () => clearTimeout(timer)
  }, [pathname])



  return (
    <SessionProvider session={session}>
      <LoadingContext.Provider value={{ setLoading }}>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
        {loading && <GlobalSpinner />}
        {children}
      </LoadingContext.Provider>
    </SessionProvider>
  )
}
