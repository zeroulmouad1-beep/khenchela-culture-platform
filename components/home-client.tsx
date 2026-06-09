'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'
import { EventsSlider } from '@/components/events-slider'
import { DirectorateSection } from '@/components/directorate-section'
import { BentoGrid } from '@/components/bento-grid'
import { SmartServices } from '@/components/smart-services'
import { ModernFooter } from '@/components/modern-footer'

// ssr:false works correctly here because HomeClient is used inside a Server Component (page.tsx)
const ImmersiveHero = dynamic(
  () => import('@/components/immersive-hero').then(m => ({ default: m.ImmersiveHero })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a0f0a' }} />
    ),
  }
)

export function HomeClient() {
  const searchParams = useSearchParams()
  const [showPlatform, setShowPlatform] = useState(searchParams.get('enter') === 'true')

  if (!showPlatform) {
    return <ImmersiveHero onEnter={() => setShowPlatform(true)} />
  }

  return (
    <div className="w-full" style={{ backgroundColor: '#1a0f0a' }}>
      <Navbar />
      {/* 1. Upcoming Events - Top after hero */}
      <EventsSlider />
      {/* 2. Directorate Section */}
      <DirectorateSection />
      {/* 3. Cultural Institutions - with real images */}
      <BentoGrid />
      {/* 4. Electronic Services - Navigation to portal */}
      <SmartServices />
      <ModernFooter />
    </div>
  )
}
