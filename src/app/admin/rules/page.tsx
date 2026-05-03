'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Loader2, BookOpen } from 'lucide-react'

interface SocietyRule {
  id: number
  topic: string
  content: string
  created_at: string
}

export default function RulesPage() {
  const [rules, setRules] = useState<SocietyRule[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ topic: '', content: '' })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/rules')
      const data = await res.json()
      setRules(data)
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({ topic: '', content: '' })
        fetchRules()
      }
    } catch (error) {
      console.error('Error adding rule:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const res = await fetch(`/api/admin/rules?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) fetchRules()
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-gray-100">Knowledge Base</h1>
        <p className="text-slate-600 dark:text-gray-400">Manage rules and information that the AI Assistant uses to answer resident queries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Add New Rule
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swimming Pool Timings"
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="The pool is open from 6:00 AM to 10:00 PM..."
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center font-medium disabled:opacity-70"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Rule'}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Current Rules
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-gray-400 py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                No rules added yet. Start adding rules to power your AI assistant!
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm flex items-start justify-between group">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-gray-100 text-lg mb-1">{rule.topic}</h3>
                      <p className="text-slate-600 dark:text-gray-400 whitespace-pre-wrap text-sm">{rule.content}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="text-slate-400 hover:text-red-500 transition p-2 opacity-0 group-hover:opacity-100"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
