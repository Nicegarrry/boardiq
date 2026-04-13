'use client';

import { useState } from 'react';
import { useAgendaItems } from '@/hooks/useData';
import { StatusLabel } from '@/components/shared/StatusLabel';
import type { AgendaItem } from '@/lib/types';

const MEETING_ID = 'mtg_apr_2026';

function paperStatusSort(item: AgendaItem): number {
  const isOverdue =
    item.paperStatus !== 'complete' &&
    item.paperDeadline &&
    new Date(item.paperDeadline) < new Date();
  if (isOverdue) return 0;
  if (item.paperStatus === 'not_started') return 1;
  if (item.paperStatus === 'awaiting_upload') return 2;
  if (item.paperStatus === 'draft') return 3;
  if (item.paperStatus === 'in_review') return 4;
  return 5; // complete
}

function isOverdue(item: AgendaItem): boolean {
  return (
    item.paperStatus !== 'complete' &&
    !!item.paperDeadline &&
    new Date(item.paperDeadline) < new Date()
  );
}

function getPresenterName(item: AgendaItem): string {
  if (item.presenters.length > 0) return item.presenters[0].name;
  return '\u2014';
}

function getDisplayStatus(item: AgendaItem): string {
  if (isOverdue(item)) return 'overdue';
  return item.paperStatus;
}

export function PaperTracking() {
  const items = useAgendaItems(MEETING_ID);
  const [toast, setToast] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => paperStatusSort(a) - paperStatusSort(b));

  function handleNudge(name: string) {
    setToast(`Reminder sent to ${name}`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-main text-left">
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Item
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Title
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Responsible
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Status
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Docs
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const overdue = isOverdue(item);
              return (
                <tr
                  key={item.id}
                  className={`border-b border-border-light ${overdue ? 'bg-ember-tint' : ''}`}
                >
                  <td className="py-2.5 pr-3 font-mono text-[11px] text-ink-muted">
                    {item.itemNumber}
                  </td>
                  <td className="py-2.5 pr-3 text-ink">{item.title}</td>
                  <td className="py-2.5 pr-3 text-ink-secondary">{getPresenterName(item)}</td>
                  <td className="py-2.5 pr-3">
                    <StatusLabel status={getDisplayStatus(item)} />
                  </td>
                  <td className="py-2.5 pr-3 text-ink-muted">{item.documents.length}</td>
                  <td className="py-2.5">
                    {overdue && (
                      <button
                        onClick={() => handleNudge(getPresenterName(item))}
                        className="text-[12px] font-medium text-ember hover:underline transition-colors duration-150"
                      >
                        Nudge
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-surface text-[13px] px-4 py-2 rounded-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
