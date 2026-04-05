'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard, Newspaper, Settings, Calendar,
  LogOut, Menu, X, ChevronLeft,
  Building2, BookMarked, Home, Mountain
} from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

const sidebarItems = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/admin/institutions', label: 'المؤسسات', icon: Building2 },
  { href: '/admin/library-annexes', label: 'ملحقات المكتبة', icon: BookMarked },
  { href: '/admin/culture-house', label: 'دار الثقافة', icon: Home },
  { href: '/admin/khenchela-profile', label: 'ملف خنشلة', icon: Mountain },
  { href: '/admin/news', label: 'الأخبار', icon: Newspaper },
  { href: '/admin/services', label: 'الخدمات', icon: Settings },
  { href: '/admin/events', label: 'الفعاليات', icon: Calendar },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const currentPage = sidebarItems.find(item => isActive(item.href))

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: INDIGO_DEEP }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 right-0 h-screen z-50 w-64 flex flex-col border-l transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
        style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: INDIGO_LIGHT }}>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COPPER }}>
              خ
            </div>
            <span className="font-bold text-white text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة الإدارة</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? `${COPPER}20` : 'transparent',
                  color: active ? COPPER_LIGHT : '#94A3B8',
                  fontFamily: 'Tajawal, sans-serif',
                  borderRight: active ? `3px solid ${COPPER}` : '3px solid transparent',
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: INDIGO_LIGHT }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all duration-200 cursor-pointer"
            style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FCA5A5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 border-b flex items-center justify-between px-4" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white">
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {currentPage?.label || 'لوحة الإدارة'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
              {user?.email || 'مدير'}
            </span>
            <Link href="/?enter=true" className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
              <ChevronLeft size={14} />
              الموقع
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
