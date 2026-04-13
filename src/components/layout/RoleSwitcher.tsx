'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useRole, ALL_USERS, type AppUser } from '@/contexts/RoleContext'

const GROUPED_USERS = {
  Directors: ALL_USERS.filter((u) => u.role === 'director'),
  Executives: ALL_USERS.filter((u) => u.role === 'executive'),
  Secretariat: ALL_USERS.filter((u) => u.role === 'secretariat'),
} as const

export function RoleSwitcher() {
  const { currentUser, setCurrentUser } = useRole()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen])

  function handleSelect(user: AppUser) {
    setCurrentUser(user)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'text-[13px] text-ink-secondary',
          'hover:bg-paper-dark transition-colors duration-150'
        )}
      >
        <span className="font-medium text-ink">{currentUser.name}</span>
        {currentUser.title && (
          <>
            <span className="text-ink-faint">/</span>
            <span className="text-ink-muted">{currentUser.title}</span>
          </>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn('text-ink-muted transition-transform duration-150', isOpen && 'rotate-180')}
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full right-0 mt-1 z-50',
            'bg-surface border border-border-main rounded-lg',
            'w-64 max-h-96 overflow-y-auto py-1'
          )}
        >
          {(Object.entries(GROUPED_USERS) as [string, AppUser[]][]).map(
            ([groupLabel, users]) => (
              <div key={groupLabel}>
                <div className="px-3 pt-3 pb-1">
                  <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-ink-muted">
                    {groupLabel}
                  </span>
                </div>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-[13px]',
                      'hover:bg-paper-dark transition-colors duration-150',
                      user.id === currentUser.id
                        ? 'text-ink font-medium'
                        : 'text-ink-secondary'
                    )}
                  >
                    {user.name}
                    {user.title && (
                      <span className="text-ink-muted ml-1.5 text-[11px]">{user.title}</span>
                    )}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
