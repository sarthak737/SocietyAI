'use client'

import { useState, useRef } from 'react'

import { Mic, Square, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'


import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export default function ComplaintForm() {
  const { data: session } = useSession()
  const router = useRouter()

  
  const [formData, setFormData] = useState({
    complaint_text: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone', err)
      toast.error('Microphone access denied. Please allow microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const removeAudio = () => {
    setAudioBlob(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      setMessage('You must be logged in to submit a complaint.')
      return
    }

    if (!formData.complaint_text.trim() && !audioBlob) {
      toast.error('Please provide either a text description or a voice recording.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const submitData = new FormData()
      // Automatically pull from secure session instead of user input
      submitData.append('flat_number', (session.user as any).flat_number || 'Unknown')
      submitData.append('resident_name', session.user.name || 'Unknown')
      submitData.append('phone', (session.user as any).phone || '')
      submitData.append('complaint_text', formData.complaint_text)
      // Attach the user ID to link the complaint securely
      submitData.append('userId', (session.user as any).id)
      
      if (audioBlob) {
        submitData.append('audio', audioBlob, 'recording.webm')
      }

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: submitData,
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Complaint submitted successfully!')
        setFormData({ complaint_text: '' })
        setAudioBlob(null)
        // Trigger refresh for other components like MyComplaints
        window.dispatchEvent(new Event('refreshComplaints'))
        router.refresh()
      } else {

        toast.error(data.error || 'Failed to submit complaint')
      }
    } catch (error) {
      toast.error('Error submitting complaint')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div className="text-center p-8 glass-panel rounded-2xl">Please log in to submit a complaint.</div>
  }

  return (
    <div className="glass-panel rounded-3xl shadow-xl p-8 border border-white/60 dark:border-slate-800">
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Submitting as</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{session.user?.name} <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded text-sm ml-2">{(session.user as any).flat_number}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Complaint Description *
          </label>
          
          <div className="relative">
            <textarea
              rows={4}
              value={formData.complaint_text}
              onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-gray-100"
              placeholder="Describe your issue or click the mic to record..."
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {audioBlob && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse shadow-sm">
                  <span>Audio Recorded</span>
                  <button type="button" onClick={removeAudio} className="hover:text-green-900 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              
              {!audioBlob && (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                >
                  {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!formData.complaint_text.trim() && !audioBlob)}
          className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={24} />
              Processing with AI...
            </>
          ) : (
            'Submit Complaint'
          )}
        </button>


      </form>
    </div>
  )
}