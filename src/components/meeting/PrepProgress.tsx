'use client'

import { Card } from '@/components/shared/Card'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useDocumentReads } from '@/hooks/useData'
import type { AgendaItem } from '@/lib/types'

interface PrepProgressProps {
  meetingId: string
  userId: string
  agendaItems: AgendaItem[]
  daysUntil: number
}

export function PrepProgress({ meetingId, userId, agendaItems, daysUntil }: PrepProgressProps) {
  const reads = useDocumentReads(meetingId, userId)

  // Count total documents across all agenda items
  let totalDocs = 0
  for (const item of agendaItems) {
    totalDocs += item.documents.length
  }

  const docsRead = reads.filter((r) => r.markedAsRead).length
  const percentage = totalDocs > 0 ? Math.round((docsRead / totalDocs) * 100) : 0

  // Count items with voting that user needs to review
  const voteItems = agendaItems.filter((item) => item.votingEnabled).length

  const urgencyLabel =
    daysUntil > 0
      ? `${daysUntil} day${daysUntil === 1 ? '' : 's'} until meeting`
      : daysUntil === 0
        ? 'Meeting is today'
        : 'Meeting has passed'

  return (
    <Card className="mb-2.5">
      <div className="flex items-center gap-4 mb-3">
        <ProgressRing value={percentage} size={48} strokeWidth={4} showLabel />
        <div className="flex-1">
          <p className="text-[13px] text-ink font-medium">
            {docsRead} of {totalDocs} documents read
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            {urgencyLabel}
            {voteItems > 0 && (
              <span className="ml-2 text-ink-secondary font-medium">
                {voteItems} vote{voteItems === 1 ? '' : 's'} pending
              </span>
            )}
          </p>
        </div>
      </div>
      <ProgressBar value={percentage} className="h-1.5" />
    </Card>
  )
}
