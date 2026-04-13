'use client';

import { useState } from 'react';
import { useBoardReadiness } from '@/hooks/useData';
import { ProgressBar } from '@/components/shared/ProgressBar';

const MEETING_ID = 'mtg_apr_2026';

export function BoardReadiness() {
  const readiness = useBoardReadiness(MEETING_ID);
  const [toast, setToast] = useState<string | null>(null);

  function handleReminder(name: string) {
    setToast(`Reminder sent to ${name}`);
    setTimeout(() => setToast(null), 3000);
  }

  const startedCount = readiness.filter((r) => r.percentage > 0).length;

  return (
    <div>
      <div className="text-[12px] text-ink-muted mb-4">
        {startedCount} of {readiness.length} directors have started reading
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-main text-left">
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Director
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Docs Read
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted w-32">
                Progress
              </th>
              <th className="pb-2 pr-3 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                %
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-[1px] font-bold text-ink-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {readiness.map((r) => {
              const highlight = r.percentage === 0;
              return (
                <tr
                  key={r.userId}
                  className={`border-b border-border-light ${highlight ? 'bg-ember-tint' : ''}`}
                >
                  <td className="py-2.5 pr-3">
                    <span className={highlight ? 'font-semibold text-ink' : 'text-ink'}>
                      {r.userName}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-secondary">
                    {r.docsRead}/{r.docsTotal}
                  </td>
                  <td className="py-2.5 pr-3">
                    <ProgressBar value={r.percentage} />
                  </td>
                  <td className="py-2.5 pr-3 text-ink-secondary">{r.percentage}%</td>
                  <td className="py-2.5">
                    <button
                      onClick={() => handleReminder(r.userName)}
                      className="text-[12px] font-medium text-ember hover:underline transition-colors duration-150"
                    >
                      Send Reminder
                    </button>
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
