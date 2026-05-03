'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle2, MoreVertical, MessageSquare } from 'lucide-react'
import { FormattedDate } from './FormattedDate'

interface Complaint {
  id: number
  flat_number: string
  resident_name: string
  phone: string | null
  complaint_text: string
  status: string
  category: string | null
  urgency: string | null
  summary: string | null
  suggested_action: string | null
  created_at: string
}

export default function ComplaintList({ isAdmin = false, initialComplaints }: { isAdmin?: boolean, initialComplaints?: Complaint[] }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints || [])
  const [loading, setLoading] = useState(!initialComplaints)

  useEffect(() => {
    if (initialComplaints) {
      setComplaints(initialComplaints)
      setLoading(false)
    } else {
      fetchComplaints()
    }


    const handleRefresh = () => fetchComplaints()
    window.addEventListener('refreshComplaints', handleRefresh)
    return () => window.removeEventListener('refreshComplaints', handleRefresh)
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints')
      const data = await res.json()
      if (Array.isArray(data)) {
        setComplaints(data)
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/complaints?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        // Refresh the list
        fetchComplaints()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white/50 dark:bg-slate-800/50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    )
  }

  if (complaints.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No complaints</h3>
        <p className="text-gray-500 dark:text-gray-400">Everything is running smoothly!</p>
      </div>
    )
  }

  const getUrgencyIcon = (urgency: string | null) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
      case 'high': return <AlertTriangle className="text-red-500" size={18} />
      case 'medium': return <Clock className="text-yellow-500" size={18} />
      default: return <CheckCircle2 className="text-green-500" size={18} />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'in_progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'closed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="glass-panel p-6 rounded-2xl hover:shadow-soft transition-all duration-300 animate-slide-up group">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1.5 rounded-lg">
                {complaint.flat_number}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{complaint.resident_name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <FormattedDate date={complaint.created_at} />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(complaint.status)}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
              {isAdmin && (
                <select
                  value={complaint.status}
                  onChange={(e) => updateStatus(complaint.id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">{complaint.summary || complaint.complaint_text}</p>
            {complaint.summary && complaint.complaint_text !== complaint.summary && (
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Original: {complaint.complaint_text}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center text-sm bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md shadow-sm border border-gray-100 dark:border-slate-700">
              {getUrgencyIcon(complaint.urgency)}
              <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{complaint.urgency || 'Normal'}</span>
            </div>
            
            {complaint.category && (
              <div className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md shadow-sm border border-gray-100 dark:border-slate-700 capitalize font-medium text-gray-700 dark:text-gray-300">
                {complaint.category}
              </div>
            )}

            {isAdmin && complaint.suggested_action && (
              <div className="w-full sm:w-auto sm:ml-auto flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md mt-2 sm:mt-0">
                <span className="font-semibold text-xs mr-1">AI Suggests:</span>
                <span className="text-xs">{complaint.suggested_action}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}