'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AgendaItem } from '@/lib/types'
import { useDataOperations } from '@/hooks/useData'

interface VoteCardProps {
  item: AgendaItem
  mode: 'prep' | 'day'
  userId: string
}

export function VoteCard({ item, mode, userId }: VoteCardProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const ops = useDataOperations()

  if (!item.votingEnabled || !item.motionText || !item.votingOptions) return null

  function handleVote(value: string) {
    if (mode === 'prep') return
    setSelectedVote(value)
    ops.castVote(item.id, userId, value)
  }

  return (
    <div className="mt-3 pt-3 border-t border-border-light">
      <p className="text-[10px] uppercase tracking-[1.5px] text-ink-muted font-bold mb-2">
        Motion
      </p>
      <p className="text-[13px] leading-[1.65] text-ink-secondary italic mb-3">
        {item.motionText}
      </p>
      {mode === 'prep' ? (
        <p className="text-xs text-ink-faint">Voting opens on meeting day</p>
      ) : (
        <div className="flex gap-2">
          {item.votingOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleVote(option)}
              className={cn(
                'px-3 py-1.5 text-[13px] rounded-md border transition-colors duration-150',
                selectedVote === option
                  ? 'bg-ember text-white border-ember font-medium'
                  : 'border-border-main text-ink-secondary hover:border-ink-faint'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
