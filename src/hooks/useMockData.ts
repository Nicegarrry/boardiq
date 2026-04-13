'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { createElement } from 'react';

import type {
  Meeting,
  AgendaItem,
  Document,
  DocumentRead,
  IQAnalysis,
  IQQuestion,
  ActionItem,
  Notification,
  NotebookEntry,
  Vote,
  BoardMemberReadiness,
  IQQuestionInteraction,
  DocumentReads,
  BriefingMode,
} from '@/lib/types';

import {
  meeting as mockMeeting,
  agendaItems as mockAgendaItems,
  documentReads as mockDocumentReads,
  actionItems as mockActionItems,
  notebookEntries as mockNotebookEntries,
  notifications as mockNotifications,
  briefingNarratives as mockBriefingNarratives,
  users as mockUsers,
} from '@/lib/mock-data';

// ── Mutable state shape ──

interface MockDataState {
  documentReads: DocumentReads;
  notebookEntries: NotebookEntry[];
  notifications: Notification[];
  iqQuestionInteractions: IQQuestionInteraction[];
  votes: Vote[];
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
}

// ── Context value ──

interface MockDataContextValue {
  state: MockDataState;
  // Write operations
  markDocumentRead: (docId: string, userId: string) => void;
  addAgendaItem: (meetingId: string, item: Partial<AgendaItem>) => void;
  updateAgendaItem: (itemId: string, updates: Partial<AgendaItem>) => void;
  castVote: (itemId: string, userId: string, value: string) => void;
  addNotebookEntry: (entry: Partial<NotebookEntry>) => void;
  saveIQQuestion: (questionId: string, userId: string) => void;
  dismissIQQuestion: (questionId: string, userId: string) => void;
  markNotificationRead: (notifId: string) => void;
  updateActionItem: (itemId: string, updates: Partial<ActionItem>) => void;
}

const MockDataContext = createContext<MockDataContextValue | undefined>(undefined);

