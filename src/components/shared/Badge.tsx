import { cn } from '@/lib/utils'

type ActionType = 'decision' | 'discussion' | 'approval' | 'noting' | 'information'

interface BadgeProps {
  type: ActionType
  className?: string
}

const badgeStyles: Record<ActionType, string> = {
  decision: 'font-bold text-ink border-b-2 border-b-ember',
  discussion: 'font-medium text-ink-secondary',
  approval: 'font-medium text-ink-secondary',
  noting: 'font-normal text-ink-muted',
  information: 'font-normal text-ink-muted',
}

const badgeLabels: Record<ActionType, string> = {
  decision: 'DECISION',
  discussion: 'DISCUSSION',
  approval: 'APPROVAL',
  noting: 'NOTING',
  information: 'INFORMATION',
}

export function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block uppercase text-[10px] tracking-[1.5px] leading-none pb-0.5',
        badgeStyles[type],
        className
      )}
    >
      {badgeLabels[type]}
    </span>
  )
}
