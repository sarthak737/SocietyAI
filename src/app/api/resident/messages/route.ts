import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: Number(userId) }, { receiverId: Number(userId) }] },
    orderBy: { created_at: 'asc' },
  })
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const body = await request.json()
  const { content, complaintId } = body
  if (!content) {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }
  const message = await prisma.message.create({
    data: {
      senderId: Number(userId),
      // receiverId left null for admin messages; admin can fetch all
      complaintId: complaintId ? Number(complaintId) : undefined,
      content,
      isFromAdmin: false,
    },
  })
  return NextResponse.json(message, { status: 201 })
}
