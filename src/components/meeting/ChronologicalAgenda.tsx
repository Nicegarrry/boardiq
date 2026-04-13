import { Badge } from '@/components/shared/Badge'
import { SectionHeader } from '@/components/shared/SectionHeader'
import type { AgendaItem } from '@/lib/types'

interface ChronologicalAgendaProps {
  items: AgendaItem[]
}

export function ChronologicalAgenda({ items }: ChronologicalAgendaProps) {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="mt-8">
      <SectionHeader label="Full Agenda \u2014 Chronological" count={sorted.length} />
      <div>
        {sorted.map((item) => {
          const time = new Date(item.scheduledStart).toLocaleTimeString('en-AU', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b border-border-light"
            >
              <span className="text-xs text-ink-muted font-mono w-16 shrink-0">
                {time}
              </span>
              <span className="text-[11px] font-mono text-ink-faint w-8 shrink-0">
                {'\u00A7'}{item.itemNumber}
              </span>
              <span className="text-[13px] text-ink flex-1 truncate">
                {item.title}
              </span>
              <Badge type={item.actionType} />
              <span className="text-xs text-ink-muted w-12 text-right shrink-0">
                {item.durationMinutes}m
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
