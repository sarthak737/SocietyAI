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
      const stats = await getComplaintStats()
      return NextResponse.json(stats)
    }

    const complaints = await getComplaints({ status, category })
    return NextResponse.json(complaints)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 })
  }
}

// POST - Create new complaint and process with AI
export async function POST(request: NextRequest) {
  try {
    let flat_number = ''
    let resident_name = ''
    let phone = ''
    let complaint_text = ''
    let audioBase64 = undefined
    let audioMimeType = undefined
    let userId: number | undefined = undefined

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      flat_number = formData.get('flat_number') as string
      resident_name = formData.get('resident_name') as string
      phone = formData.get('phone') as string || ''
      complaint_text = formData.get('complaint_text') as string || ''
      if (formData.get('userId')) {
        userId = parseInt(formData.get('userId') as string)
      }
      
      const audioFile = formData.get('audio') as File
      if (audioFile && audioFile.size > 0) {
        const arrayBuffer = await audioFile.arrayBuffer()
        audioBase64 = Buffer.from(arrayBuffer).toString('base64')
        audioMimeType = audioFile.type
      }
    } else {
      const body = await request.json()
      flat_number = body.flat_number
      resident_name = body.resident_name
      phone = body.phone || ''
      complaint_text = body.complaint_text || ''
      userId = body.userId ? parseInt(body.userId) : undefined
    }

    if (!flat_number || !resident_name || (!complaint_text && !audioBase64)) {
      return NextResponse.json(
        { error: 'Missing required fields: flat_number, resident_name, and either text or audio complaint' },
        { status: 400 }
      )
    }

    // Process with AI first
    const aiResult = await analyzeComplaint(complaint_text, audioBase64, audioMimeType)

    const finalComplaintText = complaint_text || aiResult.transcription || 'Audio complaint'

    // Create complaint in database
    const complaintId = await createComplaint({
      flat_number,
      resident_name,
      phone,
      complaint_text: finalComplaintText,
      audio_url: audioBase64 ? 'audio-saved' : undefined,
      userId,
    })

    // Update complaint with AI analysis
    await updateComplaintWithAI(Number(complaintId), {
      category: aiResult.category,
      urgency: aiResult.urgency,
      summary: aiResult.summary,
      suggested_action: aiResult.suggested_action
    })

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