'use client'

import { AuthProvider } from '@/lib/auth-context'
import { ToastProvider } from '@/components/admin/toast'
import { AdminAccessGate } from '@/components/admin/access-gate'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminAccessGate>
          {children}
        </AdminAccessGate>
      </ToastProvider>
    </AuthProvider>
  )
}
