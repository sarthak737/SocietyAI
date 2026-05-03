import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic'

// GET - Fetch all rules
export async function GET() {
  try {
    const rules = await prisma.societyRule.findMany({
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(rules)
  } catch (error) {
    console.error("Error fetching rules:", error)
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 })
  }
}

// POST - Create a new rule
export async function POST(request: NextRequest) {
  try {
    const { topic, content } = await request.json()
    
    if (!topic || !content) {
      return NextResponse.json({ error: "Topic and content are required" }, { status: 400 })
    }

    const newRule = await prisma.societyRule.create({
      data: {
        topic,
        content
      }
    })

    return NextResponse.json(newRule, { status: 201 })
  } catch (error) {
    console.error("Error creating rule:", error)
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 })
  }
}

// DELETE - Delete a rule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idStr = searchParams.get('id')
    
    if (!idStr) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 })
    }

    const id = parseInt(idStr, 10)
    await prisma.societyRule.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting rule:", error)
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 })
  }
}
