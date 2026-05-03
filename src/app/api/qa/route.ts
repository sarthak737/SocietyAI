import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { answerResidentQuestion } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()
    
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // Fetch all rules
    const rulesRecords = await prisma.societyRule.findMany()
    const rulesText = rulesRecords
        .map((r: { topic: string; content: string }) =>
          r.topic && r.content
            ? `[${r.topic}]: ${r.content}`
            : ''
        )
        .filter(Boolean)
        .join('\n\n')

    if (!rulesText) {
      return NextResponse.json({ answer: "I'm sorry, but no society rules have been added to the knowledge base yet." })
    }

    const answer = await answerResidentQuestion(question, rulesText)

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error answering question:", error)
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 })
  }
}
