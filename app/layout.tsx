import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { HeritageBackground } from '@/components/heritage-background'
import './globals.css'

export const metadata: Metadata = {
  title: 'منصة قطاع الثقافة والفنون خنشلة - البوابة الرقمية الرسمية',
  description: 'البوابة الرقمية الرسمية لمديرية الثقافة والفنون لولاية خنشلة، لتعزيز التواصل ونشر الأنشطة الثقافية والفنية في الولاية.',
  verification: {
    google: 'HgpfhgfAtApQFiAtvhksbARfNxCCzkP6PwrricVK-YA',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a0f0a',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="Zerroual Mouadh" />
        <meta name="creator" content="Zerroual Mouadh" />
        <meta name="designer" content="Zerroual Mouadh" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "مديرية الثقافة والفنون - خنشلة",
              "alternateName": "Khenchela Culture",
              "url": "https://2p8oc.riker.replit.dev",
              "description": "Official portal for the Culture and Arts sector - Khenchela Province, Algeria",
              "creator": {
                "@type": "Person",
                "name": "Zerroual Mouadh",
                "jobTitle": "Web Developer"
              },
              "founder": {
                "@type": "Person",
                "name": "Zerroual Mouadh"
              },
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Khenchela, Algeria"
              },
              "inLanguage": "ar"
            })
          }}
        />
      </head>
      <body className="antialiased">
        <HeritageBackground />
        <div style={{ position: 'relative', isolation: 'isolate', backgroundColor: '#1a0f0a' }}>
          <Providers>
            {children}
          </Providers>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
