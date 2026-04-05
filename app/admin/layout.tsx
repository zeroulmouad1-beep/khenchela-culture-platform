'use client'

import { AuthProvider } from '@/lib/auth-context'
import { CmsProvider } from '@/lib/cms-context'
import { ToastProvider } from '@/components/admin/toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CmsProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CmsProvider>
    </AuthProvider>
  )
}
