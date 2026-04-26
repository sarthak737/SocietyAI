import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'society.db')
const db = new Database(dbPath)

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flat_number TEXT NOT NULL,
    resident_name TEXT NOT NULL,
    phone TEXT,
    complaint_text TEXT NOT NULL,
    audio_url TEXT,
    category TEXT,
    urgency TEXT,
    summary TEXT,
    suggested_action TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export interface Complaint {
  id: number
  flat_number: string
  resident_name: string
  phone: string
  complaint_text: string
  audio_url: string | null
  category: string | null
  urgency: string | null
  summary: string | null
  suggested_action: string | null
  status: string
  created_at: string
  updated_at: string
}

export function createComplaint(data: {
  flat_number: string
  resident_name: string
  phone?: string
  complaint_text: string
  audio_url?: string
}) {
  const stmt = db.prepare(`
    INSERT INTO complaints (flat_number, resident_name, phone, complaint_text, audio_url)
    VALUES (?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    data.flat_number,
    data.resident_name,
    data.phone || null,
    data.complaint_text,
    data.audio_url || null
  )
  return result.lastInsertRowid
}

export function updateComplaintWithAI(id: number, data: {
  category: string
  urgency: string
  summary: string
  suggested_action: string
}) {
  const stmt = db.prepare(`
    UPDATE complaints
    SET category = ?, urgency = ?, summary = ?, suggested_action = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(data.category, data.urgency, data.summary, data.suggested_action, id)
}

export function getComplaints(filters?: { status?: string; category?: string }) {
  let query = 'SELECT * FROM complaints'
  const params: string[] = []

  if (filters?.status || filters?.category) {
    const conditions: string[] = []
    if (filters.status) {
      conditions.push('status = ?')
      params.push(filters.status)
    }
    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY created_at DESC'

  const stmt = db.prepare(query)
  return stmt.all(...params) as Complaint[]
}

export function getComplaintById(id: number) {
  const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?')
  return stmt.get(id) as Complaint | undefined
}

export function updateComplaintStatus(id: number, status: string) {
  const stmt = db.prepare('UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
  stmt.run(status, id)
}

export function getComplaintStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM complaints').get() as { count: number }
  const open = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'open'").get() as { count: number }
  const inProgress = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'in-progress'").get() as { count: number }
  const closed = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'closed'").get() as { count: number }

  return {
    total: total.count,
    open: open.count,
    inProgress: inProgress.count,
    closed: closed.count
  }
}

export default db