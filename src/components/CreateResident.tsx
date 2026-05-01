'use client'

import { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'

export default function CreateResident() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    flat_number: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Resident account created successfully!')
        setFormData({ name: '', email: '', password: '', flat_number: '', phone: '' })
      } else {
        setMessage(data.error || 'Failed to create resident')
      }
    } catch (error) {
      setMessage('Error creating resident')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-8 mb-12 shadow-sm border border-white/60">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Resident</h2>
          <p className="text-sm text-gray-500">Create an account for a new resident</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Flat Number</label>
            <input
              type="text"
              required
              value={formData.flat_number}
              onChange={e => setFormData({ ...formData, flat_number: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. A-101"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Temporary Password</label>
            <input
              type="text"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center w-48"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium inline-block mt-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
