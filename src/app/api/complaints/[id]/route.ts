import { NextRequest, NextResponse } from 'next/server'
import { getComplaintById, updateComplaintStatus } from '@/lib/db'

// GET - Fetch single complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const complaint = await getComplaintById(id)

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return NextResponse.json({ error: 'Failed to fetch complaint' }, { status: 500 })
  }
}

// PATCH - Update complaint status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { status } = body

    if (!status || !['open', 'in-progress', 'in_progress', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: open, in-progress, in_progress, closed' },
        { status: 400 }
      )
    }
    // Normalize status to match database format (in-progress -> in_progress)
    const normalizedStatus = status === 'in-progress' ? 'in_progress' : status

    const complaint = await getComplaintById(id)
    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    await updateComplaintStatus(id, normalizedStatus)

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Error updating complaint:', error)
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 })
  }
}