import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  variant?: 'default' | 'briefing'
  className?: string
  children: ReactNode
  onClick?: () => void
}

export function Card({ variant = 'default', className, children, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border-main rounded-lg p-4 px-5',
        'transition-colors duration-150',
        variant === 'briefing' && 'border-t-2 border-t-ember',
        onClick && 'cursor-pointer hover:border-ink-faint',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
