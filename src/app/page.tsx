import Link from 'next/link'
import { ShieldCheck, Home as HomeIcon } from 'lucide-react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    const role = (session.user as any).role
    if (role === 'ADMIN') redirect('/admin')
    else redirect('/resident')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 animate-fade-in">
      <div className="text-center mb-16 max-w-3xl">
        <h1 className="text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">SocietyAI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          The intelligent operating system for modern housing societies. 
          Report issues effortlessly, get AI-powered resolutions, and stay connected with your community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Resident Card */}
        <div className="glass-panel p-10 rounded-3xl hover:shadow-soft transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity dark:text-white">
            <HomeIcon size={120} />
          </div>
          <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <HomeIcon size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Resident Portal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 h-12">
            Submit complaints via voice or text. AI will instantly categorize and assign your ticket.
          </p>
          <Link href="/login?role=resident" className="inline-block w-full text-center bg-gray-900 dark:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors shadow-md">
            Login as Resident
          </Link>
        </div>

        {/* Admin Card */}
        <div className="glass-panel p-10 rounded-3xl hover:shadow-soft transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity dark:text-white">
            <ShieldCheck size={120} />
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Admin Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 h-12">
            Manage society operations, view AI-summarized tickets, and create resident accounts.
          </p>
          <Link href="/login?role=admin" className="inline-block w-full text-center bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
            Committee Login
          </Link>
        </div>
      </div>
    </div>
  )
}