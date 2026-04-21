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
- `app/` — Next.js app router pages (home, services, institution detail, event detail)
- `app/events/[id]/` — Dynamic public event detail page (description, location, date, capacity, gallery)
- `app/admin/` — Admin dashboard (login, news, services, events CRUD)
- `components/` — Reusable UI components (navbar, hero, bento grid, events slider, footer, etc.)
- `components/admin/` — Admin-specific components (admin-shell with sidebar)
- `components/ui/` — shadcn/ui base components
- `lib/` — Constants, utilities, data
- `lib/firebase.ts` — Firebase config (null-safe, won't crash without env vars)
- `lib/auth-context.tsx` — Auth provider with server-side credential validation via API routes
- `app/api/auth/` — Server-side auth API routes (login, logout, session) validating against ADMIN_EMAIL/ADMIN_PASSWORD env vars
- `lib/firestore-helpers.ts` — Firestore CRUD helpers; reads use client SDK, writes proxy through `/api/cms/*`
- `lib/firebase-admin.ts` — Firebase Admin SDK init (uses FIREBASE_SERVICE_ACCOUNT secret); used by server API for all Firestore writes
- `lib/admin-auth.ts` — Server-side helper that verifies the admin session cookie for API routes
- `app/api/cms/[collection]/` — Authenticated server-side write endpoints (POST add, PUT update, DELETE) with allowlist
- `firestore.rules` — Production security rules: public READ on listed collections, ALL client writes denied. Deployed via Admin SDK.
- `lib/mock-data.ts` — In-memory mock data for admin preview mode
- `public/images/` — Local image assets
- `hooks/` — Custom React hooks
- `styles/` — Global CSS

## Admin Dashboard (Full CMS)
- **Route**: `/admin` (protected, redirects to `/admin/login` if not authenticated)
- **Authentication**: Server-side credential validation via API routes (`/api/auth/login`, `/api/auth/logout`, `/api/auth/session`). Credentials stored in env vars (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`). Uses httpOnly signed session cookies.
- **Dashboard**: 8 summary cards + Recharts BarChart & PieChart with live data
- **CMS Sections** (8 sidebar items):
  - الرئيسية (Dashboard) — `/admin`
  - المؤسسات (Institutions) — `/admin/institutions` — Edit all institution fields (title, subtitle, description, fullDescription, address, phone, email, workingHours, image, gallery)
  - ملحقات المكتبة (Library Annexes) — `/admin/library-annexes` — Add/edit/delete annexes
  - دار الثقافة (Culture House) — `/admin/culture-house` — Two tabs: workshops + facilities
  - ملف خنشلة (Khenchela Profile) — `/admin/khenchela-profile` — Edit cultural content sections with preview
  - الأخبار (News) — `/admin/news` — Full CRUD + gallery support
  - الخدمات (Services) — `/admin/services` — Full CRUD
  - الفعاليات (Events) — `/admin/events` — Full CRUD + gallery, category, status (active/canceled/finished), featured toggle
- **CMS Context**: `lib/cms-context.tsx` provides live Firestore-backed state for institutions, library annexes, workshops, facilities, and Khenchela sections. Uses `_seedId` mapping to preserve routing IDs (museum, cinema, library, culture-house, theater) when Firestore auto-generates document IDs. Merges Firestore data with defaults so no institution is lost. Also seeds events and news collections from mock data on first load when empty.
- **Firebase**: Connected to live Firestore (project: khanchala-culture-platform). All 7 `NEXT_PUBLIC_FIREBASE_*` env vars are set.
- **Firestore Collections**: `institutions`, `libraryAnnexes`, `workshops`, `facilities`, `khenchelaSections`, `events`, `news` — all seeded from mock data on first load. Dashboard stats query `facilities` (not `services`), `events`, and `news` for total counts.
- **Public Pages**: All wired to CMS/Firestore — `events-slider.tsx` fetches from `events` collection, `bento-grid.tsx` and `institution-detail.tsx` use `useCms()` for institutions, `about-khenchela/page.tsx` uses `useCms().khenchelaSections`.
- **Charts**: recharts (BarChart, PieChart) for dashboard statistics

## Running the App
- Dev server: `PORT=5000 pnpm run dev`
- Runs on port 5000 (mapped to external port 80)

## Important Configuration
- `next.config.mjs` includes CORS fix via `allowedDevOrigins` for Replit preview domains — do NOT remove this
- The workflow "Start application" starts the dev server on port 5000
