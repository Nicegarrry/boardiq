-- BoardIQ — Initial Schema Migration
-- Data Model v1.0
-- Generated from docs/boardiq-data-model.md
--
-- Tables created in dependency order. All IDs are uuid with gen_random_uuid().
-- Enums enforced via CHECK constraints (easier to evolve than Postgres enum types).
-- Soft deletes via deleted_at timestamptz on all main entities.

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Trigger function: auto-update updated_at on row modification.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. IDENTITY & ORGANISATION
-- ============================================================================

-- 1.1 users — extends auth.users with profile data
CREATE TABLE public.users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL UNIQUE,
  full_name       text NOT NULL,
  display_name    text,
  avatar_url      text,
  phone           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 1.2 organisations
CREATE TABLE public.organisations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  logo_url              text,
  description           text,
  timezone              text NOT NULL DEFAULT 'Australia/Sydney',
  financial_year_start  integer NOT NULL DEFAULT 7 CHECK (financial_year_start BETWEEN 1 AND 12),
  settings              jsonb NOT NULL DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE TRIGGER trg_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 1.3 org_memberships — core permission junction
CREATE TABLE public.org_memberships (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id               uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role                  text NOT NULL CHECK (role IN (
                          'secretariat', 'board_member', 'executive',
                          'presenter', 'observer')),
  title                 text,
  is_chair              boolean NOT NULL DEFAULT false,
  is_deputy_chair       boolean NOT NULL DEFAULT false,
  is_company_secretary  boolean NOT NULL DEFAULT false,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN (
                          'invited', 'active', 'deactivated')),
  invited_at            timestamptz,
  activated_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz,
  UNIQUE(org_id, user_id)
);

CREATE TRIGGER trg_org_memberships_updated_at
  BEFORE UPDATE ON public.org_memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Helper: returns org IDs where the current auth user has an active membership.
-- Used by RLS policies throughout the schema.
-- Defined after org_memberships table exists.
CREATE OR REPLACE FUNCTION public.auth_org_ids()
RETURNS uuid[] AS $$
  SELECT coalesce(array_agg(org_id), '{}')
  FROM public.org_memberships
  WHERE user_id = auth.uid()
    AND status = 'active'
    AND deleted_at IS NULL
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1.4 permission_overrides
CREATE TABLE public.permission_overrides (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_membership_id     uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  capability            text NOT NULL,
  granted               boolean NOT NULL DEFAULT true,
  scope_type            text CHECK (scope_type IN ('committee', 'meeting') OR scope_type IS NULL),
  scope_id              uuid,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. COMMITTEES
-- ============================================================================

-- 2.1 committees
CREATE TABLE public.committees (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name              text NOT NULL,
  slug              text NOT NULL,
  description       text,
  is_full_board     boolean NOT NULL DEFAULT false,
  quorum_count      integer,
  quorum_type       text NOT NULL DEFAULT 'count' CHECK (quorum_type IN ('count', 'percentage')),
  meeting_frequency text,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz,
  UNIQUE(org_id, slug)
);

CREATE TRIGGER trg_committees_updated_at
  BEFORE UPDATE ON public.committees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2.2 committee_memberships
CREATE TABLE public.committee_memberships (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id          uuid NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
  org_membership_id     uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  role_in_committee     text NOT NULL DEFAULT 'member' CHECK (role_in_committee IN (
                          'chair', 'deputy_chair', 'member', 'observer', 'secretary')),
  is_default_attendee   boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz,
  UNIQUE(committee_id, org_membership_id)
);

-- ============================================================================
-- 3. MEETINGS
-- ============================================================================

-- 3.1 meeting_templates (must come before meetings which references it)
CREATE TABLE public.meeting_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  committee_id    uuid REFERENCES public.committees(id) ON DELETE SET NULL,
  name            text NOT NULL,
  description     text,
  template_data   jsonb NOT NULL,
  created_by      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

CREATE TRIGGER trg_meeting_templates_updated_at
  BEFORE UPDATE ON public.meeting_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3.2 meetings
CREATE TABLE public.meetings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  committee_id          uuid NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
  title                 text,
  meeting_type          text NOT NULL DEFAULT 'regular' CHECK (meeting_type IN (
                          'regular', 'special', 'ad_hoc')),
  status                text NOT NULL DEFAULT 'draft' CHECK (status IN (
                          'draft', 'review', 'published', 'in_progress',
                          'concluded', 'minutes_draft', 'minutes_review',
                          'minutes_published')),
  -- Scheduling
  date                  date NOT NULL,
  start_time            timestamptz NOT NULL,
  end_time              timestamptz,
  timezone              text,
  location_name         text,
  location_address      text,
  virtual_link          text,
  -- Publishing & lifecycle
  published_at          timestamptz,
  pre_read_deadline     timestamptz,
  started_at            timestamptz,
  concluded_at          timestamptz,
  minutes_published_at  timestamptz,
  -- Paper tracking
  paper_deadline        timestamptz,
  -- AI-generated content (cached)
  briefing_summary      jsonb,
  meeting_summary       text,
  -- Template
  template_id           uuid REFERENCES public.meeting_templates(id) ON DELETE SET NULL,
  created_by            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE TRIGGER trg_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3.3 meeting_attendees
CREATE TABLE public.meeting_attendees (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id          uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  org_membership_id   uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  attendance_status   text NOT NULL DEFAULT 'invited' CHECK (attendance_status IN (
                        'invited', 'confirmed', 'declined', 'present',
                        'absent', 'proxy')),
  proxy_for           uuid REFERENCES public.org_memberships(id) ON DELETE SET NULL,
  is_required         boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, org_membership_id)
);

