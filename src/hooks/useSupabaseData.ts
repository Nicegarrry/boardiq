'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { createElement } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';

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
  Presenter,
  IQClaim,
  IQAssumption,
  IQRiskFlag,
  IQDataQuality,
  IQRelatedItem,
  BriefingMode,
  PreviousMeeting,
} from '@/lib/types';

// ── Snake-to-camelCase mapping utilities ──

/* eslint-disable @typescript-eslint/no-explicit-any */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeys<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    result[snakeToCamel(key)] = val;
  }
  return result as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Context ──

interface SupabaseContextValue {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const value = useMemo(() => ({ supabase }), [supabase]);
  return createElement(SupabaseContext.Provider, { value }, children);
}

function useSupabaseClient(): SupabaseClient {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error('useSupabaseClient must be used within a SupabaseDataProvider');
  }
  return ctx.supabase;
}

// ── Mapping helpers ──

function mapMeeting(row: Record<string, unknown>): Meeting {
  return {
    id: row.id as string,
    orgId: row.org_id as string,
    committeeId: row.committee_id as string,
    title: (row.title as string) || null,
    meetingType: row.meeting_type as Meeting['meetingType'],
    status: row.status as Meeting['status'],
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: (row.end_time as string) || '',
    timezone: (row.timezone as string) || '',
    locationName: (row.location_name as string) || '',
    locationAddress: (row.location_address as string) || '',
    virtualLink: (row.virtual_link as string) || null,
    publishedAt: (row.published_at as string) || '',
    preReadDeadline: (row.pre_read_deadline as string) || '',
    paperDeadline: (row.paper_deadline as string) || '',
    daysUntil: 0, // computed client-side below
    previousMeeting: {
      id: '',
      date: '',
      minutesStatus: '',
    } as PreviousMeeting,
  };
}

function computeDaysUntil(dateStr: string): number {
  const meetingDate = new Date(dateStr);
  const now = new Date();
  const diff = meetingDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function mapDocument(row: Record<string, unknown>): Document {
  return {
    id: row.id as string,
    filename: row.filename as string,
    fileType: row.file_type as string,
    pageCount: (row.page_count as number) || 0,
    fileSize: row.file_size_bytes ? formatFileSize(row.file_size_bytes as number) : '',
    uploadedBy: row.uploaded_by as string,
    uploadedAt: (row.created_at as string) || '',
    processingStatus: row.processing_status as Document['processingStatus'],
    version: (row.version as number) || 1,
    summary: (row.description as string) || '',
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapPresenter(row: Record<string, unknown>): Presenter {
  const isExternal = !row.org_membership_id;
  return {
    userId: (row.user_id as string) || '',
    name: isExternal
      ? (row.external_name as string) || 'External Presenter'
      : (row.full_name as string) || '',
    title: isExternal
      ? (row.external_title as string) || ''
      : (row.title as string) || '',
    isExternal,
  };
}

function mapAgendaItem(
  row: Record<string, unknown>,
  presenters: Presenter[],
  documents: Document[],
  iqAnalysis: IQAnalysis | null
): AgendaItem {
  return {
    id: row.id as string,
    meetingId: row.meeting_id as string,
    itemNumber: row.item_number as string,
    sortOrder: row.sort_order as number,
    phase: (row.phase as string) || '',
    phaseSortOrder: (row.phase_sort_order as number) || 0,
    title: row.title as string,
    description: (row.description as string) || '',
    actionType: row.action_type as AgendaItem['actionType'],
    scheduledStart: (row.scheduled_start as string) || '',
    durationMinutes: (row.duration_minutes as number) || 0,
    confidentiality: row.confidentiality as AgendaItem['confidentiality'],
    votingEnabled: (row.voting_enabled as boolean) || false,
    motionText: (row.motion_text as string) || null,
    votingOptions: (row.voting_options as string[]) || null,
    paperStatus: row.paper_status as AgendaItem['paperStatus'],
    paperOwnerId: (row.paper_owner_id as string) || null,
    paperDeadline: (row.paper_deadline as string) || null,
    secretariatNotes: (row.secretariat_notes as string) || null,
    iqStatus: row.iq_status as AgendaItem['iqStatus'],
    presenters,
    documents,
    iqAnalysis,
  };
}

function mapIQAnalysis(
  analysisRow: Record<string, unknown>,
  questions: IQQuestion[]
): IQAnalysis {
  return {
    id: analysisRow.id as string,
    headline: (analysisRow.headline as string) || '',
    severity: analysisRow.severity as IQAnalysis['severity'],
    detail: (analysisRow.detail as string) || '',
    claims: ((analysisRow.claims as IQClaim[]) || []),
    assumptions: ((analysisRow.assumptions as IQAssumption[]) || []),
    riskFlags: ((analysisRow.risk_flags as IQRiskFlag[]) || []),
    dataQuality: ((analysisRow.data_quality as IQDataQuality[]) || []),
    relatedItems: ((analysisRow.related_items as IQRelatedItem[]) || []),
    questions,
  };
}

function mapIQQuestion(row: Record<string, unknown>): IQQuestion {
  return {
    id: row.id as string,
    questionText: row.question_text as string,
    rationale: (row.rationale as string) || '',
    category: row.category as IQQuestion['category'],
    priority: (row.priority as number) || 0,
    directorFraming: (row.director_framing as string) || '',
    executiveFraming: (row.executive_framing as string) || null,
  };
}

function mapActionItem(row: Record<string, unknown>): ActionItem {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    assigneeId: row.assignee_id as string,
    assigneeName: (row.assignee_name as string) || '',
    dueDate: (row.due_date as string) || '',
    status: row.status as ActionItem['status'],
    priority: row.priority as ActionItem['priority'],
    sourceMeetingId: (row.source_meeting_id as string) || '',
    sourceMeetingDate: (row.source_meeting_date as string) || '',
    sourceItemNumber: (row.source_item_number as string) || '',
    completionNotes: (row.completion_notes as string) || null,
  };
}

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as Notification['type'],
    title: row.title as string,
    body: (row.body as string) || '',
    referenceType: (row.reference_type as string) || '',
    referenceId: (row.reference_id as string) || '',
    isRead: (row.is_read as boolean) || false,
    createdAt: row.created_at as string,
  };
}

