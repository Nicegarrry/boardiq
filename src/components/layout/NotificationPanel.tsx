'use client'

import { cn } from '@/lib/utils'

interface Notification {
  id: string
  message: string
  timestamp: string
  unread: boolean
}

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: 'Board pack for June meeting updated with revised financials',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    message: 'Dr. Susan Cho submitted questions on the capital works paper',
    timestamp: '5 hours ago',
    unread: true,
  },
  {
    id: '3',
    message: 'Clinical Governance Committee minutes now available',
    timestamp: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    message: 'Reminder: Board papers due for review by Friday',
    timestamp: '2 days ago',
    unread: false,
  },
]

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Invisible backdrop to close on click outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      <div
        className={cn(
          'absolute top-full right-0 mt-1 z-50',
          'bg-surface border border-border-main rounded-lg',
          'w-80 max-h-80 overflow-y-auto'
        )}
      >
        <div className="px-4 py-3 border-b border-border-light">
          <span className="text-[12px] uppercase font-bold tracking-[1px] text-ink-muted">
            Notifications
          </span>
        </div>
        <div className="divide-y divide-border-light">
          {PLACEHOLDER_NOTIFICATIONS.map((notification) => (
            <div key={notification.id} className="px-4 py-3">
              <p
                className={cn(
                  'text-[13px] leading-snug',
                  notification.unread ? 'font-semibold text-ink' : 'text-ink-secondary'
                )}
              >
                {notification.message}
              </p>
              <p className="text-[11px] text-ink-muted mt-1">{notification.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