CREATE TRIGGER trg_meeting_attendees_updated_at
  BEFORE UPDATE ON public.meeting_attendees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 4. AGENDA ITEMS
-- ============================================================================

-- 4.1 agenda_items
CREATE TABLE public.agenda_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id          uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  org_id              uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  -- Ordering & structure
  item_number         text NOT NULL,
  sort_order          integer NOT NULL,
  phase               text,
  phase_sort_order    integer NOT NULL DEFAULT 0,
  -- Content
  title               text NOT NULL,
  description         text,
  action_type         text NOT NULL CHECK (action_type IN (
                        'decision', 'discussion', 'noting',
                        'approval', 'information')),
  -- Timing
  scheduled_start     timestamptz,
  duration_minutes    integer,
  actual_start        timestamptz,
  actual_end          timestamptz,
  -- Access control
  confidentiality     text NOT NULL DEFAULT 'standard' CHECK (confidentiality IN (
                        'standard', 'restricted', 'board_only',
                        'closed_session')),
  -- Voting
  voting_enabled      boolean NOT NULL DEFAULT false,
  motion_text         text,
  voting_options      jsonb,
  voting_status       text NOT NULL DEFAULT 'not_started' CHECK (voting_status IN (
                        'not_started', 'open', 'closed')),
  voting_opened_at    timestamptz,
  voting_closed_at    timestamptz,
  -- Paper tracking
  paper_status        text NOT NULL DEFAULT 'not_started' CHECK (paper_status IN (
                        'not_started', 'awaiting_upload', 'draft',
                        'in_review', 'complete')),
  paper_owner_id      uuid REFERENCES public.org_memberships(id) ON DELETE SET NULL,
  paper_deadline      timestamptz,
  -- Secretariat notes
  secretariat_notes   text,
  -- IQ status
  iq_status           text NOT NULL DEFAULT 'not_available' CHECK (iq_status IN (
                        'not_available', 'processing', 'ready',
                        'updated', 'error')),
  iq_processed_at     timestamptz,
  created_by          uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz
);

CREATE TRIGGER trg_agenda_items_updated_at
  BEFORE UPDATE ON public.agenda_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4.2 agenda_item_presenters
