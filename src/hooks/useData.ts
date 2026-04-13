'use client';

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
  BoardMemberReadiness,
} from '@/lib/types';

import {
  useMockMeeting,
  useMockAgendaItems,
  useMockDocuments,
  useMockDocumentReads,
  useMockIQAnalysis,
  useMockIQQuestions,
  useMockActionItems,
  useMockNotifications,
  useMockNotebookEntries,
  useMockBoardReadiness,
  useMockBriefingNarrative,
  useMockDataOperations,
} from './useMockData';

import {
  useSupabaseMeeting,
  useSupabaseAgendaItems,
  useSupabaseDocuments,
  useSupabaseDocumentReads,
  useSupabaseIQAnalysis,
  useSupabaseIQQuestions,
  useSupabaseActionItems,
  useSupabaseNotifications,
  useSupabaseNotebookEntries,
  useSupabaseBoardReadiness,
  useSupabaseBriefingNarrative,
  useSupabaseDataOperations,
} from './useSupabaseData';

export { SupabaseDataProvider } from './useSupabaseData';
export { MockDataProvider } from './useMockData';

const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase' ? 'supabase' : 'mock';

// ── Read Hooks ──

export function useMeeting(meetingId: string): Meeting {
  if (dataSource === 'supabase') return useSupabaseMeeting(meetingId);
  return useMockMeeting(meetingId);
}

export function useAgendaItems(meetingId: string, userId?: string): AgendaItem[] {
  if (dataSource === 'supabase') return useSupabaseAgendaItems(meetingId, userId);
  return useMockAgendaItems(meetingId, userId);
}

export function useDocuments(itemId: string): Document[] {
  if (dataSource === 'supabase') return useSupabaseDocuments(itemId);
  return useMockDocuments(itemId);
}

export function useDocumentReads(meetingId: string, userId: string): DocumentRead[] {
  if (dataSource === 'supabase') return useSupabaseDocumentReads(meetingId, userId);
  return useMockDocumentReads(meetingId, userId);
}

export function useIQAnalysis(itemId: string): IQAnalysis | null {
  if (dataSource === 'supabase') return useSupabaseIQAnalysis(itemId);
  return useMockIQAnalysis(itemId);
}

export function useIQQuestions(itemId: string): IQQuestion[] {
  if (dataSource === 'supabase') return useSupabaseIQQuestions(itemId);
  return useMockIQQuestions(itemId);
}

export function useActionItems(orgId: string): ActionItem[] {
  if (dataSource === 'supabase') return useSupabaseActionItems(orgId);
  return useMockActionItems(orgId);
}

export function useNotifications(userId: string): Notification[] {
  if (dataSource === 'supabase') return useSupabaseNotifications(userId);
  return useMockNotifications(userId);
}

export function useNotebookEntries(userId: string, meetingId?: string): NotebookEntry[] {
  if (dataSource === 'supabase') return useSupabaseNotebookEntries(userId, meetingId);
  return useMockNotebookEntries(userId, meetingId);
}

export function useBoardReadiness(meetingId: string): BoardMemberReadiness[] {
  if (dataSource === 'supabase') return useSupabaseBoardReadiness(meetingId);
  return useMockBoardReadiness(meetingId);
}

export function useBriefingNarrative(meetingId: string, userId: string, mode: string): string {
  if (dataSource === 'supabase') return useSupabaseBriefingNarrative(meetingId, userId, mode);
  return useMockBriefingNarrative(meetingId, userId, mode);
}

// ── Write Operations ──

export function useDataOperations() {
  if (dataSource === 'supabase') return useSupabaseDataOperations();
  return useMockDataOperations();
}
