import ComplaintForm from '@/components/ComplaintForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <header className="flex justify-between items-center mb-12 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
            SocietyAI
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Smart Housing Management</p>
        </div>
        <Link 
          href="/admin" 
          className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          Committee Login
        </Link>
      </header>

      <main>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Report an Issue</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe your problem or use the voice recorder to speak in your preferred language. Our AI will automatically categorize and forward it to the committee.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ComplaintForm />
        </div>
      </main>
    </div>
  )
}