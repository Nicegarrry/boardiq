'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { StatusLabel } from '@/components/shared/StatusLabel';
import { IQBadge } from '@/components/shared/IQBadge';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { AgendaItem } from '@/lib/types';

interface SessionCardProps {
  item: AgendaItem;
}

export function SessionCard({ item }: SessionCardProps) {
  const [toast, setToast] = useState<string | null>(null);

  function handleUpload() {
    setToast('File picker coming soon');
    setTimeout(() => setToast(null), 3000);
  }

  const questions = item.iqAnalysis?.questions ?? [];
  const execQuestions = questions.filter((q) => q.executiveFraming !== null);

  return (
    <Card className="mb-3">
      <div className="flex items-start gap-3 mb-3">
        <Badge type={item.actionType} />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[20px] text-ink leading-snug">{item.title}</h3>
          <div className="text-[12px] text-ink-muted mt-1">
            {item.itemNumber} &middot; {item.durationMinutes} min &middot;{' '}
            {item.presenters.map((p) => p.name).join(', ')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-[12px]">
          <span className="text-ink-muted">Paper: </span>
          <StatusLabel status={item.paperStatus} />
        </div>
      </div>

      {item.iqAnalysis && (
        <div className="mb-4">
          <IQBadge severity={item.iqAnalysis.severity} headline={item.iqAnalysis.headline} />
        </div>
      )}

      {item.description && (
        <p className="text-[13px] text-ink-secondary leading-relaxed mb-4">{item.description}</p>
      )}

      {/* Documents */}
      {item.documents.length > 0 && (
        <div className="mb-4">
          <SectionHeader label="Documents" count={item.documents.length} />
          <div className="space-y-1.5">
            {item.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 text-[13px]">
                <span className="text-ink">{doc.filename}</span>
                <span className="text-ink-faint text-[11px]">
                  {doc.pageCount}p &middot; {doc.fileSize}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IQ: What the Board May Ask */}
      {execQuestions.length > 0 && (
        <div className="mb-4">
          <SectionHeader label="What the Board May Ask" count={execQuestions.length} />
          <div className="space-y-3">
            {execQuestions.map((q) => (
              <div key={q.id} className="pl-3 border-l-2 border-l-border-main">
                <p className="text-[13px] text-ink leading-snug mb-1">{q.questionText}</p>
                <p className="text-[12px] text-ink-secondary leading-relaxed">
                  {q.executiveFraming}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Paper button */}
      <button
        onClick={handleUpload}
        className="text-[13px] font-medium text-ember hover:underline transition-colors duration-150"
      >
        Upload Paper
      </button>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-surface text-[13px] px-4 py-2 rounded-lg z-50">
          {toast}
        </div>
      )}
    </Card>
  );
}
