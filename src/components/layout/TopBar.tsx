'use client'

import { useState } from 'react'
import { RoleSwitcher } from './RoleSwitcher'
import { NotificationPanel } from './NotificationPanel'

export function TopBar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="w-full h-14 bg-surface border-b border-border-main px-6 flex items-center justify-between shrink-0">
      {/* Left: Logo + org name */}
      <div className="flex items-center gap-0">
        <span className="font-display text-[20px] text-ink">Board</span>
        <span className="font-display text-[20px] italic text-ember">IQ</span>
        <span className="text-border-main mx-3 select-none">|</span>
        <span className="text-ink-secondary text-sm">Coastal Health Foundation</span>
      </div>

      {/* Right: Bell + Role switcher */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-ink-muted hover:text-ink transition-colors duration-150"
            aria-label="Notifications"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <NotificationPanel
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>
        <RoleSwitcher />
      </div>
    </header>
  )
}
