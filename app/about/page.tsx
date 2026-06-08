'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Users, Calendar, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const screens = [
  {
    icon: Globe,
    title: 'البوابة الرقمية الرسمية',
    description:
      'منصة قطاع الثقافة والفنون بخنشلة هي البوابة الرقمية الرسمية لمديرية الثقافة والفنون بولاية خنشلة',
    gradient: 'from-[#B87333]/20 to-[#C5A059]/10',
    accent: '#B87333',
  },
  {
    icon: Users,
    title: 'تعزيز التواصل',
    description:
      'تهدف المنصة إلى تعزيز التواصل بين المؤسسات الثقافية والمواطنين وتقديم خدمات إلكترونية متكاملة',
    gradient: 'from-[#C5A059]/20 to-[#B87333]/10',
    accent: '#C5A059',
  },
  {
    icon: Calendar,
    title: 'نشر الفعاليات',
    description:
      'تشمل الأنشطة الثقافية والفنية والحفاظ على التراث المادي واللامادي لمنطقة الأوراس',
    gradient: 'from-[#B87333]/20 to-[#D4956A]/10',
    accent: '#D4956A',
  },
  {
    icon: BookOpen,
    title: 'مرجع رقمي شامل',
    description:
      'تسعى المنصة لتكون مرجعاً رقمياً شاملاً يخدم الفاعلين الثقافيين والباحثين والمهتمين بالشأن الثقافي في ولاية خنشلة',
    gradient: 'from-[#C5A059]/20 to-[#B87333]/10',
    accent: '#B87333',
  },
]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
  }),
}

export default function AboutPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const go = (next: number) => {
    if (next < 0 || next >= screens.length) return
    setDirection(next > current ? 1 : -1)
    setCurrent(next)
  }

  const screen = screens[current]
  const Icon = screen.icon

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0F172A', fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]">
        <Link
          href="/?enter=true"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#94A3B8' }}
        >
          <ChevronLeft size={16} />
          <span>العودة للرئيسية</span>
        </Link>
        <div className="flex items-center gap-2">
          <img
            src="/images/logo-culture.jpg"
            alt="شعار المنصة"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-bold" style={{ color: '#C5A059' }}>
            منصة خنشلة
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Decorative top label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-widest mb-10 uppercase"
          style={{ color: '#B87333', fontFamily: "'Cairo', sans-serif", letterSpacing: '0.2em' }}
        >
          من نحن
        </motion.p>

        {/* Card area */}
        <div className="relative w-full max-w-lg" style={{ minHeight: 360 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`absolute inset-0 rounded-3xl border bg-gradient-to-br ${screen.gradient} flex flex-col items-center justify-center px-8 py-12 text-center`}
              style={{ borderColor: `${screen.accent}30`, backgroundColor: '#111827' }}
            >
              {/* Glow ring behind icon */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative"
                style={{ backgroundColor: `${screen.accent}15` }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ backgroundColor: `${screen.accent}08` }}
                />
                <Icon size={40} style={{ color: screen.accent }} />
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold mb-5 leading-snug"
                style={{ color: '#F1F5F9', fontFamily: "'Amiri', serif" }}
              >
                {screen.title}
              </h2>

              <div
                className="w-12 h-0.5 mx-auto mb-6 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${screen.accent}, transparent)` }}
              />

              <p
                className="text-base leading-loose max-w-sm"
                style={{ color: '#94A3B8', fontFamily: "'Cairo', sans-serif" }}
              >
                {screen.description}
              </p>

              {/* Screen number */}
              <p
                className="absolute top-5 left-6 text-xs tabular-nums"
                style={{ color: `${screen.accent}60` }}
              >
                {current + 1} / {screens.length}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: current === 0 ? '#1E293B' : '#B87333',
              color: current === 0 ? '#334155' : '#B87333',
              backgroundColor: 'transparent',
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex gap-2.5">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  backgroundColor: i === current ? '#B87333' : '#334155',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + 1)}
            disabled={current === screens.length - 1}
            className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: current === screens.length - 1 ? '#1E293B' : '#B87333',
              color: current === screens.length - 1 ? '#334155' : '#B87333',
              backgroundColor: 'transparent',
            }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* CTA on last screen */}
        <AnimatePresence>
          {current === screens.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              <Link
                href="/?enter=true"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#B87333',
                  color: '#0F172A',
                  fontFamily: "'Cairo', sans-serif",
                  boxShadow: '0 0 20px #B8733340',
                }}
              >
                اكتشف المنصة
                <ChevronLeft size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Credit footnote */}
      <div className="pb-8 text-center">
        <div
          className="w-20 h-px mx-auto mb-4 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #B8733340, transparent)' }}
        />
        <p
          className="text-xs"
          style={{ color: '#B87333', fontFamily: "'Cairo', sans-serif", opacity: 0.65 }}
        >
          تم تطوير وصيانة هذه المنصة بواسطة المهندس زروال معاذ عبد الودود
        </p>
      </div>
    </div>
  )
}
