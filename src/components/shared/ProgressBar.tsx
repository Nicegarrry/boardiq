import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      className={cn('h-1 w-full rounded-full bg-paper-dark', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-ember"
        style={{
          width: `${clamped}%`,
          transition: 'width 150ms ease',
        }}
      />
    </div>
  )
}
