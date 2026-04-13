'use client'

import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function SlideOver({ isOpen, onClose, title, children }: SlideOverProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/[0.12] z-40 transition-opacity duration-150',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[540px] bg-surface z-50',
          'border-l border-border-main',
          'transition-transform duration-150',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ boxShadow: isOpen ? '-4px 0 12px rgba(0,0,0,0.05)' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-main">
          {title && <h2 className="font-display text-[20px] text-ink">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-ink-muted hover:text-ink transition-colors duration-150 p-1"
            aria-label="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-57px)] px-5 py-4">
          {children}
        </div>
      </div>
    </>
  )
}
