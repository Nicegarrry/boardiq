'use client'

import { cn } from '@/lib/utils'
import type { Document } from '@/lib/types'

interface DocumentRowProps {
  doc: Document
  isRead: boolean
  onMarkRead: () => void
}

export function DocumentRow({ doc, isRead, onMarkRead }: DocumentRowProps) {
  return (
    <button
      onClick={onMarkRead}
      className={cn(
        'flex items-center justify-between w-full py-2 px-3 rounded-md text-left',
        'transition-colors duration-150 hover:bg-paper-dark',
        'border-b border-border-light last:border-b-0'
      )}
    >
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-[13px] truncate',
            isRead ? 'text-ink-muted font-normal' : 'text-ink font-semibold'
          )}
        >
          {isRead && <span className="mr-1">{'\u2713'}</span>}
          {doc.filename}
        </p>
        <p className="text-xs text-ink-muted mt-0.5">
          <span className="text-[10px] uppercase tracking-[1.5px] text-ink-faint">
            {doc.fileType}
          </span>
          <span className="mx-1.5">{'\u00B7'}</span>
          {doc.pageCount} page{doc.pageCount === 1 ? '' : 's'}
        </p>
      </div>
    </button>
  )
}