function mapNotebookEntry(row: Record<string, unknown>): NotebookEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    meetingId: (row.meeting_id as string) || '',
    agendaItemId: (row.agenda_item_id as string) || '',
    title: (row.title as string) || '',
    content: row.content as string,
    isStarred: (row.is_starred as boolean) || false,
    source: row.source as NotebookEntry['source'],
    sourceReferenceId: (row.source_reference_id as string) || null,
    tags: (row.tags as string[]) || [],
    createdAt: row.created_at as string,
  };
}

function mapDocumentRead(row: Record<string, unknown>): DocumentRead {
  return {
    id: row.id as string,
    documentId: row.document_id as string,
    userId: row.user_id as string,
    markedAsRead: (row.marked_as_read as boolean) || false,
    markedAt: (row.marked_at as string) || '',
  };
}

// ── Read Hooks ──

export function useSupabaseMeeting(meetingId: string): Meeting {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!meetingId) return;

    async function fetchMeeting() {
      // Fetch the meeting
      const { data: meetingRow } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .is('deleted_at', null)
        .single();

      if (!meetingRow) return;

      const mapped = mapMeeting(meetingRow);
      mapped.daysUntil = computeDaysUntil(mapped.date);

      // Look up committee name for context (not stored on Meeting type but useful)
      // Fetch previous meeting in same committee for previousMeeting field
      const { data: prevMeetings } = await supabase
        .from('meetings')
        .select('id, date, status')
        .eq('committee_id', meetingRow.committee_id)
        .is('deleted_at', null)
        .lt('date', meetingRow.date)
        .order('date', { ascending: false })
        .limit(1);

      if (prevMeetings && prevMeetings.length > 0) {
        const prev = prevMeetings[0];
        mapped.previousMeeting = {
          id: prev.id,
          date: prev.date,
          minutesStatus: prev.status,
        };
      }

      setMeeting(mapped);
    }

    fetchMeeting();
  }, [meetingId, supabase]);

  return meeting!;
}

