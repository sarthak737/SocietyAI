'use client'

import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

interface SocietyRule {
  id: number
  topic: string
  content: string
  created_at: string
}

export default function ResidentRules() {
  const [rules, setRules] = useState<SocietyRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/rules')
      const data = await res.json()
      if (Array.isArray(data)) setRules(data)
    } catch (e) {
      console.error('Failed to load rules', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading rules...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        Society Rules
      </h2>
      {rules.length === 0 ? (
        <p className="text-gray-500">No rules have been added yet.</p>
      ) : (
        <div className="space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="glass-panel p-5 rounded-2xl">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">{rule.topic}</h3>
              <p className="text-gray-700 dark:text-gray-400 whitespace-pre-wrap">{rule.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
