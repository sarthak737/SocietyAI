'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle2, MoreVertical, MessageSquare } from 'lucide-react'

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

export default function ComplaintList({ isAdmin = false }: { isAdmin?: boolean }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaints()
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
    // In a real app we'd have a PUT endpoint
    // For now we assume the list just shows data
    alert(`Update status for ID ${id} to ${newStatus} (Endpoint pending)`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white/50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    )
  }

  if (complaints.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No complaints</h3>
        <p className="text-gray-500">Everything is running smoothly!</p>
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
      case 'open': return 'bg-red-100 text-red-700 border-red-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'closed': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="glass-panel p-6 rounded-2xl hover:shadow-soft transition-all duration-300 animate-slide-up group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg">
                {complaint.flat_number}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{complaint.resident_name}</span>
                <span className="text-xs text-gray-500">{new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(complaint.status)}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
              {isAdmin && (
                <button className="text-gray-400 hover:text-gray-700 transition">
                  <MoreVertical size={20} />
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-800 font-medium mb-1">{complaint.summary || complaint.complaint_text}</p>
            {complaint.summary && complaint.complaint_text !== complaint.summary && (
              <p className="text-gray-500 text-sm line-clamp-2">Original: {complaint.complaint_text}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center text-sm bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
              {getUrgencyIcon(complaint.urgency)}
              <span className="capitalize font-medium text-gray-700">{complaint.urgency || 'Normal'}</span>
            </div>
            
            {complaint.category && (
              <div className="bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-100 capitalize font-medium text-gray-700">
                {complaint.category}
              </div>
            )}

            {isAdmin && complaint.suggested_action && (
              <div className="ml-auto flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
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