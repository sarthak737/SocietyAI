import DashboardStats from '@/components/DashboardStats'
import ComplaintList from '@/components/ComplaintList'
import CreateResident from '@/components/CreateResident'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login?role=admin')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <header className="flex justify-between items-center mb-8 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Committee Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and resolve resident issues</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/rules" 
            className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Manage Knowledge Base
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Back to Portal
          </Link>
        </div>
      </header>

      <main>
        <DashboardStats />
        
        <CreateResident />

        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Tickets</h2>
              <p className="text-gray-500 text-sm mt-1">AI-analyzed issues needing attention</p>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50">Filter</button>
              <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50">Sort</button>
            </div>
          </div>
          
          <ComplaintList isAdmin={true} />
        </div>
      </main>
    </div>
  )
}