export function useSupabaseAgendaItems(meetingId: string, _userId?: string): AgendaItem[] {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!meetingId) return;

    async function fetchItems() {
      // 1. Fetch agenda items
      const { data: aiRows } = await supabase
        .from('agenda_items')
        .select('*')
        .eq('meeting_id', meetingId)
        .is('deleted_at', null)
        .order('sort_order');

      if (!aiRows || aiRows.length === 0) {
        setItems([]);
        return;
      }

      const itemIds = aiRows.map((r: Record<string, unknown>) => r.id as string);

      // 2. Fetch presenters for all items (join with org_memberships + users)
      const { data: presenterRows } = await supabase
        .from('agenda_item_presenters')
        .select(`
          id,
          agenda_item_id,
          org_membership_id,
          external_name,
          external_title,
          sort_order,
          org_memberships:org_membership_id (
            user_id,
            title,
            users:user_id ( full_name )
          )
        `)
        .in('agenda_item_id', itemIds)
        .order('sort_order');

      // 3. Fetch documents for all items
      const { data: docRows } = await supabase
        .from('documents')
        .select('*')
        .in('agenda_item_id', itemIds)
        .is('deleted_at', null)
        .order('sort_order');

      // 4. Fetch IQ analyses for all items
      const { data: iqRows } = await supabase
        .from('iq_analyses')
        .select('*')
        .in('agenda_item_id', itemIds);

      // 5. Fetch IQ questions for analyses
      const iqAnalysisIds = (iqRows || []).map((r: Record<string, unknown>) => r.id as string);
      let iqQuestionRows: Record<string, unknown>[] = [];
      if (iqAnalysisIds.length > 0) {
        const { data } = await supabase
          .from('iq_questions')
          .select('*')
          .in('iq_analysis_id', iqAnalysisIds)
          .order('sort_order');
        iqQuestionRows = (data || []) as Record<string, unknown>[];
      }

      // Group presenters by agenda_item_id
      const presentersByItem: Record<string, Presenter[]> = {};
      for (const row of (presenterRows || []) as Record<string, unknown>[]) {
        const itemId = row.agenda_item_id as string;
        if (!presentersByItem[itemId]) presentersByItem[itemId] = [];
        const om = row.org_memberships as Record<string, unknown> | null;
        const mapped: Presenter = {
          userId: om ? (om.user_id as string) : '',
          name: om
            ? ((om.users as Record<string, unknown>)?.full_name as string) || ''
            : (row.external_name as string) || 'External Presenter',
          title: om
            ? (om.title as string) || ''
            : (row.external_title as string) || '',
          isExternal: !om,
        };
        presentersByItem[itemId].push(mapped);
      }

      // Group documents by agenda_item_id
      const docsByItem: Record<string, Document[]> = {};
      for (const row of (docRows || []) as Record<string, unknown>[]) {
        const itemId = row.agenda_item_id as string;
        if (!docsByItem[itemId]) docsByItem[itemId] = [];
        docsByItem[itemId].push(mapDocument(row));
      }

      // Group IQ questions by iq_analysis_id
      const questionsByAnalysis: Record<string, IQQuestion[]> = {};
      for (const row of iqQuestionRows) {
        const analysisId = row.iq_analysis_id as string;
        if (!questionsByAnalysis[analysisId]) questionsByAnalysis[analysisId] = [];
        questionsByAnalysis[analysisId].push(mapIQQuestion(row));
      }

      // Map IQ analyses by agenda_item_id
      const iqByItem: Record<string, IQAnalysis> = {};
      for (const row of (iqRows || []) as Record<string, unknown>[]) {
        const itemId = row.agenda_item_id as string;
        const analysisId = row.id as string;
        iqByItem[itemId] = mapIQAnalysis(row, questionsByAnalysis[analysisId] || []);
      }

      // Assemble final items
      const mapped = aiRows.map((row: Record<string, unknown>) => {
        const id = row.id as string;
        return mapAgendaItem(
          row,
          presentersByItem[id] || [],
          docsByItem[id] || [],
          iqByItem[id] || null
        );
      });

      setItems(mapped);
    }

    fetchItems();
  }, [meetingId, supabase]);

  return items;
}

