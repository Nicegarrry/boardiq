import { Card } from '@/components/shared/Card'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { useDocumentReads, useBriefingNarrative } from '@/hooks/useData'
import type { AgendaItem } from '@/lib/types'

interface DetailEmptyStateProps {
  meetingId: string
  userId: string
  agendaItems: AgendaItem[]
  daysUntil: number
  mode: 'prep' | 'day'
}

export function DetailEmptyState({
  meetingId,
  userId,
  agendaItems,
  daysUntil,
  mode,
}: DetailEmptyStateProps) {
  const reads = useDocumentReads(meetingId, userId)
  const narrative = useBriefingNarrative(meetingId, userId, mode)

  let totalDocs = 0
  for (const item of agendaItems) {
    totalDocs += item.documents.length
  }
  const docsRead = reads.filter((r) => r.markedAsRead).length
  const percentage = totalDocs > 0 ? Math.round((docsRead / totalDocs) * 100) : 0

  return (
    <div className="h-full flex flex-col px-5 py-6">
      <p className="text-[10px] uppercase tracking-[1.5px] font-bold text-ink-muted mb-4">
        Meeting Overview
      </p>

      {/* Prep progress */}
      {mode === 'prep' && (
        <Card className="flex items-center gap-4 mb-4">
          <ProgressRing value={percentage} size={48} strokeWidth={4} showLabel />
          <div className="flex-1">
            <p className="text-[13px] text-ink font-medium">
              {docsRead} of {totalDocs} documents read
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              {daysUntil > 0
                ? `${daysUntil} day${daysUntil === 1 ? '' : 's'} until meeting`
                : daysUntil === 0
                  ? 'Meeting is today'
                  : 'Meeting has passed'}
            </p>
          </div>
        </Card>
      )}

      {/* Briefing narrative */}
      {narrative && (
        <div className="border-t-2 border-t-ember bg-surface border border-border-main rounded-lg p-4 mb-4">
          <h3 className="font-display text-[16px] text-ink mb-2">
            {mode === 'prep' ? 'Your Preparation Briefing' : 'Your Day at a Glance'}
          </h3>
          <p className="text-[13px] leading-[1.65] text-ink-secondary">
            {narrative}
          </p>
        </div>
      )}

      {/* Hint */}
      <div className="flex-1 flex items-end pb-4">
        <p className="text-xs text-ink-faint">
          Select an agenda item to view details, documents, and IQ analysis.
        </p>
      </div>
    </div>
  )
}
