'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Trash2, Loader2 } from 'lucide-react'

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    flat_number: '',
    resident_name: '',
    phone: '',
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
      setMessage('Microphone access denied. Please allow microphone permissions.')
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
    if (!formData.complaint_text.trim() && !audioBlob) {
      setMessage('Please provide either a text description or a voice recording.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const submitData = new FormData()
      submitData.append('flat_number', formData.flat_number)
      submitData.append('resident_name', formData.resident_name)
      submitData.append('phone', formData.phone)
      submitData.append('complaint_text', formData.complaint_text)
      
      if (audioBlob) {
        submitData.append('audio', audioBlob, 'recording.webm')
      }

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: submitData, // FormData is sent without Content-Type header so browser sets it with boundary
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Complaint submitted successfully!')
        setFormData({ flat_number: '', resident_name: '', phone: '', complaint_text: '' })
        setAudioBlob(null)
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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Flat Number *
            </label>
            <input
              type="text"
              required
              value={formData.flat_number}
              onChange={(e) => setFormData({ ...formData, flat_number: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g., A-101"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Resident Name *
            </label>
            <input
              type="text"
              required
              value={formData.resident_name}
              onChange={(e) => setFormData({ ...formData, resident_name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Your Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="For updates (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Complaint Description *
          </label>
          
          <div className="relative">
            <textarea
              rows={4}
              value={formData.complaint_text}
              onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Describe your issue or click the mic to record..."
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {audioBlob && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  <span>Audio Recorded</span>
                  <button type="button" onClick={removeAudio} className="hover:text-green-900">
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
          className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
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

        {message && (
          <div className={`p-4 rounded-xl text-center font-medium ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}