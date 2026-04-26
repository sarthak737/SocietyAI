import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export interface Complaint {
  id: number
  flat_number: string
  resident_name: string
  phone: string | null
  complaint_text: string
  audio_url: string | null
  category: string | null
  urgency: string | null
  summary: string | null
  suggested_action: string | null
  status: string
  created_at: Date
  updated_at: Date
}

export async function createComplaint(data: {
  flat_number: string
  resident_name: string
  phone?: string
  complaint_text: string
  audio_url?: string
}) {
  const result = await prisma.complaint.create({
    data: {
      flat_number: data.flat_number,
      resident_name: data.resident_name,
      phone: data.phone || null,
      complaint_text: data.complaint_text,
      audio_url: data.audio_url || null,
    },
  })
  return result.id
}

export async function updateComplaintWithAI(id: number, data: {
  category: string
  urgency: string
  summary: string
  suggested_action: string
}) {
  await prisma.complaint.update({
    where: { id },
    data: {
      category: data.category,
      urgency: data.urgency,
      summary: data.summary,
      suggested_action: data.suggested_action,
    },
  })
}

export async function getComplaints(filters?: { status?: string; category?: string }) {
  return await prisma.complaint.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.category ? { category: filters.category } : {}),
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

export async function getComplaintById(id: number) {
  return await prisma.complaint.findUnique({
    where: { id },
  })
}

export async function updateComplaintStatus(id: number, status: string) {
  await prisma.complaint.update({
    where: { id },
    data: { status },
  })
}

export async function getComplaintStats() {
  const [total, open, inProgress, closed] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({ where: { status: 'open' } }),
    prisma.complaint.count({ where: { status: 'in_progress' } }),
    prisma.complaint.count({ where: { status: 'closed' } }),
  ])

  return { total, open, inProgress, closed }
}