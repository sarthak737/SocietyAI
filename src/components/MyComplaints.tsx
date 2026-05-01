'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle2, MessageSquare } from 'lucide-react'

interface Complaint {
  id: number
  flat_number: string
  resident_name: string
  complaint_text: string
  status: string
  category: string | null
  urgency: string | null
  summary: string | null
  suggested_action: string | null
  created_at: string
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/resident/complaints')
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

  const getUrgencyIcon = (urgency: string | null) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
      case 'high': return <AlertTriangle className="text-red-500" size={16} />
      case 'medium': return <Clock className="text-yellow-500" size={16} />
      default: return <CheckCircle2 className="text-green-500" size={16} />
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-white/50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Complaints</h2>
      {complaints.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-2xl">
          <MessageSquare className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-500">You haven't submitted any complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="glass-panel p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{complaint.summary || complaint.complaint_text}</h3>
                  <p className="text-xs text-gray-500">{new Date(complaint.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(complaint.status)}`}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2 items-center text-sm">
                {complaint.category && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded capitalize text-gray-700">{complaint.category}</span>
                )}
                {complaint.urgency && (
                  <div className="flex items-center gap-1">
                    {getUrgencyIcon(complaint.urgency)}
                    <span className="capitalize text-gray-700">{complaint.urgency}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
