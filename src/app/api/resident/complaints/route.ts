import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const complaints = await prisma.complaint.findMany({
    where: { userId: Number(userId) },
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json(complaints)
}
