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
  sender?: { name: string }
}

interface Resident {
  id: number
  name: string
  flat_number: string
}

export default function AdminChat() {
  const { data: session } = useSession()
  const adminId = (session?.user as any)?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<string>('all')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch residents for dropdown
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setResidents(data) })
      .catch(e => console.error('load residents error', e))

    // Fetch initial messages
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
    const messageContent = input.trim()
    if (!messageContent) return
    
    setLoading(true)

    // Optimistic Update
    const optimisticMessage: Message = {
      id: Date.now(),
      senderId: Number(adminId),
      receiverId: selectedRecipient === 'all' ? null : Number(selectedRecipient),
      content: messageContent,
      isFromAdmin: true,
      created_at: new Date().toISOString(),
      sender: { name: session?.user?.name || 'Admin' }
    }
    setMessages(prev => [...prev, optimisticMessage])
    setInput('')

    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: messageContent,
          receiverId: selectedRecipient === 'all' ? null : Number(selectedRecipient)
        })
      })
    } catch (e) {
      console.error('admin send message error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-4 rounded-2xl mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Broadcast & Direct Chat</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">To:</span>
          <select 
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="text-xs p-1 rounded bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Residents (Broadcast)</option>
            {residents.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.flat_number})</option>
            ))}
          </select>
        </div>
      </div>

      <div ref={panelRef} className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl mb-4 border border-gray-100 dark:border-slate-800">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isFromAdmin ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-gray-500 mb-1 px-1">
              {msg.isFromAdmin ? 'Admin (You)' : (msg.sender?.name || `Resident ${msg.senderId}`)}
              {msg.isFromAdmin && msg.receiverId === null && <span className="ml-1 text-indigo-500 font-bold">(Broadcast)</span>}
            </span>
            <div
              className={`max-w-[85%] p-2.5 rounded-2xl text-sm ${
                msg.isFromAdmin
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-gray-400 dark:text-gray-500 text-xs py-10">No communication history.</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={selectedRecipient === 'all' ? "Broadcast to all..." : "Type private message..."}
          className="flex-1 p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center transition-colors">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </div>
  )
}
