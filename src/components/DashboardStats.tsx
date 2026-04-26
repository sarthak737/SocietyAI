'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/complaints?stats=true')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-24 animate-pulse bg-gray-200 rounded-2xl"></div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:shadow-soft transition-all duration-300">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
      </div>
      
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:shadow-soft transition-all duration-300">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Open</p>
          <p className="text-2xl font-bold text-gray-800">{stats.open}</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:shadow-soft transition-all duration-300">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:shadow-soft transition-all duration-300">
        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-gray-800">{stats.closed}</p>
        </div>
      </div>
    </div>
  )
}