export function useSupabaseDocuments(itemId: string): Document[] {
  const [docs, setDocs] = useState<Document[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!itemId) return;

    supabase
      .from('documents')
      .select('*')
      .eq('agenda_item_id', itemId)
      .is('deleted_at', null)
      .order('sort_order')
      .then(({ data }) => {
        if (data) {
          setDocs((data as Record<string, unknown>[]).map(mapDocument));
        }
      });
  }, [itemId, supabase]);

  return docs;
}

export function useSupabaseDocumentReads(meetingId: string, userId: string): DocumentRead[] {
  const [reads, setReads] = useState<DocumentRead[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!meetingId || !userId) return;

    async function fetchReads() {
      // Get all documents for this meeting, then their read status
      const { data: docRows } = await supabase
        .from('documents')
        .select('id, agenda_items!inner(meeting_id)')
        .eq('agenda_items.meeting_id', meetingId)
        .is('deleted_at', null);

      if (!docRows || docRows.length === 0) {
        setReads([]);
        return;
      }

      const docIds = (docRows as Record<string, unknown>[]).map(r => r.id as string);

      const { data: readRows } = await supabase
        .from('document_reads')
        .select('*')
        .in('document_id', docIds)
        .eq('user_id', userId);

      // Build a map of existing reads
      const readMap: Record<string, Record<string, unknown>> = {};
      for (const row of (readRows || []) as Record<string, unknown>[]) {
        readMap[row.document_id as string] = row;
      }

      // Return a DocumentRead for each doc (read or not)
      const result: DocumentRead[] = docIds.map(docId => {
        const readRow = readMap[docId];
        if (readRow) {
          return mapDocumentRead(readRow);
        }
        return {
          id: `unread_${docId}_${userId}`,
          documentId: docId,
          userId,
          markedAsRead: false,
          markedAt: '',
        };
      });

      setReads(result);
    }

    fetchReads();
  }, [meetingId, userId, supabase]);

  return reads;
}

export function useSupabaseIQAnalysis(itemId: string): IQAnalysis | null {
  const [analysis, setAnalysis] = useState<IQAnalysis | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!itemId) return;

    async function fetch() {
      const { data: row } = await supabase
        .from('iq_analyses')
        .select('*')
        .eq('agenda_item_id', itemId)
        .maybeSingle();

      if (!row) {
        setAnalysis(null);
        return;
      }

      const { data: questionRows } = await supabase
        .from('iq_questions')
        .select('*')
        .eq('agenda_item_id', itemId)
        .order('sort_order');

      const questions = ((questionRows || []) as Record<string, unknown>[]).map(mapIQQuestion);
      setAnalysis(mapIQAnalysis(row as Record<string, unknown>, questions));
    }

    fetch();
  }, [itemId, supabase]);

  return analysis;
}

export function useSupabaseIQQuestions(itemId: string): IQQuestion[] {
  const [questions, setQuestions] = useState<IQQuestion[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!itemId) return;

    supabase
      .from('iq_questions')
      .select('*')
      .eq('agenda_item_id', itemId)
      .order('sort_order')
      .then(({ data }) => {
        if (data) {
          setQuestions((data as Record<string, unknown>[]).map(mapIQQuestion));
        }
      });
  }, [itemId, supabase]);

  return questions;
}

