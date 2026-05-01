'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, X, Loader2 } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, critical: 0 })
  const [trendReport, setTrendReport] = useState<string | null>(null)
  const [loadingTrend, setLoadingTrend] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

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
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
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
            <p className="text-sm font-medium text-slate-500 mb-1">Total Issues</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Open</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.open}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.inProgress}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Critical</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.critical}</h3>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {trendReport && (
        <div className="glass-panel p-6 mb-8 relative border-l-4 border-l-indigo-500 animate-fade-in">
          <button 
            onClick={() => setTrendReport(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            AI Trend Report
          </h3>
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {trendReport}
          </div>
        </div>
      )}
    </div>
  )
}
