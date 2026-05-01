import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  // Send initial comment to keep connection alive
  await writer.write(encoder.encode(`:\n\n`))

  const interval = setInterval(async () => {
    try {
      const messages = await prisma.message.findMany({ orderBy: { created_at: 'asc' } })
      const payload = JSON.stringify(messages)
      await writer.write(encoder.encode(`data: ${payload}\n\n`))
    } catch (e) {
      console.error('SSE error', e)
    }
  }, 3000)

  // Cleanup on client disconnect
  request.signal.addEventListener('abort', () => {
    clearInterval(interval)
    writer.close()
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
