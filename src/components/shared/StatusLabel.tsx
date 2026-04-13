import { cn } from '@/lib/utils'

interface StatusLabelProps {
  status: string
  label?: string
  className?: string
}

function getStatusStyle(status: string): { className: string; prefix: string; defaultLabel: string } {
  switch (status) {
    case 'overdue':
      return {
        className: 'font-semibold text-ink',
        prefix: '',
        defaultLabel: 'Overdue',
      }
    case 'in_progress':
      return {
        className: 'font-medium text-ink-secondary',
        prefix: '',
        defaultLabel: 'In Progress',
      }
    case 'in_review':
      return {
        className: 'font-medium text-ink-secondary',
        prefix: '',
        defaultLabel: 'In Review',
      }
    case 'complete':
      return {
        className: 'text-ink-muted',
        prefix: '\u2713 ',
        defaultLabel: 'Complete',
      }
    case 'not_started':
      return {
        className: 'text-ink-faint',
        prefix: '',
        defaultLabel: 'Not Started',
      }
    case 'draft':
      return {
        className: 'text-ink-secondary',
        prefix: '',
        defaultLabel: 'Draft',
      }
    default:
      return {
        className: 'text-ink-muted',
        prefix: '',
        defaultLabel: status,
      }
  }
}

export function StatusLabel({ status, label, className }: StatusLabelProps) {
  const style = getStatusStyle(status)

  return (
    <span className={cn('text-[12px]', style.className, className)}>
      {style.prefix}
      {label ?? style.defaultLabel}
      {status === 'overdue' && (
        <span className="ml-1.5 text-[10px] uppercase tracking-[1.5px] font-bold">
          OVERDUE
        </span>
      )}
    </span>
  )
}
