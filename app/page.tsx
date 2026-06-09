import { Suspense } from 'react'
import { HomeClient } from '@/components/home-client'

export default function Home() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a0f0a' }} />}>
      <HomeClient />
    </Suspense>
  )
}
