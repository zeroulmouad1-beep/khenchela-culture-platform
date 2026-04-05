# Minasa Gold Khenchela - Culture & Arts Platform

## Overview
A Next.js web application for the Culture and Arts sector platform of Khenchela (منصة قطاع الثقافة والفنون - خنشلة). Features Arabic RTL layout, golden color scheme, and modern UI components.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## Project Structure
- `app/` — Next.js app router pages (home, services, institution detail)
- `app/admin/` — Admin dashboard (login, news, services, events CRUD)
- `components/` — Reusable UI components (navbar, hero, bento grid, events slider, footer, etc.)
- `components/admin/` — Admin-specific components (admin-shell with sidebar)
- `components/ui/` — shadcn/ui base components
- `lib/` — Constants, utilities, data
- `lib/firebase.ts` — Firebase config (null-safe, won't crash without env vars)
- `lib/auth-context.tsx` — Auth provider with mock mode (admin/admin) when Firebase not configured
- `lib/firestore-helpers.ts` — Firestore CRUD helpers with mock fallback
- `lib/mock-data.ts` — In-memory mock data for admin preview mode
- `public/images/` — Local image assets
- `hooks/` — Custom React hooks
- `styles/` — Global CSS

## Admin Dashboard (Full CMS)
- **Route**: `/admin` (protected, redirects to `/admin/login` if not authenticated)
- **Mock Mode**: When Firebase env vars are missing (dev only), uses `admin/admin` credentials and in-memory mock data
- **Dashboard**: 8 summary cards + Recharts BarChart & PieChart with live data
- **CMS Sections** (8 sidebar items):
  - الرئيسية (Dashboard) — `/admin`
  - المؤسسات (Institutions) — `/admin/institutions` — Edit all institution fields
  - ملحقات المكتبة (Library Annexes) — `/admin/library-annexes` — Add/edit/delete annexes
  - دار الثقافة (Culture House) — `/admin/culture-house` — Two tabs: workshops + facilities
  - ملف خنشلة (Khenchela Profile) — `/admin/khenchela-profile` — Edit cultural content sections with preview
  - الأخبار (News) — `/admin/news` — Full CRUD + gallery support
  - الخدمات (Services) — `/admin/services` — Full CRUD
  - الفعاليات (Events) — `/admin/events` — Full CRUD + gallery support
- **CMS Context**: `lib/cms-context.tsx` provides in-memory state for institutions, library annexes, workshops, facilities, and Khenchela sections
- **Firebase**: Requires `NEXT_PUBLIC_FIREBASE_*` env vars for production use (Firestore CRUD for news/services/events)
- **Charts**: recharts (BarChart, PieChart) for dashboard statistics

## Running the App
- Dev server: `PORT=5000 pnpm run dev`
- Runs on port 5000 (mapped to external port 80)

## Important Configuration
- `next.config.mjs` includes CORS fix via `allowedDevOrigins` for Replit preview domains — do NOT remove this
- The workflow "Start application" starts the dev server on port 5000
