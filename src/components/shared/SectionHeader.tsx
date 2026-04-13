import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label: string
  count?: number
  className?: string
}

export function SectionHeader({ label, count, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'text-[12px] uppercase font-bold tracking-[1px] text-ink-muted',
        'border-b border-border-light pb-2 mb-3',
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span className="font-normal text-ink-faint"> ({count})</span>
      )}
    </div>
  )
}
