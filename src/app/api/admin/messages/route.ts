import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const messages = await prisma.message.findMany({
    orderBy: { created_at: 'asc' },
  })
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { content, complaintId } = body
  if (!content) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }
  const message = await prisma.message.create({
    data: {
      senderId: Number(session.user.id),
      isFromAdmin: true,
      complaintId: complaintId ? Number(complaintId) : undefined,
      content,
    },
  })
  return NextResponse.json(message, { status: 201 })
}
