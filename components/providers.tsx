'use client'

import { ReactNode } from 'react'
import { CmsProvider } from '@/lib/cms-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CmsProvider>
      {children}
    </CmsProvider>
  )
}
