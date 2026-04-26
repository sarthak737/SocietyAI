'use client'

import { useState } from 'react'

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    flat_number: '',
    resident_name: '',
    phone: '',
    complaint_text: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Complaint submitted successfully!')
        setFormData({ flat_number: '', resident_name: '', phone: '', complaint_text: '' })
      } else {
        setMessage(data.error || 'Failed to submit complaint')
      }
    } catch (error) {
      setMessage('Error submitting complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flat Number *
          </label>
          <input
            type="text"
            required
            value={formData.flat_number}
            onChange={(e) => setFormData({ ...formData, flat_number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., A-101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resident Name *
          </label>
          <input
            type="text"
            required
            value={formData.resident_name}
            onChange={(e) => setFormData({ ...formData, resident_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.complaint_text}
            onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your complaint in detail..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {message && (
          <p className={`text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}