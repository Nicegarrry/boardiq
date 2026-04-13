'use client'

import { useState, useMemo } from 'react'
import { useMeeting, useAgendaItems, useActionItems } from '@/hooks/useData'
import { useRole } from '@/hooks/useRole'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { MeetingHeader } from './MeetingHeader'
import { ModeToggle } from './ModeToggle'
import { PrepProgress } from './PrepProgress'
import { BriefingCard } from './BriefingCard'
import { ActionItemList } from './ActionItemList'
import { AgendaCard } from './AgendaCard'
import { ChronologicalAgenda } from './ChronologicalAgenda'
import { DetailSlideOver } from './DetailSlideOver'
import type { AgendaItem } from '@/lib/types'

const MEETING_ID = 'mtg_apr_2026'
const ORG_ID = 'org_coastal_health'

// Mapping from RoleContext user IDs (dir-1, dir-2...) to mock data user IDs
const USER_ID_MAP: Record<string, string> = {
  'dir-1': 'user_patricia_moreau',
  'dir-2': 'user_david_kim',
  'dir-3': 'user_james_achebe',
  'dir-4': 'user_susan_cho',
  'dir-5': 'user_robert_menzies',
  'dir-6': 'user_helen_papadopoulos',
  'exec-1': 'user_sarah_brennan',
  'exec-2': 'user_michael_torres',
  'exec-3': 'user_anika_patel',
  'exec-4': 'user_lisa_chang',
  'sec-1': 'user_jenny_walsh',
}

interface GroupedSection {
  key: string
  label: string
  items: AgendaItem[]
}

function groupAgendaItems(items: AgendaItem[], userId: string): GroupedSection[] {
  const sections: GroupedSection[] = []
  const used = new Set<string>()

  // 1. "Your Key Actions" - items where user is presenter or voter
  const keyActions = items.filter(
    (item) =>
      item.presenters.some((p) => p.userId === userId) ||
      (item.votingEnabled && item.actionType === 'decision')
  )
  if (keyActions.length > 0) {
    sections.push({ key: 'key-actions', label: 'Your Key Actions', items: keyActions })
    keyActions.forEach((item) => used.add(item.id))
  }

  // Phase-based grouping for remaining items
  const phaseGroups: { key: string; label: string; matcher: (phase: string) => boolean }[] = [
    {
      key: 'strategy-program',
      label: 'Strategic & Programmatic',
      matcher: (p) => /strategy|program/i.test(p),
    },
    {
      key: 'finance-risk',
      label: 'Finance & Risk',
      matcher: (p) => /finance|risk/i.test(p),
    },
    {
      key: 'governance',
      label: 'Governance',
      matcher: (p) => /governance/i.test(p),
    },
    {
      key: 'reports',
      label: 'Reports & Updates',
      matcher: (p) => /ceo|report|development|people/i.test(p),
    },
    {
      key: 'opening-closing',
      label: 'Opening & Closing',
      matcher: (p) => /opening|close/i.test(p),
    },
  ]

  for (const group of phaseGroups) {
    const groupItems = items.filter(
      (item) => !used.has(item.id) && group.matcher(item.phase)
    )
    if (groupItems.length > 0) {
      sections.push({ key: group.key, label: group.label, items: groupItems })
      groupItems.forEach((item) => used.add(item.id))
    }
  }

  // Catch-all for remaining items
  const remaining = items.filter((item) => !used.has(item.id))
  if (remaining.length > 0) {
    sections.push({ key: 'other', label: 'Other Items', items: remaining })
  }

  return sections
}

export function MeetingBriefing() {
  const { currentUser } = useRole()
  const mockUserId = USER_ID_MAP[currentUser.id] || currentUser.id
  const meeting = useMeeting(MEETING_ID)
  const agendaItems = useAgendaItems(MEETING_ID, mockUserId)
  const actionItems = useActionItems(ORG_ID)

  const [mode, setMode] = useState<'prep' | 'day'>('prep')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<AgendaItem | null>(null)

  const sections = useMemo(
    () => groupAgendaItems(agendaItems, mockUserId),
    [agendaItems, mockUserId]
  )

  function handleToggle(itemId: string) {
    setExpandedId((prev) => (prev === itemId ? null : itemId))
  }

  return (
    <div className="bg-paper px-6 pt-9 pb-16 min-h-screen">
      <div className="content-width">
        <MeetingHeader
          meeting={meeting}
          itemCount={agendaItems.length}
          committeeName="Full Board"
        />

        <ModeToggle mode={mode} onModeChange={setMode} />

        {mode === 'prep' && (
          <PrepProgress
            meetingId={MEETING_ID}
            userId={mockUserId}
            agendaItems={agendaItems}
            daysUntil={meeting.daysUntil}
          />
        )}

        <BriefingCard
          meetingId={MEETING_ID}
          userId={mockUserId}
          mode={mode}
        />

        <ActionItemList actionItems={actionItems} />

        {/* Grouped agenda sections */}
        {mode === 'prep' ? (
          <div className="mt-6">
            {sections.map((section) => (
              <div key={section.key} className="mb-6">
                <SectionHeader label={section.label} count={section.items.length} />
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <AgendaCard
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      onToggle={() => handleToggle(item.id)}
                      onOpenDetail={setDetailItem}
                      mode={mode}
                      userId={mockUserId}
                      meetingId={MEETING_ID}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            {/* Day mode: show grouped view first, then chronological at bottom */}
            {sections.map((section) => (
              <div key={section.key} className="mb-6">
                <SectionHeader label={section.label} count={section.items.length} />
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <AgendaCard
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      onToggle={() => handleToggle(item.id)}
                      onOpenDetail={setDetailItem}
                      mode={mode}
                      userId={mockUserId}
                      meetingId={MEETING_ID}
                    />
                  ))}
                </div>
              </div>
            ))}
            <ChronologicalAgenda items={agendaItems} />
          </div>
        )}
      </div>

      {/* Detail slide-over */}
      <DetailSlideOver
        item={detailItem}
        isOpen={detailItem !== null}
        onClose={() => setDetailItem(null)}
        mode={mode}
        userId={mockUserId}
        meetingId={MEETING_ID}
      />
    </div>
  )
}
