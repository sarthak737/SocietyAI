import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { analyzeTrends } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch recent complaints (e.g., from the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const complaints = await prisma.complaint.findMany({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { created_at: 'desc' }
    })

    if (complaints.length === 0) {
      return NextResponse.json({ summary: "No complaints found in the last 30 days to analyze." })
    }

    const summary = await analyzeTrends(complaints)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error summarizing trends:", error)
    return NextResponse.json({ error: "Failed to generate trend summary" }, { status: 500 })
  }
}
