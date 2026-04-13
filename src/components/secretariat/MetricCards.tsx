'use client';

import { Card } from '@/components/shared/Card';
import { useAgendaItems, useActionItems, useBoardReadiness } from '@/hooks/useData';

const MEETING_ID = 'mtg_apr_2026';
const ORG_ID = 'org_coastal_health';

export function MetricCards() {
  const items = useAgendaItems(MEETING_ID);
  const actionItems = useActionItems(ORG_ID);
  const readiness = useBoardReadiness(MEETING_ID);

  const papersReady = items.filter((i) => i.paperStatus === 'complete').length;
  const papersTotal = items.length;

  const avgPrep =
    readiness.length > 0
      ? Math.round(readiness.reduce((sum, r) => sum + r.percentage, 0) / readiness.length)
      : 0;

  const overdue = items.filter(
    (i) => i.paperStatus !== 'complete' && i.paperDeadline && new Date(i.paperDeadline) < new Date()
  ).length;

  const outstandingActions = actionItems.filter((a) => a.status !== 'complete').length;

  const metrics = [
    { value: `${papersReady}/${papersTotal}`, label: 'Papers Ready' },
    { value: `${avgPrep}%`, label: 'Board Prep' },
    { value: `${overdue}`, label: 'Overdue Papers' },
    { value: `${outstandingActions}`, label: 'Outstanding Actions' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <div className="text-2xl font-semibold text-ink">{m.value}</div>
          <div className="text-xs uppercase tracking-wide text-ink-muted mt-1">{m.label}</div>
        </Card>
      ))}
    </div>
  );
}
