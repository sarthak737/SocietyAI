'use client'

import { useEffect, useState } from 'react'

export function FormattedDate({ date }: { date: string | Date }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Or a skeleton/placeholder that matches server
  }

  return <span>{new Date(date).toLocaleDateString()}</span>
}
