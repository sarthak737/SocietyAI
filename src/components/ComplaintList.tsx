'use client'

import { useEffect, useState } from 'react'

interface Complaint {
  id: number
  flat_number: string
  resident_name: string
  phone: string
  complaint_text: string
  status: string
  category: string
  priority: string
  created_at: string
}

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints')
      const data = await res.json()
      setComplaints(data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No complaints yet
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold">{complaint.flat_number}</span>
              <span className="text-gray-500 ml-2">- {complaint.resident_name}</span>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
              <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-2">{complaint.complaint_text}</p>
          <div className="text-xs text-gray-500">
            {complaint.category} • {new Date(complaint.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}