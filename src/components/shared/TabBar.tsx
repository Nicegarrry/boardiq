'use client'

import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function TabBar({ tabs, activeTab, onTabChange, className }: TabBarProps) {
  return (
    <div className={cn('flex gap-6 border-b border-border-main', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'pb-2 text-[13px] font-medium transition-colors duration-150 -mb-px',
              isActive
                ? 'text-ink border-b-2 border-b-ember'
                : 'text-ink-muted hover:text-ink-secondary'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('ml-1.5', isActive ? 'text-ink-secondary' : 'text-ink-faint')}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
