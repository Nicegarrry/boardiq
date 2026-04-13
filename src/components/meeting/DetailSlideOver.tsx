'use client'

import { useState } from 'react'
import { SlideOver } from '@/components/shared/SlideOver'
import { TabBar } from '@/components/shared/TabBar'
import { Badge } from '@/components/shared/Badge'
import { DocumentRow } from './DocumentRow'
import { IQPanel } from './IQPanel'
import { IQChat } from './IQChat'
import { VoteCard } from './VoteCard'
import { useDocumentReads, useDataOperations } from '@/hooks/useData'
import { useRole } from '@/hooks/useRole'
import type { AgendaItem } from '@/lib/types'

interface DetailSlideOverProps {
  item: AgendaItem | null
  isOpen: boolean
  onClose: () => void
  mode: 'prep' | 'day'
  userId: string
  meetingId: string
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents' },
  { id: 'iq', label: 'IQ' },
]

export function DetailSlideOver({
  item,
  isOpen,
  onClose,
  mode,
  userId,
  meetingId,
}: DetailSlideOverProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!item) return null

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title={item.title}>
      {/* Badges and metadata */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge type={item.actionType} />
        <span className="font-mono text-[11px] text-ink-faint">
          {'\u00A7'}{item.itemNumber}
        </span>
        <span className="text-xs text-ink-muted">
          {item.durationMinutes}min
        </span>
        {item.presenters.length > 0 && (
          <span className="text-xs text-ink-muted">
            {item.presenters.map((p) => p.name).join(', ')}
          </span>
        )}
      </div>

      <TabBar
        tabs={TABS.map((t) => ({
          ...t,
          count: t.id === 'documents' ? item.documents.length : undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {activeTab === 'overview' && (
        <OverviewTab item={item} mode={mode} userId={userId} />
      )}
      {activeTab === 'documents' && (
        <DocumentsTab item={item} userId={userId} meetingId={meetingId} />
      )}
      {activeTab === 'iq' && (
        <IQTab item={item} userId={userId} />
      )}
    </SlideOver>
  )
}

function OverviewTab({
  item,
  mode,
  userId,
}: {
  item: AgendaItem
  mode: 'prep' | 'day'
  userId: string
}) {
  const isPresenter = item.presenters.some((p) => p.userId === userId)
  const isVoter = item.votingEnabled

  return (
    <div>
      <p className="text-[13px] leading-[1.65] text-ink-secondary mb-4">
        {item.description}
      </p>

      {(isPresenter || isVoter) && (
        <div
          className={
            isPresenter
              ? 'bg-ember-tint border border-ember-border rounded-md p-3 mb-4'
              : 'bg-paper-dark border border-border-main rounded-md p-3 mb-4'
          }
        >
          <p className="text-[10px] uppercase tracking-[1.5px] font-bold text-ink-muted mb-1">
            Your Role
          </p>
          {isPresenter ? (
            <p className="text-[13px] text-ember-muted leading-[1.65]">
              You are presenting this item. Prepare to address questions from the board.
            </p>
          ) : (
            <p className="text-[13px] text-ink-secondary leading-[1.65]">
              You will vote on the motion for this item.
            </p>
          )}
        </div>
      )}

      {item.votingEnabled && (
        <VoteCard item={item} mode={mode} userId={userId} />
      )}
    </div>
  )
}

function DocumentsTab({
  item,
  userId,
  meetingId,
}: {
  item: AgendaItem
  userId: string
  meetingId: string
}) {
  const reads = useDocumentReads(meetingId, userId)
  const ops = useDataOperations()

  if (item.documents.length === 0) {
    return <p className="text-[13px] text-ink-muted">No documents for this item.</p>
  }

  return (
    <div>
      {item.documents.map((doc) => {
        const isRead = reads.some(
          (r) => r.documentId === doc.id && r.markedAsRead
        )
        return (
          <DocumentRow
            key={doc.id}
            doc={doc}
            isRead={isRead}
            onMarkRead={() => ops.markDocumentRead(doc.id, userId)}
          />
        )
      })}
    </div>
  )
}

function IQTab({ item, userId }: { item: AgendaItem; userId: string }) {
  const { currentRole } = useRole()
  const chatRole = currentRole === 'executive' ? 'executive' : 'director'

  return (
    <div>
      {item.iqAnalysis && (
        <IQPanel itemId={item.id} userId={userId} />
      )}

      <div className={item.iqAnalysis ? 'mt-6 pt-4 border-t border-border-light' : ''}>
        <p className="text-[10px] uppercase tracking-[1.5px] font-bold text-ink-muted mb-3">
          Ask IQ
        </p>
        <IQChat itemId={item.id} userRole={chatRole} />
      </div>
    </div>
  )
}
