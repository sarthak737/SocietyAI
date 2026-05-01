'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react'

export default function QAWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I am your Society AI Assistant. Ask me anything about the society rules, timings, or policies.' }
  ])
  const [loading, setLoading] = useState(false)

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    const userQ = question.trim()
    setChat(prev => [...prev, { role: 'user', text: userQ }])
    setQuestion('')
    setLoading(true)

    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQ })
      })
      const data = await res.json()
      
      setChat(prev => [...prev, { 
        role: 'ai', 
        text: data.answer || data.error || 'Sorry, I could not process that request.' 
      }])
    } catch (error) {
      console.error('QA Error:', error)
      setChat(prev => [...prev, { role: 'ai', text: 'Error connecting to the AI assistant.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center animate-bounce-slow ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in z-50">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Bot className="w-5 h-5" />
              Society Rules Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {chat.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-700 self-start rounded-tl-none' : 'bg-indigo-600 text-white self-end rounded-tr-none'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-white border border-slate-200 text-slate-700 self-start p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={askQuestion} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about rules..."
              className="flex-1 p-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
