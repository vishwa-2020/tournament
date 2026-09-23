'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!isAdminAuthenticated()) {
    return null
  }

  return <>{children}</>
}
