'use client'

import { useEffect, useState, useRef } from 'react'
import { Send, Loader2, ShieldCheck } from 'lucide-react'
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

export default function ResidentChat({ complaintId }: { complaintId?: number }) {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch initial messages
    fetch('/api/resident/messages')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMessages(data) })
      .catch(e => console.error('load messages error', e))

    // SSE for real-time updates
    const evtSource = new EventSource('/api/stream/messages')
    evtSource.onmessage = (event) => {
      try {
        const allMessages: Message[] = JSON.parse(event.data)
        const userMessages = allMessages.filter(
          (msg: Message) => 
            msg.senderId === userId || 
            msg.receiverId === userId || 
            (msg.isFromAdmin && msg.receiverId === null)
        )
        setMessages(userMessages)
      } catch (e) {
        console.error('SSE parse error', e)
      }
    }
    evtSource.onerror = () => {
      console.error('SSE connection error')
    }

    return () => { evtSource.close() }
  }, [userId])

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const messageContent = input.trim()
    if (!messageContent) return
    
    setLoading(true)
    
    // Optimistic Update
    const optimisticMessage: Message = {
      id: Date.now(), 
      senderId: Number(userId),
      receiverId: null,
      content: messageContent,
      isFromAdmin: false,
      created_at: new Date().toISOString(),
      sender: { name: session?.user?.name || 'You' }
    }
    setMessages(prev => [...prev, optimisticMessage])
    setInput('')

    try {
      await fetch('/api/resident/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent, complaintId })
      })
    } catch (e) {
      console.error('send message error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-4 rounded-2xl mt-8">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Official Communication</h3>
      </div>
      
      <div ref={panelRef} className="min-h-[250px] max-h-[50vh] h-80 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl mb-4 border border-gray-100 dark:border-slate-800">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${!msg.isFromAdmin ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-gray-500 mb-1 px-1">
              {msg.isFromAdmin ? 'Society Admin' : 'You'}
              {msg.isFromAdmin && msg.receiverId === null && <span className="ml-1 text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">BROADCAST</span>}
            </span>
            <div
              className={`max-w-[85%] p-2.5 rounded-2xl text-sm ${
                msg.isFromAdmin
                  ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-indigo-100 dark:border-indigo-900/50 shadow-sm'
                  : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No messages from management yet.</p>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message admin..."
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
