'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 max-w-sm" dir="rtl">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : AlertCircle
  const colors = {
    success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', icon: '#22C55E' },
    error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: '#EF4444' },
    info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: '#3B82F6' },
  }
  const c = colors[toast.type]

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-bottom-2 duration-300"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, fontFamily: 'Tajawal, sans-serif', backdropFilter: 'blur(12px)' }}
    >
      <Icon size={16} style={{ color: c.icon }} className="flex-shrink-0" />
      <span style={{ color: '#E2E8F0' }} className="flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="flex-shrink-0" style={{ color: '#64748B' }}>
        <X size={14} />
      </button>
    </div>
  )
}
