import { NextRequest, NextResponse } from 'next/server'
import { getComplaintById, updateComplaintStatus } from '@/lib/db'

// GET - Fetch single complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const complaint = getComplaintById(id)

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

    if (!status || !['open', 'in-progress', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: open, in-progress, or closed' },
        { status: 400 }
      )
    }

    const complaint = getComplaintById(id)
    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    updateComplaintStatus(id, status)

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Error updating complaint:', error)
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 })
  }
}