CREATE TABLE public.agenda_item_presenters (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_item_id      uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  org_membership_id   uuid REFERENCES public.org_memberships(id) ON DELETE SET NULL,
  external_name       text,
  external_email      text,
  external_title      text,
  sort_order          integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- 4.3 agenda_item_attendees
CREATE TABLE public.agenda_item_attendees (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_item_id      uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  org_membership_id   uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  access_level        text NOT NULL DEFAULT 'full' CHECK (access_level IN (
                        'full', 'observer', 'excluded')),
  can_vote            boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(agenda_item_id, org_membership_id)
);

-- ============================================================================
-- 5. DOCUMENTS
-- ============================================================================

-- 5.4 library_folders (must come before documents which references it)
CREATE TABLE public.library_folders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  parent_id       uuid REFERENCES public.library_folders(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  sort_order      integer NOT NULL DEFAULT 0,
  access_roles    text[],
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

CREATE TRIGGER trg_library_folders_updated_at
  BEFORE UPDATE ON public.library_folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 5.1 documents
CREATE TABLE public.documents (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  agenda_item_id        uuid REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  library_folder_id     uuid REFERENCES public.library_folders(id) ON DELETE SET NULL,
  -- File metadata
  filename              text NOT NULL,
  file_type             text NOT NULL,
  file_size_bytes       bigint,
  page_count            integer,
  storage_path          text NOT NULL,
  storage_bucket        text NOT NULL DEFAULT 'documents',
  -- Processing
  processing_status     text NOT NULL DEFAULT 'pending' CHECK (processing_status IN (
                          'pending', 'extracting', 'analysing',
                          'ready', 'error')),
  extracted_text        text,
  text_chunks           jsonb,
  processing_error      text,
  processed_at          timestamptz,
  -- Version control
  version               integer NOT NULL DEFAULT 1,
  previous_version_id   uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  is_current            boolean NOT NULL DEFAULT true,
  -- Access control
  download_enabled      boolean NOT NULL DEFAULT true,
  watermark_enabled     boolean NOT NULL DEFAULT false,
  -- Metadata
  uploaded_by           uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  description           text,
  sort_order            integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 5.2 document_reads
CREATE TABLE public.document_reads (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id         uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id             uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  first_opened_at     timestamptz NOT NULL DEFAULT now(),
  last_opened_at      timestamptz,
  time_spent_seconds  integer NOT NULL DEFAULT 0,
  pages_viewed        integer NOT NULL DEFAULT 0,
  marked_as_read      boolean NOT NULL DEFAULT false,
  marked_at           timestamptz,
  UNIQUE(document_id, user_id)
);

-- 5.3 document_annotations
CREATE TABLE public.document_annotations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id       uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  page_number       integer,
  annotation_type   text CHECK (annotation_type IN (
                      'highlight', 'note', 'bookmark')),
  content           text,
  position_data     jsonb,
  color             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

CREATE TRIGGER trg_document_annotations_updated_at
  BEFORE UPDATE ON public.document_annotations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 6. IQ (INTELLIGENCE) SYSTEM
-- ============================================================================

-- 6.1 iq_analyses
CREATE TABLE public.iq_analyses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_item_id      uuid NOT NULL UNIQUE REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  org_id              uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  -- Analysis content (structured)
  claims              jsonb,
  assumptions         jsonb,
  risk_flags          jsonb,
  data_quality        jsonb,
  -- Cross-item intelligence
  related_items       jsonb,
  -- Summary content
  headline            text,
  severity            text CHECK (severity IN ('alert', 'watch', 'ready', 'good')),
  detail              text,
  executive_summary   text,
  -- Processing metadata
  model_used          text,
  prompt_version      text,
  source_doc_ids      uuid[],
  generated_at        timestamptz,
  regenerated_at      timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_iq_analyses_updated_at
  BEFORE UPDATE ON public.iq_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6.2 iq_questions
CREATE TABLE public.iq_questions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iq_analysis_id        uuid NOT NULL REFERENCES public.iq_analyses(id) ON DELETE CASCADE,
  agenda_item_id        uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  question_text         text NOT NULL,
  rationale             text,
  category              text CHECK (category IN (
                          'strategic', 'financial', 'risk',
                          'governance', 'operational', 'people')),
  priority              integer NOT NULL DEFAULT 0,
  source_claim_index    integer,
  director_framing      text,
  executive_framing     text,
  sort_order            integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 6.3 iq_question_interactions
CREATE TABLE public.iq_question_interactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iq_question_id      uuid NOT NULL REFERENCES public.iq_questions(id) ON DELETE CASCADE,
  user_id             uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action              text NOT NULL CHECK (action IN (
                        'starred', 'dismissed', 'saved_to_notebook')),
  notebook_entry_id   uuid,  -- FK added after notebook_entries table is created
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(iq_question_id, user_id, action)
);

-- 6.4 iq_chats
CREATE TABLE public.iq_chats (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_item_id    uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id            uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(agenda_item_id, user_id)
);

CREATE TRIGGER trg_iq_chats_updated_at
  BEFORE UPDATE ON public.iq_chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6.5 iq_chat_messages
CREATE TABLE public.iq_chat_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id         uuid NOT NULL REFERENCES public.iq_chats(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user', 'assistant')),
  content         text NOT NULL,
  citations       jsonb,
  model_used      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. VOTING
-- ============================================================================

CREATE TABLE public.votes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_item_id      uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  org_membership_id   uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  vote_value          text NOT NULL,
  cast_at             timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz,
  is_final            boolean NOT NULL DEFAULT false,
  ip_address          inet,
  UNIQUE(agenda_item_id, org_membership_id)
);

-- ============================================================================
-- 8. NOTEBOOK
-- ============================================================================

CREATE TABLE public.notebook_entries (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  meeting_id            uuid REFERENCES public.meetings(id) ON DELETE SET NULL,
  agenda_item_id        uuid REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  title                 text,
  content               text NOT NULL,
  is_starred            boolean NOT NULL DEFAULT false,
  source                text NOT NULL DEFAULT 'manual' CHECK (source IN (
                          'manual', 'iq_question', 'iq_chat', 'during_meeting')),
  source_reference_id   uuid,
  tags                  text[],
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE TRIGGER trg_notebook_entries_updated_at
  BEFORE UPDATE ON public.notebook_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Now add the deferred FK from iq_question_interactions to notebook_entries
ALTER TABLE public.iq_question_interactions
  ADD CONSTRAINT fk_iq_question_interactions_notebook_entry
  FOREIGN KEY (notebook_entry_id) REFERENCES public.notebook_entries(id) ON DELETE SET NULL;

-- ============================================================================
-- 9. ACTION ITEMS
-- ============================================================================

CREATE TABLE public.action_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  source_meeting_id     uuid REFERENCES public.meetings(id) ON DELETE SET NULL,
  source_item_id        uuid REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  follow_up_meeting_id  uuid REFERENCES public.meetings(id) ON DELETE SET NULL,
  title                 text NOT NULL,
  description           text,
  assignee_id           uuid NOT NULL REFERENCES public.org_memberships(id) ON DELETE CASCADE,
  due_date              date,
  status                text NOT NULL DEFAULT 'not_started' CHECK (status IN (
                          'not_started', 'in_progress', 'complete',
                          'deferred', 'cancelled')),
  priority              text NOT NULL DEFAULT 'medium' CHECK (priority IN (
                          'low', 'medium', 'high')),
  completed_at          timestamptz,
  completion_notes      text,
  created_by            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE TRIGGER trg_action_items_updated_at
  BEFORE UPDATE ON public.action_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 10. MINUTES
-- ============================================================================

-- 10.1 meeting_minutes
CREATE TABLE public.meeting_minutes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id      uuid NOT NULL UNIQUE REFERENCES public.meetings(id) ON DELETE CASCADE,
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN (
                    'draft', 'chair_review', 'board_review',
                    'approved', 'published')),
  approved_at     timestamptz,
  approved_by     uuid REFERENCES public.users(id) ON DELETE SET NULL,
  published_at    timestamptz,
  preamble        text,
  closing         text,
  created_by      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_meeting_minutes_updated_at
  BEFORE UPDATE ON public.meeting_minutes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 10.2 minute_items
CREATE TABLE public.minute_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  minutes_id            uuid NOT NULL REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  agenda_item_id        uuid NOT NULL REFERENCES public.agenda_items(id) ON DELETE CASCADE,
  attendees_for_item    text[],
  discussion_summary    text,
  decisions_made        jsonb,
  ai_draft              text,
  secretariat_notes     text,
  sort_order            integer,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_minute_items_updated_at
  BEFORE UPDATE ON public.minute_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 10.3 minute_versions
CREATE TABLE public.minute_versions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  minutes_id        uuid NOT NULL REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  version_number    integer NOT NULL,
  content_snapshot  jsonb NOT NULL,
  changed_by        uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  change_summary    text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. NOTIFICATIONS & AUDIT
-- ============================================================================

-- 11.1 notifications
CREATE TABLE public.notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            text NOT NULL CHECK (type IN (
                    'meeting_published', 'document_uploaded',
                    'agenda_changed', 'pre_read_reminder',
                    'voting_opened', 'voting_closed',
                    'minutes_published', 'action_assigned',
                    'action_due_soon', 'paper_deadline',
                    'nudge')),
  title           text NOT NULL,
  body            text,
  reference_type  text,
  reference_id    uuid,
  is_read         boolean NOT NULL DEFAULT false,
  read_at         timestamptz,
  email_sent      boolean NOT NULL DEFAULT false,
  email_sent_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 11.2 audit_log — immutable, append-only
CREATE TABLE public.audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES public.users(id) ON DELETE SET NULL,
  action          text NOT NULL,
  entity_type     text NOT NULL,
  entity_id       uuid NOT NULL,
  details         jsonb,
  ip_address      inet,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
-- No updated_at, no deleted_at — audit_log is append-only.

-- ============================================================================
-- 12. MESSAGING (Future — Schema Reserved)
-- ============================================================================

-- 12.1 message_threads
CREATE TABLE public.message_threads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  subject         text,
  thread_type     text CHECK (thread_type IN ('direct', 'group', 'meeting_linked')),
  meeting_id      uuid REFERENCES public.meetings(id) ON DELETE SET NULL,
  agenda_item_id  uuid REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  created_by      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_message_threads_updated_at
  BEFORE UPDATE ON public.message_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 12.2 message_participants
CREATE TABLE public.message_participants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id       uuid NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_read_at    timestamptz,
  UNIQUE(thread_id, user_id)
);

-- 12.3 messages
CREATE TABLE public.messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id       uuid NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content         text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

-- ============================================================================
-- 14. INDEXES (performance-critical, beyond standard FK indexes)
-- ============================================================================

-- Org membership lookups (used in every RLS check)
CREATE INDEX idx_org_memberships_user_active
  ON public.org_memberships(user_id, status) WHERE deleted_at IS NULL;

CREATE INDEX idx_org_memberships_org_role
  ON public.org_memberships(org_id, role) WHERE deleted_at IS NULL;

-- Meeting lookups
CREATE INDEX idx_meetings_org_date
  ON public.meetings(org_id, date DESC) WHERE deleted_at IS NULL;

CREATE INDEX idx_meetings_committee_status
  ON public.meetings(committee_id, status) WHERE deleted_at IS NULL;

-- Agenda items per meeting
CREATE INDEX idx_agenda_items_meeting_sort
  ON public.agenda_items(meeting_id, sort_order) WHERE deleted_at IS NULL;

-- Agenda item attendees (critical for RLS)
CREATE INDEX idx_aia_item_membership
  ON public.agenda_item_attendees(agenda_item_id, org_membership_id);

CREATE INDEX idx_aia_membership_access
  ON public.agenda_item_attendees(org_membership_id, access_level);

-- Documents per agenda item
CREATE INDEX idx_documents_item
  ON public.documents(agenda_item_id, sort_order) WHERE deleted_at IS NULL;

-- Document reads per user (unique enforced by table constraint, index for lookups)
CREATE INDEX idx_doc_reads_user
  ON public.document_reads(user_id, document_id);

-- IQ analyses per item (unique enforced by table constraint)
-- The UNIQUE on agenda_item_id already creates the index

-- Notifications per user (unread)
CREATE INDEX idx_notifications_user_unread
  ON public.notifications(user_id, is_read, created_at DESC);

-- Audit log by org and entity
CREATE INDEX idx_audit_org_entity
  ON public.audit_log(org_id, entity_type, entity_id, created_at DESC);

-- Action items by org and status
CREATE INDEX idx_actions_org_status
  ON public.action_items(org_id, status) WHERE deleted_at IS NULL;

-- Votes by item and member
CREATE INDEX idx_votes_item_member
  ON public.votes(agenda_item_id, org_membership_id);
