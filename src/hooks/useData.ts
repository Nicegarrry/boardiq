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

const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase' ? 'supabase' : 'mock';

// ── Read Hooks ──

export function useMeeting(meetingId: string): Meeting {
  if (dataSource === 'mock') return useMockMeeting(meetingId);
  throw new Error('Supabase data source not yet implemented');
}

export function useAgendaItems(meetingId: string, userId?: string): AgendaItem[] {
  if (dataSource === 'mock') return useMockAgendaItems(meetingId, userId);
  throw new Error('Supabase data source not yet implemented');
}

export function useDocuments(itemId: string): Document[] {
  if (dataSource === 'mock') return useMockDocuments(itemId);
  throw new Error('Supabase data source not yet implemented');
}

export function useDocumentReads(meetingId: string, userId: string): DocumentRead[] {
  if (dataSource === 'mock') return useMockDocumentReads(meetingId, userId);
  throw new Error('Supabase data source not yet implemented');
}

export function useIQAnalysis(itemId: string): IQAnalysis | null {
  if (dataSource === 'mock') return useMockIQAnalysis(itemId);
  throw new Error('Supabase data source not yet implemented');
}

export function useIQQuestions(itemId: string): IQQuestion[] {
  if (dataSource === 'mock') return useMockIQQuestions(itemId);
  throw new Error('Supabase data source not yet implemented');
}

export function useActionItems(orgId: string): ActionItem[] {
  if (dataSource === 'mock') return useMockActionItems(orgId);
  throw new Error('Supabase data source not yet implemented');
}

export function useNotifications(userId: string): Notification[] {
  if (dataSource === 'mock') return useMockNotifications(userId);
  throw new Error('Supabase data source not yet implemented');
}

export function useNotebookEntries(userId: string, meetingId?: string): NotebookEntry[] {
  if (dataSource === 'mock') return useMockNotebookEntries(userId, meetingId);
  throw new Error('Supabase data source not yet implemented');
}

export function useBoardReadiness(meetingId: string): BoardMemberReadiness[] {
  if (dataSource === 'mock') return useMockBoardReadiness(meetingId);
  throw new Error('Supabase data source not yet implemented');
}

export function useBriefingNarrative(meetingId: string, userId: string, mode: string): string {
  if (dataSource === 'mock') return useMockBriefingNarrative(meetingId, userId, mode);
  throw new Error('Supabase data source not yet implemented');
}

// ── Write Operations ──

export function useDataOperations() {
  if (dataSource === 'mock') return useMockDataOperations();
  throw new Error('Supabase data source not yet implemented');
}
