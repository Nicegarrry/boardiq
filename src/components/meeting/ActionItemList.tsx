import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusLabel } from '@/components/shared/StatusLabel'
import { Card } from '@/components/shared/Card'
import type { ActionItem } from '@/lib/types'

interface ActionItemListProps {
  actionItems: ActionItem[]
}

export function ActionItemList({ actionItems }: ActionItemListProps) {
  if (actionItems.length === 0) return null

  // Show non-complete, non-cancelled items
  const outstanding = actionItems.filter(
    (a) => a.status !== 'complete' && a.status !== 'cancelled'
  )

  if (outstanding.length === 0) return null

  return (
    <div className="mb-6">
      <SectionHeader label="Outstanding Actions" count={outstanding.length} />
      <Card>
        <div className="divide-y divide-border-light">
          {outstanding.map((action) => (
            <div key={action.id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-ink font-medium leading-snug">
                    {action.title}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    {action.assigneeName}
                    <span className="mx-1.5">{'\u00B7'}</span>
                    Due {formatDate(action.dueDate)}
                    <span className="mx-1.5">{'\u00B7'}</span>
                    From {'\u00A7'}{action.sourceItemNumber} ({formatDate(action.sourceMeetingDate)})
                  </p>
                </div>
                <StatusLabel status={action.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
