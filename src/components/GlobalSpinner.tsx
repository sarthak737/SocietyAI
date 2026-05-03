'use client'

import { Loader2 } from 'lucide-react'

export default function GlobalSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
        <p className="mt-6 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 animate-pulse relative z-10">
          SocietyAI is loading...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Optimizing your community experience
        </p>
      </div>
    </div>
  )
}
