'use client';

import { useState } from 'react';
import { Badge } from '@/components/shared/Badge';
import type { AgendaItem } from '@/lib/types';

interface AwarenessItemProps {
  item: AgendaItem;
}

export function AwarenessItem({ item }: AwarenessItemProps) {
  const [expanded, setExpanded] = useState(false);

  const scheduledTime = item.scheduledStart
    ? new Date(item.scheduledStart).toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const presenterName = item.presenters.length > 0 ? item.presenters[0].name : '\u2014';

  return (
    <div className="border-b border-border-light">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-paper-dark transition-colors duration-150"
      >
        <span className="font-mono text-[11px] text-ink-muted w-8 shrink-0">
          {item.itemNumber}
        </span>
        <span className="flex-1 text-[13px] text-ink truncate">{item.title}</span>
        <span className="text-[12px] text-ink-muted shrink-0">{scheduledTime}</span>
        <span className="text-[12px] text-ink-muted shrink-0">{presenterName}</span>
        <Badge type={item.actionType} className="shrink-0" />
      </button>

      {expanded && (
        <div className="pl-11 pb-3">
          <p className="text-[13px] text-ink-secondary leading-relaxed">{item.description}</p>
          {item.documents.length > 0 && (
            <div className="mt-2 text-[12px] text-ink-muted">
              {item.documents.length} document{item.documents.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
