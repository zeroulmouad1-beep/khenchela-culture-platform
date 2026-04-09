import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
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
  themeColor: '#800020',
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
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
