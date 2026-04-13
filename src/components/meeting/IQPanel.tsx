'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { IQBadge } from '@/components/shared/IQBadge'
import { useIQAnalysis, useIQQuestions, useDataOperations } from '@/hooks/useData'
import type { IQClaim, IQAssumption, IQQuestion } from '@/lib/types'

interface IQPanelProps {
  itemId: string
  userId: string
}

export function IQPanel({ itemId, userId }: IQPanelProps) {
  const analysis = useIQAnalysis(itemId)
  const questions = useIQQuestions(itemId)
  const ops = useDataOperations()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

  if (!analysis) return null

  function handleSave(questionId: string) {
    setSaved((prev) => {
      const next = new Set(prev)
      next.add(questionId)
      return next
    })
    ops.saveIQQuestion(questionId, userId)
  }

  function handleDismiss(questionId: string) {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(questionId)
      return next
    })
    ops.dismissIQQuestion(questionId, userId)
  }

  const visibleQuestions = questions.filter((q) => !dismissed.has(q.id))

  return (
    <div className="mt-3 pt-3 border-t border-border-light">
      <IQBadge severity={analysis.severity} headline={analysis.headline} className="mb-2" />
      <p className="text-[13px] leading-[1.65] text-ink-secondary mb-3">
        {analysis.detail}
      </p>

      {analysis.claims.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-[1px] font-bold text-ink-muted mb-1.5">
            Key Claims
          </p>
          <div className="space-y-1.5">
            {analysis.claims.map((claim, i) => (
              <ClaimRow key={i} claim={claim} />
            ))}
          </div>
        </div>
      )}

      {analysis.assumptions.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-[1px] font-bold text-ink-muted mb-1.5">
            Assumptions
          </p>
          <div className="space-y-1.5">
            {analysis.assumptions.map((a, i) => (
              <AssumptionRow key={i} assumption={a} />
            ))}
          </div>
        </div>
      )}

      {visibleQuestions.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[1px] font-bold text-ink-muted mb-1.5">
            Suggested Questions
          </p>
          <div className="space-y-2">
            {visibleQuestions.map((q) => (
              <QuestionRow
                key={q.id}
                question={q}
                isSaved={saved.has(q.id)}
                onSave={() => handleSave(q.id)}
                onDismiss={() => handleDismiss(q.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ClaimRow({ claim }: { claim: IQClaim }) {
  return (
    <div
      className={cn(
        'text-[13px] leading-[1.65] pl-3 border-l-2',
        claim.confidence === 'high'
          ? 'border-l-ink-faint text-ink-secondary'
          : claim.confidence === 'partial'
            ? 'border-l-ink-muted text-ink-secondary'
            : 'border-l-ink text-ink'
      )}
    >
      <p>{claim.claim}</p>
      {claim.flags.length > 0 && (
        <p className="text-xs text-ink-muted mt-0.5">
          {claim.flags.join('. ')}
        </p>
      )}
    </div>
  )
}

function AssumptionRow({ assumption }: { assumption: IQAssumption }) {
  return (
    <div
      className={cn(
        'text-[13px] leading-[1.65] pl-3 border-l-2',
        assumption.severity === 'high'
          ? 'border-l-ink'
          : assumption.severity === 'medium'
            ? 'border-l-ink-muted'
            : 'border-l-border-main'
      )}
    >
      <p className="text-ink-secondary">{assumption.assumption}</p>
      <p className="text-xs text-ink-muted mt-0.5">{assumption.detail}</p>
    </div>
  )
}

function QuestionRow({
  question,
  isSaved,
  onSave,
  onDismiss,
}: {
  question: IQQuestion
  isSaved: boolean
  onSave: () => void
  onDismiss: () => void
}) {
  return (
    <div className="bg-paper rounded-md p-3">
      <p className="text-[13px] leading-[1.65] text-ink">
        {question.questionText}
      </p>
      <p className="text-xs text-ink-muted mt-1">{question.directorFraming}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onSave}
          disabled={isSaved}
          className={cn(
            'text-[11px] font-medium px-2 py-1 rounded transition-colors duration-150',
            isSaved
              ? 'text-ember bg-ember-tint'
              : 'text-ink-muted hover:text-ember'
          )}
        >
          {isSaved ? 'Saved' : 'Save to notebook'}
        </button>
        <button
          onClick={onDismiss}
          className="text-[11px] text-ink-faint hover:text-ink-muted px-2 py-1 rounded transition-colors duration-150"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