export function useSupabaseActionItems(orgId: string): ActionItem[] {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!orgId) return;

    async function fetchActions() {
      // Join with org_memberships + users for assignee name,
      // and with meetings + agenda_items for source info
      const { data: rows } = await supabase
        .from('action_items')
        .select(`
          *,
          assignee:assignee_id (
            user_id,
            users:user_id ( full_name )
          ),
          source_meeting:source_meeting_id ( date ),
          source_item:source_item_id ( item_number )
        `)
        .eq('org_id', orgId)
        .is('deleted_at', null)
        .order('due_date');

      if (!rows) {
        setActions([]);
        return;
      }

      const mapped = (rows as Record<string, unknown>[]).map(row => {
        const assignee = row.assignee as Record<string, unknown> | null;
        const sourceMeeting = row.source_meeting as Record<string, unknown> | null;
        const sourceItem = row.source_item as Record<string, unknown> | null;

        return {
          ...mapActionItem(row),
          assigneeName: assignee
            ? ((assignee.users as Record<string, unknown>)?.full_name as string) || ''
            : '',
          sourceMeetingDate: sourceMeeting ? (sourceMeeting.date as string) || '' : '',
          sourceItemNumber: sourceItem ? (sourceItem.item_number as string) || '' : '',
        };
      });

      setActions(mapped);
    }

    fetchActions();
  }, [orgId, supabase]);

  return actions;
}

export function useSupabaseNotifications(userId: string): Notification[] {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!userId) return;

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setNotifications((data as Record<string, unknown>[]).map(mapNotification));
        }
      });
  }, [userId, supabase]);

  return notifications;
}

export function useSupabaseNotebookEntries(userId: string, meetingId?: string): NotebookEntry[] {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!userId) return;

    let query = supabase
      .from('notebook_entries')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (meetingId) {
      query = query.eq('meeting_id', meetingId);
    }

    query.then(({ data }) => {
      if (data) {
        setEntries((data as Record<string, unknown>[]).map(mapNotebookEntry));
      }
    });
  }, [userId, meetingId, supabase]);

  return entries;
}

export function useSupabaseBoardReadiness(meetingId: string): BoardMemberReadiness[] {
  const [readiness, setReadiness] = useState<BoardMemberReadiness[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!meetingId) return;

    async function fetchReadiness() {
      // 1. Get all doc IDs for this meeting
      const { data: docRows } = await supabase
        .from('documents')
        .select('id, agenda_items!inner(meeting_id)')
        .eq('agenda_items.meeting_id', meetingId)
        .is('deleted_at', null);

      const docIds = ((docRows || []) as Record<string, unknown>[]).map(r => r.id as string);
      const docsTotal = docIds.length;

      // 2. Get board member attendees for this meeting
      const { data: attendeeRows } = await supabase
        .from('meeting_attendees')
        .select(`
          org_membership_id,
          org_memberships:org_membership_id (
            user_id,
            role,
            users:user_id ( id, full_name )
          )
        `)
        .eq('meeting_id', meetingId);

      // Filter to board_member role
      const boardMembers: { userId: string; userName: string }[] = [];
      for (const row of (attendeeRows || []) as Record<string, unknown>[]) {
        const om = row.org_memberships as Record<string, unknown> | null;
        if (!om || om.role !== 'board_member') continue;
        const user = om.users as Record<string, unknown> | null;
        if (!user) continue;
        boardMembers.push({
          userId: user.id as string,
          userName: user.full_name as string,
        });
      }

      // 3. Get read counts for each board member
      if (docIds.length === 0) {
        setReadiness(
          boardMembers.map(m => ({
            userId: m.userId,
            userName: m.userName,
            docsRead: 0,
            docsTotal: 0,
            percentage: 0,
          }))
        );
        return;
      }

      const { data: readRows } = await supabase
        .from('document_reads')
        .select('user_id, document_id')
        .in('document_id', docIds)
        .eq('marked_as_read', true);

      // Count reads per user
      const readCounts: Record<string, number> = {};
      for (const row of (readRows || []) as Record<string, unknown>[]) {
        const uid = row.user_id as string;
        readCounts[uid] = (readCounts[uid] || 0) + 1;
      }

      const result: BoardMemberReadiness[] = boardMembers.map(m => {
        const docsRead = readCounts[m.userId] || 0;
        return {
          userId: m.userId,
          userName: m.userName,
          docsRead,
          docsTotal,
          percentage: docsTotal > 0 ? Math.round((docsRead / docsTotal) * 100) : 0,
        };
      });

      setReadiness(result);
    }

    fetchReadiness();
  }, [meetingId, supabase]);

  return readiness;
}

