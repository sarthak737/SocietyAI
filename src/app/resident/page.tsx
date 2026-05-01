import ComplaintForm from '@/components/ComplaintForm'
import QAWidget from '@/components/QAWidget'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function ResidentPortal() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login?role=resident')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in relative min-h-[calc(100vh-80px)]">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Report an Issue</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe your problem or use the voice recorder to speak in your preferred language. 
          Your Flat Number and details are automatically attached securely.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ComplaintForm />
      </div>

      <QAWidget />
    </div>
  )
}