// ── Provider ──

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockDataState>({
    documentReads: { ...mockDocumentReads },
    notebookEntries: [...mockNotebookEntries],
    notifications: [...mockNotifications],
    iqQuestionInteractions: [],
    votes: [],
    agendaItems: [...mockAgendaItems],
    actionItems: [...mockActionItems],
  });

  const markDocumentRead = useCallback((docId: string, userId: string) => {
    setState((prev) => {
      const userReads = prev.documentReads[userId] || {};
      return {
        ...prev,
        documentReads: {
          ...prev.documentReads,
          [userId]: {
            ...userReads,
            [docId]: { read: true, markedAt: new Date().toISOString() },
          },
        },
      };
    });
  }, []);

  const addAgendaItem = useCallback((meetingId: string, item: Partial<AgendaItem>) => {
    setState((prev) => {
      const maxSort = Math.max(...prev.agendaItems.map((a) => a.sortOrder), 0);
      const newItem: AgendaItem = {
        id: `item_new_${Date.now()}`,
        meetingId,
        itemNumber: item.itemNumber || `${maxSort + 1}.0`,
        sortOrder: maxSort + 1,
        phase: item.phase || 'Other',
        phaseSortOrder: item.phaseSortOrder || 1,
        title: item.title || 'New Agenda Item',
        description: item.description || '',
        actionType: item.actionType || 'noting',
        scheduledStart: item.scheduledStart || '',
        durationMinutes: item.durationMinutes || 10,
        confidentiality: item.confidentiality || 'standard',
        votingEnabled: item.votingEnabled || false,
        motionText: item.motionText || null,
        votingOptions: item.votingOptions || null,
        paperStatus: item.paperStatus || 'not_started',
        paperOwnerId: item.paperOwnerId || null,
        paperDeadline: item.paperDeadline || null,
        secretariatNotes: item.secretariatNotes || null,
        iqStatus: item.iqStatus || 'not_available',
        presenters: item.presenters || [],
        documents: item.documents || [],
        iqAnalysis: item.iqAnalysis || null,
      };
      return { ...prev, agendaItems: [...prev.agendaItems, newItem] };
    });
  }, []);

  const updateAgendaItem = useCallback((itemId: string, updates: Partial<AgendaItem>) => {
    setState((prev) => ({
      ...prev,
      agendaItems: prev.agendaItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const castVote = useCallback((itemId: string, userId: string, value: string) => {
    setState((prev) => {
      const existingIndex = prev.votes.findIndex(
        (v) => v.agendaItemId === itemId && v.userId === userId
      );
      const vote: Vote = {
        id: existingIndex >= 0 ? prev.votes[existingIndex].id : `vote_${Date.now()}`,
        agendaItemId: itemId,
        userId,
        value,
        castAt: new Date().toISOString(),
      };
      if (existingIndex >= 0) {
        const newVotes = [...prev.votes];
        newVotes[existingIndex] = vote;
        return { ...prev, votes: newVotes };
      }
      return { ...prev, votes: [...prev.votes, vote] };
    });
  }, []);

  const addNotebookEntry = useCallback((entry: Partial<NotebookEntry>) => {
    setState((prev) => {
      const newEntry: NotebookEntry = {
        id: `note_${Date.now()}`,
        userId: entry.userId || '',
        meetingId: entry.meetingId || '',
        agendaItemId: entry.agendaItemId || '',
        title: entry.title || '',
        content: entry.content || '',
        isStarred: entry.isStarred || false,
        source: entry.source || 'manual',
        sourceReferenceId: entry.sourceReferenceId || null,
        tags: entry.tags || [],
        createdAt: new Date().toISOString(),
      };
      return { ...prev, notebookEntries: [...prev.notebookEntries, newEntry] };
    });
  }, []);

  const saveIQQuestion = useCallback((questionId: string, userId: string) => {
    setState((prev) => {
      const existing = prev.iqQuestionInteractions.find(
        (i) => i.questionId === questionId && i.userId === userId
      );
      if (existing) {
        return {
          ...prev,
          iqQuestionInteractions: prev.iqQuestionInteractions.map((i) =>
            i.questionId === questionId && i.userId === userId
              ? { ...i, starred: true }
              : i
          ),
        };
      }
      return {
        ...prev,
        iqQuestionInteractions: [
          ...prev.iqQuestionInteractions,
          { questionId, userId, starred: true, dismissed: false },
        ],
      };
    });
  }, []);

  const dismissIQQuestion = useCallback((questionId: string, userId: string) => {
    setState((prev) => {
      const existing = prev.iqQuestionInteractions.find(
        (i) => i.questionId === questionId && i.userId === userId
      );
      if (existing) {
        return {
          ...prev,
          iqQuestionInteractions: prev.iqQuestionInteractions.map((i) =>
            i.questionId === questionId && i.userId === userId
              ? { ...i, dismissed: true }
              : i
          ),
        };
      }
      return {
        ...prev,
        iqQuestionInteractions: [
          ...prev.iqQuestionInteractions,
          { questionId, userId, starred: false, dismissed: true },
        ],
      };
    });
  }, []);

  const markNotificationRead = useCallback((notifId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      ),
    }));
  }, []);

  const updateActionItem = useCallback((itemId: string, updates: Partial<ActionItem>) => {
    setState((prev) => ({
      ...prev,
      actionItems: prev.actionItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const value: MockDataContextValue = {
    state,
    markDocumentRead,
    addAgendaItem,
    updateAgendaItem,
    castVote,
    addNotebookEntry,
    saveIQQuestion,
    dismissIQQuestion,
    markNotificationRead,
    updateActionItem,
  };

  return createElement(MockDataContext.Provider, { value }, children);
}

// ── Internal context hook ──

function useMockDataContext(): MockDataContextValue {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}

// ── Read Hooks ──

export function useMockMeeting(_meetingId: string): Meeting {
  return mockMeeting;
}

export function useMockAgendaItems(meetingId: string, _userId?: string): AgendaItem[] {
  const { state } = useMockDataContext();
  return state.agendaItems
    .filter((item) => item.meetingId === meetingId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function useMockDocuments(itemId: string): Document[] {
  const { state } = useMockDataContext();
  const item = state.agendaItems.find((a) => a.id === itemId);
  return item?.documents || [];
}

export function useMockDocumentReads(meetingId: string, userId: string): DocumentRead[] {
  const { state } = useMockDataContext();
  const userReads = state.documentReads[userId] || {};
  const reads: DocumentRead[] = [];

  // Collect all documents for this meeting
  const meetingItems = state.agendaItems.filter((a) => a.meetingId === meetingId);
  for (const item of meetingItems) {
    for (const doc of item.documents) {
      const readRecord = userReads[doc.id];
      reads.push({
        id: `read_${doc.id}_${userId}`,
        documentId: doc.id,
        userId,
        markedAsRead: readRecord?.read || false,
        markedAt: readRecord?.markedAt || '',
      });
    }
  }

  return reads;
}

export function useMockIQAnalysis(itemId: string): IQAnalysis | null {
  const { state } = useMockDataContext();
  const item = state.agendaItems.find((a) => a.id === itemId);
  return item?.iqAnalysis || null;
}

export function useMockIQQuestions(itemId: string): IQQuestion[] {
  const { state } = useMockDataContext();
  const item = state.agendaItems.find((a) => a.id === itemId);
  return item?.iqAnalysis?.questions || [];
}

export function useMockActionItems(_orgId: string): ActionItem[] {
  const { state } = useMockDataContext();
  return state.actionItems;
}

export function useMockNotifications(userId: string): Notification[] {
  const { state } = useMockDataContext();
  return state.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function useMockNotebookEntries(userId: string, meetingId?: string): NotebookEntry[] {
  const { state } = useMockDataContext();
  return state.notebookEntries.filter((entry) => {
    if (entry.userId !== userId) return false;
    if (meetingId && entry.meetingId !== meetingId) return false;
    return true;
  });
}

export function useMockBoardReadiness(meetingId: string): BoardMemberReadiness[] {
  const { state } = useMockDataContext();
  const meetingItems = state.agendaItems.filter((a) => a.meetingId === meetingId);

  // Collect all document IDs for this meeting
  const allDocIds: string[] = [];
  for (const item of meetingItems) {
    for (const doc of item.documents) {
      allDocIds.push(doc.id);
    }
  }

  const docsTotal = allDocIds.length;

  // Only board members
  const boardMembers = mockUsers.filter((u) => u.role === 'board_member');

  return boardMembers.map((user) => {
    const userReads = state.documentReads[user.id] || {};
    const docsRead = allDocIds.filter((docId) => userReads[docId]?.read).length;
    return {
      userId: user.id,
      userName: user.fullName,
      docsRead,
      docsTotal,
      percentage: docsTotal > 0 ? Math.round((docsRead / docsTotal) * 100) : 0,
    };
  });
}

export function useMockBriefingNarrative(
  _meetingId: string,
  userId: string,
  mode: BriefingMode | string
): string {
  // Check director narratives
  const directorNarrative = mockBriefingNarratives.director[userId];
  if (directorNarrative) {
    return (mode === 'prep' ? directorNarrative.prep : directorNarrative.day) || '';
  }

  // Check executive narratives
  const execNarrative = mockBriefingNarratives.executive[userId];
  if (execNarrative) {
    return (mode === 'prep' ? execNarrative.prep : execNarrative.day) || '';
  }

  return '';
}

// ── Write Operations (re-exported from context) ──

export function useMockDataOperations() {
  const {
    markDocumentRead,
    addAgendaItem,
    updateAgendaItem,
    castVote,
    addNotebookEntry,
    saveIQQuestion,
    dismissIQQuestion,
    markNotificationRead,
    updateActionItem,
  } = useMockDataContext();

  return {
    markDocumentRead,
    addAgendaItem,
    updateAgendaItem,
    castVote,
    addNotebookEntry,
    saveIQQuestion,
    dismissIQQuestion,
    markNotificationRead,
    updateActionItem,
  };
}

// ── Combined hook (convenience) ──

export function useMockData() {
  const ctx = useMockDataContext();
  return {
    // State
    ...ctx.state,
    // Read hooks are standalone — import them individually
    // Write operations
    markDocumentRead: ctx.markDocumentRead,
    addAgendaItem: ctx.addAgendaItem,
    updateAgendaItem: ctx.updateAgendaItem,
    castVote: ctx.castVote,
    addNotebookEntry: ctx.addNotebookEntry,
    saveIQQuestion: ctx.saveIQQuestion,
    dismissIQQuestion: ctx.dismissIQQuestion,
    markNotificationRead: ctx.markNotificationRead,
    updateActionItem: ctx.updateActionItem,
  };
}
