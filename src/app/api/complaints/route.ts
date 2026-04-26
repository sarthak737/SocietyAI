import { NextRequest, NextResponse } from 'next/server'
import { createComplaint, updateComplaintWithAI, getComplaints, getComplaintStats } from '@/lib/db'
import { analyzeComplaint } from '@/lib/ai'

// GET - Fetch all complaints or filtered
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined

    if (searchParams.get('stats') === 'true') {
      const stats = getComplaintStats()
      return NextResponse.json(stats)
    }

    const complaints = getComplaints({ status, category })
    return NextResponse.json(complaints)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 })
  }
}

// POST - Create new complaint and process with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flat_number, resident_name, phone, complaint_text, audio_url } = body

    // Validate required fields
    if (!flat_number || !resident_name || !complaint_text) {
      return NextResponse.json(
        { error: 'Missing required fields: flat_number, resident_name, complaint_text' },
        { status: 400 }
      )
    }

    // Create complaint in database
    const complaintId = createComplaint({
      flat_number,
      resident_name,
      phone,
      complaint_text,
      audio_url,
    })

    // Process with AI
    const aiResult = await analyzeComplaint(complaint_text)

    // Update complaint with AI analysis
    updateComplaintWithAI(Number(complaintId), aiResult)

    return NextResponse.json({
      success: true,
      id: complaintId,
      ...aiResult,
    })
  } catch (error) {
    console.error('Error creating complaint:', error)
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 })
  }
}