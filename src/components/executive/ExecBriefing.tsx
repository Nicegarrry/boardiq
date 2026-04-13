'use client';

import { Card } from '@/components/shared/Card';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAgendaItems, useBriefingNarrative } from '@/hooks/useData';
import { useRole } from '@/hooks/useRole';
import { SessionCard } from './SessionCard';
import { AwarenessItem } from './AwarenessItem';
import { PaperDeadlines } from './PaperDeadlines';

const MEETING_ID = 'mtg_apr_2026';

// Map RoleContext user IDs to mock-data user IDs for executives
const EXEC_USER_MAP: Record<string, string> = {
  'exec-1': 'user_sarah_brennan',
  'exec-2': 'user_michael_torres',
  'exec-3': 'user_anika_patel',
  'exec-4': 'user_lisa_chang',
};

export function ExecBriefing() {
  const { currentUser } = useRole();
  const mockUserId = EXEC_USER_MAP[currentUser.id] || 'user_michael_torres';

  const allItems = useAgendaItems(MEETING_ID);
  const narrative = useBriefingNarrative(MEETING_ID, mockUserId, 'prep');

  // Items where this executive is a presenter
  const myItems = allItems.filter((item) =>
    item.presenters.some((p) => p.userId === mockUserId)
  );

  // Remaining items
  const otherItems = allItems.filter(
    (item) => !item.presenters.some((p) => p.userId === mockUserId)
  );

  // Items where this executive is paper owner
  const myPaperItems = allItems.filter((item) => item.paperOwnerId === mockUserId);

  return (
    <div className="content-width mx-auto">
      <h1 className="font-display text-[28px] text-ink mb-1">Your Session Briefing</h1>
      <p className="text-[13px] text-ink-muted mb-6">
        {currentUser.name} &middot; {currentUser.title}
      </p>

      {/* AI Briefing Narrative */}
      {narrative && (
        <Card variant="briefing" className="mb-8">
          <div className="text-[11px] uppercase tracking-[1px] font-bold text-ember mb-2">
            IQ Briefing
          </div>
          <p className="text-[13px] text-ink-secondary leading-relaxed">{narrative}</p>
        </Card>
      )}

      {/* Your Sessions */}
      {myItems.length > 0 && (
        <div className="mb-8">
          <SectionHeader label="Your Sessions" count={myItems.length} />
          {myItems.map((item) => (
            <SessionCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Other Items */}
      {otherItems.length > 0 && (
        <div className="mb-8">
          <SectionHeader label="Other Items" count={otherItems.length} />
          {otherItems.map((item) => (
            <AwarenessItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Paper Deadlines */}
      {myPaperItems.length > 0 && (
        <div className="mb-8">
          <SectionHeader label="Paper Deadlines" count={myPaperItems.length} />
          <PaperDeadlines items={myPaperItems} />
        </div>
      )}
    </div>
  );
}
