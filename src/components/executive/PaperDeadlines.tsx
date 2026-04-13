import { Card } from '@/components/shared/Card';
import { StatusLabel } from '@/components/shared/StatusLabel';
import type { AgendaItem } from '@/lib/types';

interface PaperDeadlinesProps {
  items: AgendaItem[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(item: AgendaItem): boolean {
  return (
    item.paperStatus !== 'complete' &&
    !!item.paperDeadline &&
    new Date(item.paperDeadline) < new Date()
  );
}

export function PaperDeadlines({ items }: PaperDeadlinesProps) {
  if (items.length === 0) {
    return (
      <p className="text-[13px] text-ink-muted">No papers assigned to you for this meeting.</p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const overdue = isOverdue(item);
        return (
          <Card
            key={item.id}
            className={overdue ? 'bg-ember-tint border-ember-border' : undefined}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-ink">
                  {item.itemNumber} &middot; {item.title}
                </div>
                {item.paperDeadline && (
                  <div className="text-[12px] text-ink-muted mt-0.5">
                    Deadline: {formatDate(item.paperDeadline)}
                  </div>
                )}
              </div>
              <StatusLabel status={overdue ? 'overdue' : item.paperStatus} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
