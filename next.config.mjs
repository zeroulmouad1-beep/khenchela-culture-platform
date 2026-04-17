/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.janeway.replit.dev',
    '*.spock.replit.dev',
    '*.kirby.replit.dev',
    '*.picard.replit.dev',
    '*.repl.co',
    '*.picard.repl.co',
    '*.janeway.repl.co',
    '*.spock.repl.co',
    '*.kirby.repl.co',
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN.replace('.replit.dev', '.repl.co')] : []),
  ],
}

export default nextConfig
