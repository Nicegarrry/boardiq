'use client';

import { useState } from 'react';
import { useActionItems } from '@/hooks/useData';
import { StatusLabel } from '@/components/shared/StatusLabel';
import type { ActionItemStatus } from '@/lib/types';

const ORG_ID = 'org_coastal_health';

type FilterValue = 'all' | 'overdue' | 'in_progress' | 'complete';

function getEffectiveStatus(status: ActionItemStatus, dueDate: string): string {
  if (status !== 'complete' && new Date(dueDate) < new Date()) return 'overdue';
  return status;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ActionItemTracker() {
  const actionItems = useActionItems(ORG_ID);
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = actionItems.filter((item) => {
    if (filter === 'all') return true;
    const effective = getEffectiveStatus(item.status, item.dueDate);
    return effective === filter;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aEff = getEffectiveStatus(a.status, a.dueDate);
    const bEff = getEffectiveStatus(b.status, b.dueDate);
    if (aEff === 'overdue' && bEff !== 'overdue') return -1;
    if (bEff === 'overdue' && aEff !== 'overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div>
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterValue)}
          className="text-[13px] border border-border-main rounded-md px-3 py-1.5 bg-surface text-ink focus:outline-none focus:border-ink-muted transition-colors duration-150"
        >
          <option value="all">All Statuses</option>
          <option value="overdue">Overdue</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-main text-left">
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Title
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Assignee
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Due Date
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Status
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const effectiveStatus = getEffectiveStatus(item.status, item.dueDate);
              const overdue = effectiveStatus === 'overdue';
              return (
                <tr
                  key={item.id}
                  className={`border-b border-border-light ${overdue ? 'bg-ember-tint' : ''}`}
                >
                  <td className="py-2.5 pr-3 text-ink">{item.title}</td>
                  <td className="py-2.5 pr-3 text-ink-secondary">{item.assigneeName}</td>
                  <td className="py-2.5 pr-3 text-ink-secondary">{formatDate(item.dueDate)}</td>
                  <td className="py-2.5 pr-3">
                    <StatusLabel status={effectiveStatus} />
                  </td>
                  <td className="py-2.5 text-ink-muted">
                    {formatDate(item.sourceMeetingDate)} ({item.sourceItemNumber})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
