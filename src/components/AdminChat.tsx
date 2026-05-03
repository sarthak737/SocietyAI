'use client'

import { useEffect, useState, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Message {
  id: number
  senderId: number
  receiverId: number | null
  content: string
  isFromAdmin: boolean
  created_at: string
}

export default function AdminChat() {
  const { data: session } = useSession()
  const adminId = (session?.user as any)?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/messages')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMessages(data) })
      .catch(e => console.error('load admin messages error', e))

    const evtSource = new EventSource('/api/stream/messages')
    evtSource.onmessage = (event) => {
      try {
        const allMessages: Message[] = JSON.parse(event.data)
        setMessages(allMessages)
      } catch (e) {
        console.error('SSE parse error', e)
      }
    }
    evtSource.onerror = () => console.error('SSE connection error')
    return () => evtSource.close()
  }, [])

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = panelRef.current.scrollHeight
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input.trim() })
      })
      setInput('')
    } catch (e) {
      console.error('admin send message error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-4 rounded-2xl mt-8">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Chat with Residents</h3>
      <div ref={panelRef} className="h-60 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-slate-800 rounded mb-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.isFromAdmin
                ? 'bg-indigo-600 text-white rounded-tl-none ml-auto'
                : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tr-none'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet.</p>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="p-2 bg-indigo-600 text-white rounded-lg flex items-center">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </button>
      </form>
    </div>
  )
}
