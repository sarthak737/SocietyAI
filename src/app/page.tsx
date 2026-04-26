import ComplaintForm from '@/components/ComplaintForm'
import ComplaintList from '@/components/ComplaintList'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit a Complaint</h1>
          <ComplaintForm />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Recent Complaints</h1>
          <ComplaintList />
        </div>
      </div>
    </div>
  )
}