'use client'

import { Card } from '@/components/shared/Card'
import { useBriefingNarrative } from '@/hooks/useData'

interface BriefingCardProps {
  meetingId: string
  userId: string
  mode: 'prep' | 'day'
}

export function BriefingCard({ meetingId, userId, mode }: BriefingCardProps) {
  const narrative = useBriefingNarrative(meetingId, userId, mode)

  if (!narrative) return null

  return (
    <Card variant="briefing" className="mb-2.5">
      <h2 className="font-display text-[20px] text-ink mb-3">
        {mode === 'prep' ? 'Your Preparation Briefing' : 'Your Day at a Glance'}
      </h2>
      <p className="text-[13px] leading-[1.65] text-ink-secondary">
        {narrative}
      </p>
    </Card>
  )
}