export function useSupabaseBriefingNarrative(
  meetingId: string,
  userId: string,
  mode: BriefingMode | string
): string {
  const [narrative, setNarrative] = useState<string>('');
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!meetingId || !userId) return;

    supabase
      .from('meetings')
      .select('briefing_summary')
      .eq('id', meetingId)
      .single()
      .then(({ data }) => {
        if (!data || !data.briefing_summary) {
          setNarrative('');
          return;
        }

        const summary = data.briefing_summary as Record<string, unknown>;

        // Check director narratives
        const director = summary.director as Record<string, Record<string, string>> | undefined;
        if (director && director[userId]) {
          setNarrative((mode === 'prep' ? director[userId].prep : director[userId].day) || '');
          return;
        }

        // Check executive narratives
        const executive = summary.executive as Record<string, Record<string, string>> | undefined;
        if (executive && executive[userId]) {
          setNarrative((mode === 'prep' ? executive[userId].prep : executive[userId].day) || '');
          return;
        }

        setNarrative('');
      });
  }, [meetingId, userId, mode, supabase]);

  return narrative;
}

// ── Write Operations ──

export function useSupabaseDataOperations() {
  const supabase = useSupabaseClient();

  const markDocumentRead = useCallback(
    async (docId: string, userId: string) => {
      await supabase.from('document_reads').upsert(
        {
          document_id: docId,
          user_id: userId,
          marked_as_read: true,
          marked_at: new Date().toISOString(),
          first_opened_at: new Date().toISOString(),
        },
        { onConflict: 'document_id,user_id' }
      );
    },
    [supabase]
  );

  const castVote = useCallback(
    async (itemId: string, userId: string, value: string) => {
      // Need to look up the org_membership_id for this user
      const { data: membership } = await supabase
        .from('org_memberships')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(1)
        .single();

      if (!membership) return;

      await supabase.from('votes').upsert(
        {
          agenda_item_id: itemId,
          org_membership_id: membership.id,
          vote_value: value,
          cast_at: new Date().toISOString(),
        },
        { onConflict: 'agenda_item_id,org_membership_id' }
      );
    },
    [supabase]
  );

  const addNotebookEntry = useCallback(
    async (entry: Partial<NotebookEntry>) => {
      // Look up org_id from the meeting if available
      let orgId: string | undefined;
      if (entry.meetingId) {
        const { data: meeting } = await supabase
          .from('meetings')
          .select('org_id')
          .eq('id', entry.meetingId)
          .single();
        orgId = meeting?.org_id;
      }

      if (!orgId) {
        // Fallback: get org from user's membership
        const { data: membership } = await supabase
          .from('org_memberships')
          .select('org_id')
          .eq('user_id', entry.userId || '')
          .eq('status', 'active')
          .is('deleted_at', null)
          .limit(1)
          .single();
        orgId = membership?.org_id;
      }

      await supabase.from('notebook_entries').insert({
        user_id: entry.userId || '',
        org_id: orgId || '',
        meeting_id: entry.meetingId || null,
        agenda_item_id: entry.agendaItemId || null,
        title: entry.title || '',
        content: entry.content || '',
        is_starred: entry.isStarred || false,
        source: entry.source || 'manual',
        source_reference_id: entry.sourceReferenceId || null,
        tags: entry.tags || [],
      });
    },
    [supabase]
  );

  const saveIQQuestion = useCallback(
    async (questionId: string, userId: string) => {
      await supabase.from('iq_question_interactions').upsert(
        {
          iq_question_id: questionId,
          user_id: userId,
          action: 'starred',
        },
        { onConflict: 'iq_question_id,user_id,action' }
      );
    },
    [supabase]
  );

  const dismissIQQuestion = useCallback(
    async (questionId: string, userId: string) => {
      await supabase.from('iq_question_interactions').upsert(
        {
          iq_question_id: questionId,
          user_id: userId,
          action: 'dismissed',
        },
        { onConflict: 'iq_question_id,user_id,action' }
      );
    },
    [supabase]
  );

  const markNotificationRead = useCallback(
    async (notifId: string) => {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notifId);
    },
    [supabase]
  );

  const addAgendaItem = useCallback(
    async (meetingId: string, item: Partial<AgendaItem>) => {
      // Look up org_id from meeting
      const { data: meeting } = await supabase
        .from('meetings')
        .select('org_id')
        .eq('id', meetingId)
        .single();

      if (!meeting) return;

      // Get max sort_order for this meeting
      const { data: maxRow } = await supabase
        .from('agenda_items')
        .select('sort_order')
        .eq('meeting_id', meetingId)
        .is('deleted_at', null)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const nextSort = (maxRow?.sort_order || 0) + 1;

      await supabase.from('agenda_items').insert({
        meeting_id: meetingId,
        org_id: meeting.org_id,
        item_number: item.itemNumber || `${nextSort}.0`,
        sort_order: nextSort,
        phase: item.phase || 'Other',
        phase_sort_order: item.phaseSortOrder || 1,
        title: item.title || 'New Agenda Item',
        description: item.description || '',
        action_type: item.actionType || 'noting',
        scheduled_start: item.scheduledStart || null,
        duration_minutes: item.durationMinutes || 10,
        confidentiality: item.confidentiality || 'standard',
        voting_enabled: item.votingEnabled || false,
        motion_text: item.motionText || null,
        voting_options: item.votingOptions || null,
        paper_status: item.paperStatus || 'not_started',
        paper_owner_id: item.paperOwnerId || null,
        paper_deadline: item.paperDeadline || null,
        secretariat_notes: item.secretariatNotes || null,
        iq_status: item.iqStatus || 'not_available',
      });
    },
    [supabase]
  );

  const updateAgendaItem = useCallback(
    async (itemId: string, updates: Partial<AgendaItem>) => {
      // Map camelCase updates to snake_case columns
      const dbUpdates: Record<string, unknown> = {};
      const fieldMap: Record<string, string> = {
        itemNumber: 'item_number',
        sortOrder: 'sort_order',
        phase: 'phase',
        phaseSortOrder: 'phase_sort_order',
        title: 'title',
        description: 'description',
        actionType: 'action_type',
        scheduledStart: 'scheduled_start',
        durationMinutes: 'duration_minutes',
        confidentiality: 'confidentiality',
        votingEnabled: 'voting_enabled',
        motionText: 'motion_text',
        votingOptions: 'voting_options',
        paperStatus: 'paper_status',
        paperOwnerId: 'paper_owner_id',
        paperDeadline: 'paper_deadline',
        secretariatNotes: 'secretariat_notes',
        iqStatus: 'iq_status',
      };

      for (const [camelKey, snakeKey] of Object.entries(fieldMap)) {
        if (camelKey in updates) {
          dbUpdates[snakeKey] = (updates as Record<string, unknown>)[camelKey];
        }
      }

      if (Object.keys(dbUpdates).length > 0) {
        await supabase
          .from('agenda_items')
          .update(dbUpdates)
          .eq('id', itemId);
      }
    },
    [supabase]
  );

  const updateActionItem = useCallback(
    async (itemId: string, updates: Partial<ActionItem>) => {
      const dbUpdates: Record<string, unknown> = {};
      const fieldMap: Record<string, string> = {
        title: 'title',
        description: 'description',
        dueDate: 'due_date',
        status: 'status',
        priority: 'priority',
        completionNotes: 'completion_notes',
      };

      for (const [camelKey, snakeKey] of Object.entries(fieldMap)) {
        if (camelKey in updates) {
          dbUpdates[snakeKey] = (updates as Record<string, unknown>)[camelKey];
        }
      }

      if (updates.status === 'complete') {
        dbUpdates.completed_at = new Date().toISOString();
      }

      if (Object.keys(dbUpdates).length > 0) {
        await supabase
          .from('action_items')
          .update(dbUpdates)
          .eq('id', itemId);
      }
    },
    [supabase]
  );

  return {
    markDocumentRead,
    castVote,
    addNotebookEntry,
    saveIQQuestion,
    dismissIQQuestion,
    markNotificationRead,
    addAgendaItem,
    updateAgendaItem,
    updateActionItem,
  };
}
