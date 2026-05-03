'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, X, Loader2 } from 'lucide-react'

interface Stats {
  total: number
  open: number
  inProgress: number
  critical: number
}

export default function DashboardStats({ initialStats }: { initialStats?: Stats }) {
  const [stats, setStats] = useState(initialStats || { total: 0, open: 0, inProgress: 0, critical: 0 })
  const [trendReport, setTrendReport] = useState<string | null>(null)
  const [loadingTrend, setLoadingTrend] = useState(false)

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats)
    } else {
      fetchStats()
    }
  }, [initialStats])


  const fetchStats = async () => {
    try {
      const res = await fetch('/api/complaints')
      const data = await res.json()
      
      const open = data.filter((c: any) => c.status === 'open').length
      const inProgress = data.filter((c: any) => c.status === 'in_progress').length
      const critical = data.filter((c: any) => c.urgency === 'critical').length
      
      setStats({
        total: data.length,
        open,
        inProgress,
        critical
      })
    } catch (error) {
      console.error('Failed to fetch stats', error)
    }
  }

  const generateTrendReport = async () => {
    setLoadingTrend(true)
    setTrendReport(null)
    try {
      const res = await fetch('/api/admin/summarize')
      const data = await res.json()
      setTrendReport(data.summary || "No summary available.")
    } catch (error) {
      console.error("Failed to generate trend report", error)
      setTrendReport("Failed to generate trend report. Please try again.")
    } finally {
      setLoadingTrend(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Overview</h2>
        <button
          onClick={generateTrendReport}
          disabled={loadingTrend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70"
        >
          {loadingTrend ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          Generate Trend Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Total Issues</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-gray-100">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Open</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-gray-100">{stats.open}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">In Progress</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-gray-100">{stats.inProgress}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Critical</p>
            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.critical}</h3>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {trendReport && (
        <div className="glass-panel p-6 mb-8 relative border-l-4 border-l-indigo-500 dark:border-l-indigo-400 animate-fade-in">
          <button 
            onClick={() => setTrendReport(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            AI Trend Report
          </h3>
          <div className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {trendReport}
          </div>
        </div>
      )}
    </div>
  )
}
