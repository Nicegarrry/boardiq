import { cn } from '@/lib/utils'

type IQSeverity = 'alert' | 'watch' | 'ready' | 'good'

interface IQBadgeProps {
  severity: IQSeverity
  headline: string
  className?: string
}

const severityStyles: Record<IQSeverity, string> = {
  alert: 'pl-3 border-l-2 border-l-ink font-bold',
  watch: 'pl-3 border-l-2 border-l-ink-muted font-medium',
  ready: 'pl-3 border-l-2 border-l-ember font-normal',
  good: 'text-ink-muted font-normal',
}

export function IQBadge({ severity, headline, className }: IQBadgeProps) {
  return (
    <div className={cn('text-[13px] leading-snug', severityStyles[severity], className)}>
      <span className="text-ember font-medium">IQ</span>
      <span className="text-ink-muted">{' \u2014 '}</span>
      <span className={severity === 'good' ? 'text-ink-muted' : 'text-ink-secondary'}>
        {headline}
      </span>
    </div>
  )
}
