'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { IQBadge } from '@/components/shared/IQBadge'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { DocumentRow } from './DocumentRow'
import { VoteCard } from './VoteCard'
import { IQPanel } from './IQPanel'
import { useDocumentReads, useDataOperations } from '@/hooks/useData'
import type { AgendaItem } from '@/lib/types'

interface AgendaCardProps {
  item: AgendaItem
  isExpanded: boolean
  isSelected?: boolean
  onToggle: () => void
  onOpenDetail: (item: AgendaItem) => void
  mode: 'prep' | 'day'
  userId: string
  meetingId: string
  compact?: boolean
}

export function AgendaCard({
  item,
  isExpanded,
  isSelected,
  onToggle,
  onOpenDetail,
  mode,
  userId,
  meetingId,
  compact,
}: AgendaCardProps) {
  const reads = useDocumentReads(meetingId, userId)
  const ops = useDataOperations()

  // Calculate per-item document read progress
  const itemDocIds = new Set(item.documents.map((d) => d.id))
  const itemReads = reads.filter((r) => itemDocIds.has(r.documentId))
  const docsRead = itemReads.filter((r) => r.markedAsRead).length
  const totalDocs = item.documents.length
  const readPercent = totalDocs > 0 ? Math.round((docsRead / totalDocs) * 100) : 100

  // Check if user is presenter or voter
  const isPresenter = item.presenters.some((p) => p.userId === userId)
  const isVoter = item.votingEnabled

  const presenterNames = item.presenters.map((p) => p.name).join(', ')

  return (
    <Card
      className={cn(
        'mb-2.5',
        isExpanded && 'border-ink-faint',
        isSelected && 'border-l-2 border-l-ember'
      )}
    >
      {/* Collapsed header -- always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge type={item.actionType} />
              {item.votingEnabled && (
                <span className="text-[10px] uppercase tracking-[1.5px] font-medium text-ink-secondary">
                  VOTE
                </span>
              )}
              {item.iqAnalysis && item.iqAnalysis.severity !== 'good' && (
                <IQBadge
                  severity={item.iqAnalysis.severity}
                  headline={item.iqAnalysis.headline}
                />
              )}
            </div>

            {/* Title */}
            <h3 className="font-display text-[16px] text-ink leading-snug">
              {item.title}
            </h3>

            {/* Metadata row */}
            <p className="text-xs text-ink-muted mt-1">
              <span className="font-mono text-[11px] text-ink-faint">
                {'\u00A7'}{item.itemNumber}
              </span>
              <span className="mx-1.5">{'\u00B7'}</span>
              {item.durationMinutes}min
              {presenterNames && (
                <>
                  <span className="mx-1.5">{'\u00B7'}</span>
                  {presenterNames}
                </>
              )}
              {totalDocs > 0 && (
                <>
                  <span className="mx-1.5">{'\u00B7'}</span>
                  {totalDocs} doc{totalDocs === 1 ? '' : 's'}
                </>
              )}
            </p>
          </div>

          {/* Progress ring (prep mode only, if docs exist) */}
          {mode === 'prep' && totalDocs > 0 && (
            <div className="shrink-0 mt-1">
              <ProgressRing value={readPercent} size={32} strokeWidth={3} />
            </div>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && compact && (
        <div className="mt-3 pt-3 border-t border-border-light">
          <p className="text-[13px] leading-[1.65] text-ink-secondary">
            {item.description}
          </p>
        </div>
      )}
      {isExpanded && !compact && (
        <div className="mt-3 pt-3 border-t border-border-light">
          {/* Description */}
          <p className="text-[13px] leading-[1.65] text-ink-secondary mb-3">
            {item.description}
          </p>

          {/* Your Role callout */}
          {(isPresenter || isVoter) && (
            <div
              className={cn(
                'rounded-md p-3 mb-3 text-[13px] leading-[1.65]',
                isPresenter
                  ? 'bg-ember-tint border border-ember-border'
                  : 'bg-paper-dark border border-border-main'
              )}
            >
              <p className="text-[10px] uppercase tracking-[1.5px] font-bold text-ink-muted mb-1">
                Your Role
              </p>
              {isPresenter ? (
                <p className="text-ember-muted">
                  You are presenting this item. Prepare to address questions from the board.
                </p>
              ) : (
                <p className="text-ink-secondary">
                  You will vote on the motion for this item.
                </p>
              )}
            </div>
          )}

          {/* IQ Panel */}
          {item.iqAnalysis && (
            <IQPanel itemId={item.id} userId={userId} />
          )}

          {/* Documents */}
          {item.documents.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-light">
              <p className="text-[11px] uppercase tracking-[1px] font-bold text-ink-muted mb-1.5">
                Documents
              </p>
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
          )}

          {/* Vote Card */}
          {item.votingEnabled && (
            <VoteCard item={item} mode={mode} userId={userId} />
          )}

          {/* Open full detail button */}
          <div className="mt-3 pt-3 border-t border-border-light">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenDetail(item)
              }}
              className="text-[13px] text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
            >
              Open full detail
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
