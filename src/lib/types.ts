// BoardIQ — TypeScript Types
// Derived from data-model.md and mock-data.js

// ── String Union Types ──

export type UserRole = 'board_member' | 'executive' | 'secretariat' | 'presenter' | 'observer';

export type ActionType = 'decision' | 'discussion' | 'noting' | 'approval' | 'information';

export type IQSeverity = 'alert' | 'watch' | 'ready' | 'good';

export type PaperStatus = 'not_started' | 'awaiting_upload' | 'draft' | 'in_review' | 'complete';

export type MeetingStatus = 'draft' | 'review' | 'published' | 'in_progress' | 'concluded' | 'minutes_draft' | 'minutes_review' | 'minutes_published';

export type MeetingType = 'regular' | 'special' | 'ad_hoc';

export type VotingStatus = 'not_started' | 'open' | 'closed';

export type Confidentiality = 'standard' | 'restricted' | 'board_only' | 'closed_session';

export type ActionItemStatus = 'not_started' | 'in_progress' | 'complete' | 'deferred' | 'cancelled' | 'overdue';

export type ActionItemPriority = 'low' | 'medium' | 'high';

export type IQStatus = 'not_available' | 'processing' | 'ready' | 'updated' | 'error';

export type ProcessingStatus = 'pending' | 'extracting' | 'analysing' | 'ready' | 'error';

export type NotificationType =
  | 'meeting_published'
  | 'document_uploaded'
  | 'agenda_changed'
  | 'pre_read_reminder'
  | 'voting_opened'
  | 'voting_closed'
  | 'minutes_published'
  | 'action_assigned'
  | 'action_due_soon'
  | 'paper_deadline'
  | 'nudge';

export type NotebookSource = 'manual' | 'iq_question' | 'iq_chat' | 'during_meeting';

export type ClaimConfidence = 'high' | 'partial' | 'low';

export type RiskSeverity = 'high' | 'medium' | 'low';

export type QuorumType = 'count' | 'percentage';

export type VotingResultsVisibility = 'live' | 'after_close';

export type BriefingMode = 'prep' | 'day';

export type IQQuestionCategory = 'strategic' | 'financial' | 'risk' | 'governance' | 'operational' | 'people';

export type RelationshipType = 'contradiction' | 'financial_dependency' | 'risk_gap' | 'kpi_reference';

// ── Interfaces ──

export interface OrganisationSettings {
  preReadReminderDays: number;
  paperDeadlineDays: number;
  watermarkEnabled: boolean;
  downloadEnabled: boolean;
  votingResultsVisibility: VotingResultsVisibility;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string;
  timezone: string;
  financialYearStart: number;
  logoUrl: string | null;
  settings: OrganisationSettings;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  role: UserRole;
  title: string;
  isChair?: boolean;
  committees: string[];
  bio: string;
  avatarInitials: string;
}

export interface OrgMembership {
  id: string;
  orgId: string;
  userId: string;
  role: UserRole;
  title: string;
  isChair: boolean;
  isDeputyChair: boolean;
  isCompanySecretary: boolean;
  status: 'invited' | 'active' | 'deactivated';
}

export interface Committee {
  id: string;
  name: string;
  slug: string;
  isFullBoard: boolean;
  quorumCount: number;
  quorumType: QuorumType;
  meetingFrequency: string;
  description: string;
}

export interface PreviousMeeting {
  id: string;
  date: string;
  minutesStatus: string;
}

export interface Meeting {
  id: string;
  orgId: string;
  committeeId: string;
  title: string | null;
  meetingType: MeetingType;
  status: MeetingStatus;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  locationName: string;
  locationAddress: string;
  virtualLink: string | null;
  publishedAt: string;
  preReadDeadline: string;
  paperDeadline: string;
  daysUntil: number;
  previousMeeting: PreviousMeeting;
}

export interface Presenter {
  userId: string;
  name: string;
  title: string;
  isExternal: boolean;
}

export interface Document {
  id: string;
  filename: string;
  fileType: string;
  pageCount: number;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  processingStatus: ProcessingStatus;
  version: number;
  summary: string;
}

export interface IQClaim {
  claim: string;
  sourceCited: boolean;
  sourceDocId: string;
  sourcePage: number;
  consistentWithPrior: boolean;
  flags: string[];
  confidence: ClaimConfidence;
}

export interface IQAssumption {
  assumption: string;
  severity: RiskSeverity;
  detail: string;
}

export interface IQRiskFlag {
  flag: string;
  severity: RiskSeverity;
  detail: string;
  relatedItemIds: string[];
}

export interface IQDataQuality {
  issue: string;
  detail: string;
  sourceDocId: string;
}

export interface IQRelatedItem {
  agendaItemId: string;
  relationshipType: RelationshipType;
  detail: string;
}

export interface IQQuestion {
  id: string;
  questionText: string;
  rationale: string;
  category: IQQuestionCategory;
  priority: number;
  directorFraming: string;
  executiveFraming: string | null;
}

export interface IQAnalysis {
  id: string;
  headline: string;
  severity: IQSeverity;
  detail: string;
  claims: IQClaim[];
  assumptions: IQAssumption[];
  riskFlags: IQRiskFlag[];
  dataQuality: IQDataQuality[];
  relatedItems: IQRelatedItem[];
  questions: IQQuestion[];
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  itemNumber: string;
  sortOrder: number;
  phase: string;
  phaseSortOrder: number;
  title: string;
  description: string;
  actionType: ActionType;
  scheduledStart: string;
  durationMinutes: number;
  confidentiality: Confidentiality;
  votingEnabled: boolean;
  motionText: string | null;
  votingOptions: string[] | null;
  paperStatus: PaperStatus;
  paperOwnerId: string | null;
  paperDeadline: string | null;
  secretariatNotes: string | null;
  iqStatus: IQStatus;
  presenters: Presenter[];
  documents: Document[];
  iqAnalysis: IQAnalysis | null;
}

export interface DocumentReadRecord {
  read: boolean;
  markedAt?: string;
}

export interface DocumentReads {
  [userId: string]: {
    [documentId: string]: DocumentReadRecord;
  };
}

export interface DocumentRead {
  id: string;
  documentId: string;
  userId: string;
  markedAsRead: boolean;
  markedAt: string;
}

export interface Vote {
  id: string;
  agendaItemId: string;
  userId: string;
  value: string;
  castAt: string;
}

export interface NotebookEntry {
  id: string;
  userId: string;
  meetingId: string;
  agendaItemId: string;
  title: string;
  content: string;
  isStarred: boolean;
  source: NotebookSource;
  sourceReferenceId: string | null;
  tags: string[];
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  status: ActionItemStatus;
  priority: ActionItemPriority;
  sourceMeetingId: string;
  sourceMeetingDate: string;
  sourceItemNumber: string;
  completionNotes: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceType: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface BriefingNarratives {
  director: {
    [userId: string]: {
      prep: string;
      day: string;
    };
  };
  executive: {
    [userId: string]: {
      prep: string;
      day?: string;
    };
  };
}

export interface BoardMemberReadiness {
  userId: string;
  userName: string;
  docsRead: number;
  docsTotal: number;
  percentage: number;
}

export interface IQQuestionInteraction {
  questionId: string;
  userId: string;
  starred: boolean;
  dismissed: boolean;
}
