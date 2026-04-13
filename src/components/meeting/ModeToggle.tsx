'use client'

import { cn } from '@/lib/utils'

interface ModeToggleProps {
  mode: 'prep' | 'day'
  onModeChange: (mode: 'prep' | 'day') => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 mb-4">
      <button
        onClick={() => onModeChange('prep')}
        className={cn(
          'px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150',
          mode === 'prep'
            ? 'bg-surface border border-border-main text-ink font-medium'
            : 'text-ink-muted hover:text-ink-secondary'
        )}
      >
        Prep Mode
      </button>
      <button
        onClick={() => onModeChange('day')}
        className={cn(
          'px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150',
          mode === 'day'
            ? 'bg-surface border border-border-main text-ink font-medium'
            : 'text-ink-muted hover:text-ink-secondary'
        )}
      >
        Meeting Day
      </button>
    </div>
  )
}
