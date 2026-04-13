'use client';

import { useState } from 'react';
import { TabBar } from '@/components/shared/TabBar';
import { MetricCards } from './MetricCards';
import { PaperTracking } from './PaperTracking';
import { BoardReadiness } from './BoardReadiness';
import { ActionItemTracker } from './ActionItemTracker';
import { AgendaEditor } from './AgendaEditor';

const TABS = [
  { id: 'papers', label: 'Paper Tracking' },
  { id: 'readiness', label: 'Board Readiness' },
  { id: 'actions', label: 'Action Items' },
  { id: 'agenda', label: 'Agenda Editor' },
];

export function SecretariatDashboard() {
  const [activeTab, setActiveTab] = useState('papers');

  return (
    <div className="content-width mx-auto">
      <h1 className="font-display text-[28px] text-ink mb-6">Secretariat Dashboard</h1>

      <MetricCards />

      <div className="mt-8">
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === 'papers' && <PaperTracking />}
        {activeTab === 'readiness' && <BoardReadiness />}
        {activeTab === 'actions' && <ActionItemTracker />}
        {activeTab === 'agenda' && <AgendaEditor />}
      </div>
    </div>
  );
}
