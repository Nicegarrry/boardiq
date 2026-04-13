# BoardIQ — Data Model v1.0

## Principles

**Multi-org from day one.** Every table that holds org-scoped data includes an `org_id` foreign key. Row Level Security policies on Supabase enforce that users only see data for organisations they belong to. No cross-org data leakage is possible at the database level.

**Soft deletes everywhere.** Board governance requires audit trails. Nothing is hard-deleted. All primary tables have `deleted_at` timestamp columns. Queries filter on `deleted_at IS NULL` by default.

**Timestamps on everything.** Every table has `created_at` and `updated_at` columns. `updated_at` is auto-maintained by a Supabase trigger. These feed the audit trail and activity feeds.

**UUIDs as primary keys.** Supabase default. All `id` columns are `uuid DEFAULT gen_random_uuid()`.

**Enums as check constraints**, not Postgres enum types (easier to evolve without migrations).

---

## 1. Identity & Organisation

### 1.1 `users`

Extends Supabase Auth's `auth.users`. This table holds profile data only — authentication is handled by Supabase Auth (magic links).

```
users
├── id                uuid PK (matches auth.users.id)
├── email             text NOT NULL UNIQUE
├── full_name         text NOT NULL
├── display_name      text          -- short name for UI (e.g. "Patricia")
├── avatar_url        text          -- profile image
├── phone             text
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

No org-level role here. Roles are per-org via `org_memberships`.

### 1.2 `organisations`

```
organisations
├── id                uuid PK
├── name              text NOT NULL
├── slug              text UNIQUE NOT NULL   -- URL-safe identifier
├── logo_url          text
├── description       text
├── timezone          text DEFAULT 'Australia/Sydney'
├── financial_year_start  integer DEFAULT 7  -- month (1-12)
├── settings          jsonb DEFAULT '{}'     -- flexible org-level config
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

`settings` JSONB holds configuration like: default meeting duration, pre-read reminder timing, watermarking enabled, download controls, etc. Avoids column sprawl for org preferences.

### 1.3 `org_memberships`

The core permission junction. Every user-org relationship lives here. A user can belong to multiple orgs with different roles.

```
org_memberships
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── user_id           uuid FK → users NOT NULL
├── role              text NOT NULL CHECK (role IN (
│                       'secretariat', 'board_member', 'executive',
│                       'presenter', 'observer'))
├── title             text          -- "Non-Executive Director", "CFO", etc.
├── is_chair          boolean DEFAULT false
├── is_deputy_chair   boolean DEFAULT false
├── is_company_secretary  boolean DEFAULT false
├── status            text DEFAULT 'active' CHECK (status IN (
│                       'invited', 'active', 'deactivated'))
├── invited_at        timestamptz
├── activated_at      timestamptz
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
├── UNIQUE(org_id, user_id)
```

**Why `role` is a single value not an array:** A person has one primary role per org. If they need capabilities from multiple roles (e.g. a director who's also the company secretary), they get the higher-privileged role plus specific capability overrides in `permission_overrides`.

### 1.4 `permission_overrides`

Handles exceptions to role-based defaults. E.g. an executive who can also vote, or a director who's observer-only on a specific committee.

```
permission_overrides
├── id                uuid PK
├── org_membership_id uuid FK → org_memberships NOT NULL
├── capability        text NOT NULL  -- 'can_vote', 'can_view_iq',
│                                    -- 'can_edit_agenda', etc.
├── granted           boolean NOT NULL DEFAULT true
├── scope_type        text  -- NULL = org-wide, 'committee', 'meeting'
├── scope_id          uuid  -- committee_id or meeting_id if scoped
├── created_at        timestamptz
```

---

## 2. Committees

### 2.1 `committees`

```
committees
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── name              text NOT NULL        -- "Full Board", "Audit", etc.
├── slug              text NOT NULL
├── description       text
├── is_full_board     boolean DEFAULT false -- special: all directors auto-members
├── quorum_count      integer              -- minimum attendees for quorum
├── quorum_type       text DEFAULT 'count' CHECK (quorum_type IN (
│                       'count', 'percentage'))
├── meeting_frequency text                 -- guidance: "Quarterly", "Monthly"
├── sort_order        integer DEFAULT 0
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
├── UNIQUE(org_id, slug)
```

### 2.2 `committee_memberships`

```
committee_memberships
├── id                uuid PK
├── committee_id      uuid FK → committees NOT NULL
├── org_membership_id uuid FK → org_memberships NOT NULL
├── role_in_committee text DEFAULT 'member' CHECK (role_in_committee IN (
│                       'chair', 'deputy_chair', 'member', 'observer',
│                       'secretary'))
├── is_default_attendee  boolean DEFAULT true  -- auto-invited to meetings
├── created_at        timestamptz
├── deleted_at        timestamptz
├── UNIQUE(committee_id, org_membership_id)
```

---

## 3. Meetings

### 3.1 `meetings`

The central organising entity. Everything radiates from here.

```
meetings
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── committee_id      uuid FK → committees NOT NULL
├── title             text           -- override display name, nullable
├── meeting_type      text DEFAULT 'regular' CHECK (meeting_type IN (
│                       'regular', 'special', 'ad_hoc'))
├── status            text DEFAULT 'draft' CHECK (status IN (
│                       'draft', 'review', 'published', 'in_progress',
│                       'concluded', 'minutes_draft', 'minutes_review',
│                       'minutes_published'))
│
│   -- Scheduling
├── date              date NOT NULL
├── start_time        timestamptz NOT NULL
├── end_time          timestamptz
├── timezone          text          -- inherits from org if null
├── location_name     text          -- "Level 3, Community Health Centre"
├── location_address  text
├── virtual_link      text          -- Zoom/Teams URL
│
│   -- Publishing & lifecycle
├── published_at      timestamptz
├── pre_read_deadline timestamptz   -- when papers should be read by
├── started_at        timestamptz   -- live meeting start
├── concluded_at      timestamptz
├── minutes_published_at timestamptz
│
│   -- Paper tracking
├── paper_deadline    timestamptz   -- when exec papers due to secretariat
│
│   -- AI-generated content (cached)
├── briefing_summary  jsonb         -- per-role AI briefing narratives
├── meeting_summary   text          -- post-processing overall summary
│
│   -- Template
├── template_id       uuid FK → meeting_templates  -- if created from template
│
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

**`briefing_summary` JSONB structure:**
```json
{
  "director": {
    "user_id_1": "Patricia, this meeting has 2 decisions...",
    "user_id_2": "James, you have no items requiring..."
  },
  "executive": {
    "user_id_3": "Michael, you're presenting 4 items..."
  },
  "general": "Today's board meeting covers 11 items..."
}
```

Personalised briefings are pre-generated per user when documents are processed, then cached here. Regenerated when documents change.

### 3.2 `meeting_attendees`

Tracks who is invited to the overall meeting and their attendance.

```
meeting_attendees
├── id                uuid PK
├── meeting_id        uuid FK → meetings NOT NULL
├── org_membership_id uuid FK → org_memberships NOT NULL
├── attendance_status text DEFAULT 'invited' CHECK (attendance_status IN (
│                       'invited', 'confirmed', 'declined', 'present',
│                       'absent', 'proxy'))
├── proxy_for         uuid FK → org_memberships  -- if attending as proxy
├── is_required       boolean DEFAULT true
├── created_at        timestamptz
├── updated_at        timestamptz
├── UNIQUE(meeting_id, org_membership_id)
```

Auto-populated from committee default attendees when meeting is created.

### 3.3 `meeting_templates`

```
meeting_templates
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── committee_id      uuid FK → committees
├── name              text NOT NULL
├── description       text
├── template_data     jsonb NOT NULL  -- serialised agenda structure
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

---

## 4. Agenda Items (Sessions)

### 4.1 `agenda_items`

The workhorse table. Each row is one agenda item / session within a meeting.

```
agenda_items
├── id                uuid PK
├── meeting_id        uuid FK → meetings NOT NULL
├── org_id            uuid FK → organisations NOT NULL  -- denormalised for RLS
│
│   -- Ordering & structure
├── item_number       text NOT NULL     -- "1.1", "4.2", display format
├── sort_order        integer NOT NULL  -- actual sort position
├── phase             text              -- "Opening", "Strategy", "Finance", etc.
├── phase_sort_order  integer DEFAULT 0 -- sort within phase grouping
│
│   -- Content
├── title             text NOT NULL
├── description       text              -- rich text / markdown
├── action_type       text NOT NULL CHECK (action_type IN (
│                       'decision', 'discussion', 'noting',
│                       'approval', 'information'))
│
│   -- Timing
├── scheduled_start   timestamptz       -- planned start time
├── duration_minutes  integer           -- allocated time
├── actual_start      timestamptz       -- live meeting tracking
├── actual_end        timestamptz
│
│   -- Access control
├── confidentiality   text DEFAULT 'standard' CHECK (confidentiality IN (
│                       'standard', 'restricted', 'board_only',
│                       'closed_session'))
│
│   -- Voting
├── voting_enabled    boolean DEFAULT false
├── motion_text       text              -- formal motion wording
├── voting_options    jsonb             -- ["Approve", "Reject", "Abstain"]
├── voting_status     text DEFAULT 'not_started' CHECK (voting_status IN (
│                       'not_started', 'open', 'closed'))
├── voting_opened_at  timestamptz
├── voting_closed_at  timestamptz
│
│   -- Paper tracking
├── paper_status      text DEFAULT 'not_started' CHECK (paper_status IN (
│                       'not_started', 'awaiting_upload', 'draft',
│                       'in_review', 'complete'))
├── paper_owner_id    uuid FK → org_memberships  -- exec responsible for paper
├── paper_deadline    timestamptz
│
│   -- Secretariat notes (internal, not shown to board)
├── secretariat_notes text
│
│   -- IQ status
├── iq_status         text DEFAULT 'not_available' CHECK (iq_status IN (
│                       'not_available', 'processing', 'ready',
│                       'updated', 'error'))
├── iq_processed_at   timestamptz
│
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

### 4.2 `agenda_item_presenters`

Multiple presenters per item. Includes external presenters who aren't org members.

```
agenda_item_presenters
├── id                uuid PK
├── agenda_item_id    uuid FK → agenda_items NOT NULL
├── org_membership_id uuid FK → org_memberships  -- NULL for externals
├── external_name     text    -- for non-members
├── external_email    text
├── external_title    text    -- "Partner, Goldman Sachs"
├── sort_order        integer DEFAULT 0
├── created_at        timestamptz
```

### 4.3 `agenda_item_attendees`

Per-session attendance control. Defaults from committee members but can be overridden per item — this is what controls which users see which sessions.

```
agenda_item_attendees
├── id                uuid PK
├── agenda_item_id    uuid FK → agenda_items NOT NULL
├── org_membership_id uuid FK → org_memberships NOT NULL
├── access_level      text DEFAULT 'full' CHECK (access_level IN (
│                       'full', 'observer', 'excluded'))
├── can_vote          boolean DEFAULT true   -- per-item vote permission
├── created_at        timestamptz
├── UNIQUE(agenda_item_id, org_membership_id)
```

**Critical for the permission model:** A board member excluded from a closed session (e.g. CEO performance review) gets `access_level = 'excluded'` and that session is invisible to them in the briefing view. This table is the source of truth for "who can see what."

---

## 5. Documents

### 5.1 `documents`

Every file uploaded to the platform.

```
documents
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL  -- for RLS
├── agenda_item_id    uuid FK → agenda_items           -- NULL if library doc
├── library_folder_id uuid FK → library_folders        -- NULL if meeting doc
│
│   -- File metadata
├── filename          text NOT NULL
├── file_type         text NOT NULL      -- 'pdf', 'docx', 'xlsx', 'pptx'
├── file_size_bytes   bigint
├── page_count        integer
├── storage_path      text NOT NULL      -- Supabase Storage path
├── storage_bucket    text DEFAULT 'documents'
│
│   -- Processing
├── processing_status text DEFAULT 'pending' CHECK (processing_status IN (
│                       'pending', 'extracting', 'analysing',
│                       'ready', 'error'))
├── extracted_text    text               -- full text extraction
├── text_chunks       jsonb              -- chunked text for embeddings
├── processing_error  text
├── processed_at      timestamptz
│
│   -- Version control
├── version           integer DEFAULT 1
├── previous_version_id uuid FK → documents
├── is_current        boolean DEFAULT true
│
│   -- Access control
├── download_enabled  boolean DEFAULT true
├── watermark_enabled boolean DEFAULT false
│
│   -- Metadata
├── uploaded_by       uuid FK → users NOT NULL
├── description       text
├── sort_order        integer DEFAULT 0
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

### 5.2 `document_reads`

Tracks which users have read which documents. Powers preparation progress tracking.

```
document_reads
├── id                uuid PK
├── document_id       uuid FK → documents NOT NULL
├── user_id           uuid FK → users NOT NULL
├── first_opened_at   timestamptz NOT NULL
├── last_opened_at    timestamptz
├── time_spent_seconds integer DEFAULT 0  -- cumulative reading time
├── pages_viewed      integer DEFAULT 0
├── marked_as_read    boolean DEFAULT false  -- explicit "mark as read"
├── marked_at         timestamptz
├── UNIQUE(document_id, user_id)
```

### 5.3 `document_annotations`

Personal highlights and notes on documents. Private to each user.

```
document_annotations
├── id                uuid PK
├── document_id       uuid FK → documents NOT NULL
├── user_id           uuid FK → users NOT NULL
├── page_number       integer
├── annotation_type   text CHECK (annotation_type IN (
│                       'highlight', 'note', 'bookmark'))
├── content           text          -- note text
├── position_data     jsonb         -- coordinates for highlights
├── color             text          -- highlight colour
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

### 5.4 `library_folders`

Persistent document library structure.

```
library_folders
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── parent_id         uuid FK → library_folders  -- nested folders
├── name              text NOT NULL
├── description       text
├── sort_order        integer DEFAULT 0
├── access_roles      text[]         -- which roles can view: {'board_member', 'executive'}
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

---

## 6. IQ (Intelligence) System

### 6.1 `iq_analyses`

One analysis per agenda item. Generated when documents are processed.

```
iq_analyses
├── id                uuid PK
├── agenda_item_id    uuid FK → agenda_items NOT NULL UNIQUE
├── org_id            uuid FK → organisations NOT NULL  -- for RLS
│
│   -- Analysis content (structured)
├── claims            jsonb     -- [{claim, source_doc_id, source_page,
│                                   confidence, has_source_cited,
│                                   consistent_with_prior, flags}]
├── assumptions       jsonb     -- [{assumption, severity, detail}]
├── risk_flags        jsonb     -- [{flag, severity, detail, related_item_ids}]
├── data_quality      jsonb     -- [{issue, detail, source_doc_id}]
│
│   -- Cross-item intelligence
├── related_items     jsonb     -- [{agenda_item_id, relationship_type,
│                                   detail}]  -- contradictions, dependencies
│
│   -- Summary content
├── headline          text      -- "Revenue assumption at risk"
├── severity          text CHECK (severity IN (
│                       'alert', 'watch', 'ready', 'good'))
├── detail            text      -- paragraph-length analysis
├── executive_summary text      -- one-sentence for badges
│
│   -- Processing metadata
├── model_used        text      -- e.g. "claude-sonnet-4-20250514"
├── prompt_version    text      -- track which prompt generated this
├── source_doc_ids    uuid[]    -- which documents were analysed
├── generated_at      timestamptz
├── regenerated_at    timestamptz
├── created_at        timestamptz
├── updated_at        timestamptz
```

### 6.2 `iq_questions`

Suggested questions generated by IQ. Separate table because users interact with them individually (star, dismiss).

```
iq_questions
├── id                uuid PK
├── iq_analysis_id    uuid FK → iq_analyses NOT NULL
├── agenda_item_id    uuid FK → agenda_items NOT NULL  -- denormalised
├── org_id            uuid FK → organisations NOT NULL  -- for RLS
│
├── question_text     text NOT NULL
├── rationale         text          -- "This question matters because..."
├── category          text CHECK (category IN (
│                       'strategic', 'financial', 'risk',
│                       'governance', 'operational', 'people'))
├── priority          integer DEFAULT 0   -- higher = more important
├── source_claim_index integer           -- links to claim in iq_analyses.claims
│
│   -- Framing variant
├── director_framing  text    -- "Ask this question" version
├── executive_framing text    -- "Prepare for this question" version
│
├── sort_order        integer DEFAULT 0
├── created_at        timestamptz
```

### 6.3 `iq_question_interactions`

Per-user interactions with suggested questions. Tracks starring, dismissing, and whether questions were addressed in the meeting.

```
iq_question_interactions
├── id                uuid PK
├── iq_question_id    uuid FK → iq_questions NOT NULL
├── user_id           uuid FK → users NOT NULL
├── action            text NOT NULL CHECK (action IN (
│                       'starred', 'dismissed', 'saved_to_notebook'))
├── notebook_entry_id uuid FK → notebook_entries  -- if saved
├── created_at        timestamptz
├── UNIQUE(iq_question_id, user_id, action)
```

### 6.4 `iq_chats`

Conversational IQ interactions per user per agenda item.

```
iq_chats
├── id                uuid PK
├── agenda_item_id    uuid FK → agenda_items NOT NULL
├── user_id           uuid FK → users NOT NULL
├── org_id            uuid FK → organisations NOT NULL  -- for RLS
├── created_at        timestamptz
├── updated_at        timestamptz
├── UNIQUE(agenda_item_id, user_id)
```

### 6.5 `iq_chat_messages`

```
iq_chat_messages
├── id                uuid PK
├── chat_id           uuid FK → iq_chats NOT NULL
├── role              text NOT NULL CHECK (role IN ('user', 'assistant'))
├── content           text NOT NULL
├── citations         jsonb    -- [{doc_id, page, excerpt}]
├── model_used        text
├── created_at        timestamptz
```

---

## 7. Voting

### 7.1 `votes`

Immutable once voting is closed. Full audit trail.

```
votes
├── id                uuid PK
├── agenda_item_id    uuid FK → agenda_items NOT NULL
├── org_membership_id uuid FK → org_memberships NOT NULL
├── vote_value        text NOT NULL    -- "Approve", "Reject", "Abstain", etc.
├── cast_at           timestamptz NOT NULL
├── updated_at        timestamptz      -- can change until voting closes
├── is_final          boolean DEFAULT false  -- set true when voting closes
├── ip_address        inet             -- audit field
├── UNIQUE(agenda_item_id, org_membership_id)
```

---

## 8. Notebook

### 8.1 `notebook_entries`

Private, encrypted notes. Per-user, per-org. Can be linked to meetings/items or free-standing.

```
notebook_entries
├── id                uuid PK
├── user_id           uuid FK → users NOT NULL
├── org_id            uuid FK → organisations NOT NULL  -- scoped per org
│
│   -- Linking (all optional)
├── meeting_id        uuid FK → meetings
├── agenda_item_id    uuid FK → agenda_items
│
│   -- Content
├── title             text
├── content           text NOT NULL       -- markdown
├── is_starred        boolean DEFAULT false
├── source            text DEFAULT 'manual' CHECK (source IN (
│                       'manual', 'iq_question', 'iq_chat',
│                       'during_meeting'))
├── source_reference_id uuid              -- iq_question_id if from IQ
│
├── tags              text[]
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

**RLS:** Users can ONLY read/write their own notebook entries. No admin access. Entries should be encrypted at rest using Supabase Vault or application-level encryption.

---

## 9. Action Items

### 9.1 `action_items`

Track actions across meetings. Created from minutes or manually by secretariat.

```
action_items
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── source_meeting_id uuid FK → meetings       -- meeting where action was created
├── source_item_id    uuid FK → agenda_items   -- specific item it arose from
├── follow_up_meeting_id uuid FK → meetings    -- meeting where it's being reported
│
├── title             text NOT NULL
├── description       text
├── assignee_id       uuid FK → org_memberships NOT NULL
├── due_date          date
├── status            text DEFAULT 'not_started' CHECK (status IN (
│                       'not_started', 'in_progress', 'complete',
│                       'deferred', 'cancelled'))
├── priority          text DEFAULT 'medium' CHECK (priority IN (
│                       'low', 'medium', 'high'))
├── completed_at      timestamptz
├── completion_notes  text
│
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
├── deleted_at        timestamptz
```

---

## 10. Minutes

### 10.1 `meeting_minutes`

One record per meeting. Holds the overall minutes metadata and approval workflow state.

```
meeting_minutes
├── id                uuid PK
├── meeting_id        uuid FK → meetings NOT NULL UNIQUE
├── org_id            uuid FK → organisations NOT NULL
│
├── status            text DEFAULT 'draft' CHECK (status IN (
│                       'draft', 'chair_review', 'board_review',
│                       'approved', 'published'))
├── approved_at       timestamptz
├── approved_by       uuid FK → users
├── published_at      timestamptz
│
├── preamble          text    -- opening text of minutes
├── closing           text    -- closing text
│
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
```

### 10.2 `minute_items`

Per-agenda-item minutes content.

```
minute_items
├── id                uuid PK
├── minutes_id        uuid FK → meeting_minutes NOT NULL
├── agenda_item_id    uuid FK → agenda_items NOT NULL
│
├── attendees_for_item text[]  -- names present for this item
├── discussion_summary text    -- the main minutes text
├── decisions_made    jsonb    -- [{decision_text, vote_result}]
├── ai_draft          text     -- AI-generated first draft
├── secretariat_notes text     -- internal notes during editing
│
├── sort_order        integer
├── created_at        timestamptz
├── updated_at        timestamptz
```

### 10.3 `minute_versions`

Full version history for audit trail.

```
minute_versions
├── id                uuid PK
├── minutes_id        uuid FK → meeting_minutes NOT NULL
├── version_number    integer NOT NULL
├── content_snapshot  jsonb NOT NULL    -- full serialised state
├── changed_by        uuid FK → users NOT NULL
├── change_summary    text
├── created_at        timestamptz
```

---

## 11. Notifications & Audit

### 11.1 `notifications`

In-app notification system.

```
notifications
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── user_id           uuid FK → users NOT NULL          -- recipient
├── type              text NOT NULL CHECK (type IN (
│                       'meeting_published', 'document_uploaded',
│                       'agenda_changed', 'pre_read_reminder',
│                       'voting_opened', 'voting_closed',
│                       'minutes_published', 'action_assigned',
│                       'action_due_soon', 'paper_deadline',
│                       'nudge'))
├── title             text NOT NULL
├── body              text
├── reference_type    text    -- 'meeting', 'agenda_item', 'document', etc.
├── reference_id      uuid    -- polymorphic FK
├── is_read           boolean DEFAULT false
├── read_at           timestamptz
├── email_sent        boolean DEFAULT false
├── email_sent_at     timestamptz
├── created_at        timestamptz
```

### 11.2 `audit_log`

Immutable, append-only audit trail. Never deleted.

```
audit_log
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── user_id           uuid FK → users             -- who performed action
├── action            text NOT NULL                -- 'document.uploaded',
│                                                  -- 'vote.cast', etc.
├── entity_type       text NOT NULL                -- 'meeting', 'document', etc.
├── entity_id         uuid NOT NULL
├── details           jsonb                        -- before/after state, metadata
├── ip_address        inet
├── user_agent        text
├── created_at        timestamptz NOT NULL DEFAULT now()
```

**No `updated_at`, no `deleted_at`.** Audit log is append-only. Create a retention policy (configurable per org) to archive old entries.

---

## 12. Messaging (Future — Schema Reserved)

### 12.1 `message_threads`

```
message_threads
├── id                uuid PK
├── org_id            uuid FK → organisations NOT NULL
├── subject           text
├── thread_type       text CHECK (thread_type IN (
│                       'direct', 'group', 'meeting_linked'))
├── meeting_id        uuid FK → meetings           -- optional link
├── agenda_item_id    uuid FK → agenda_items        -- optional link
├── created_by        uuid FK → users
├── created_at        timestamptz
├── updated_at        timestamptz
```

### 12.2 `message_participants`

```
message_participants
├── id                uuid PK
├── thread_id         uuid FK → message_threads NOT NULL
├── user_id           uuid FK → users NOT NULL
├── last_read_at      timestamptz
├── UNIQUE(thread_id, user_id)
```

### 12.3 `messages`

```
messages
├── id                uuid PK
├── thread_id         uuid FK → message_threads NOT NULL
├── sender_id         uuid FK → users NOT NULL
├── content           text NOT NULL        -- encrypted at rest
├── created_at        timestamptz
├── deleted_at        timestamptz
```

---

## 13. Row Level Security (RLS) Strategy

RLS is the backbone of data isolation. Every policy follows the same pattern: check that the requesting user has an active `org_membership` for the row's `org_id`.

### Core helper function

```sql
CREATE OR REPLACE FUNCTION auth_org_ids()
RETURNS uuid[] AS $$
  SELECT array_agg(org_id)
  FROM org_memberships
  WHERE user_id = auth.uid()
    AND status = 'active'
    AND deleted_at IS NULL
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### Standard policy pattern (applied to most tables)

```sql
-- SELECT: user can read rows for their orgs
CREATE POLICY "org_isolation_select" ON [table]
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

-- INSERT: user can insert rows for their orgs
CREATE POLICY "org_isolation_insert" ON [table]
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));
```

### Specific RLS rules by table

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `organisations` | Member of org | — | Secretariat only | — |
| `org_memberships` | Member of org | Secretariat only | Secretariat only | — |
| `committees` | Member of org | Secretariat only | Secretariat only | — |
| `meetings` | Member of org | Secretariat only | Secretariat only | — |
| `agenda_items` | Attendee of item (via `agenda_item_attendees`) | Secretariat only | Secretariat + paper owner | — |
| `documents` | Attendee of linked item OR library access | Secretariat + presenter (own items) | Secretariat + uploader | — |
| `document_reads` | Own reads only | Own reads only | Own reads only | — |
| `document_annotations` | Own annotations only | Own only | Own only | Own only |
| `iq_analyses` | Attendee of item | System only | System only | — |
| `iq_questions` | Attendee of item | System only | — | — |
| `iq_question_interactions` | Own only | Own only | Own only | — |
| `iq_chats` / `iq_chat_messages` | Own chats only | Own only | — | — |
| `votes` | Attendee of item (results); own vote detail | Eligible voters only | Before voting closes | — |
| `notebook_entries` | **Own only, always** | Own only | Own only | Own only |
| `action_items` | Member of org | Secretariat only | Secretariat + assignee | — |
| `audit_log` | Secretariat + chair only | System only | — | — |
| `notifications` | Own only | System only | Own only (mark read) | — |

### The agenda item visibility chain

This is the most complex RLS scenario. A user can see an agenda item only if:

1. They are a member of the org, AND
2. The meeting is in a visible status (published or later), AND
3. They have an `agenda_item_attendees` record with `access_level != 'excluded'`

For executives/presenters, the chain further restricts document and IQ access to only their own items. This is enforced by the `agenda_item_attendees` table.

```sql
CREATE POLICY "agenda_item_select" ON agenda_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agenda_item_attendees aia
      JOIN org_memberships om ON om.id = aia.org_membership_id
      WHERE aia.agenda_item_id = agenda_items.id
        AND om.user_id = auth.uid()
        AND aia.access_level != 'excluded'
    )
    OR
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = agenda_items.org_id
        AND om.user_id = auth.uid()
        AND om.role = 'secretariat'
        AND om.status = 'active'
    )
  );
```

---

## 14. Key Indexes

Performance-critical indexes beyond standard FK indexes:

```sql
-- Org membership lookups (used in every RLS check)
CREATE INDEX idx_org_memberships_user_active
  ON org_memberships(user_id, status) WHERE deleted_at IS NULL;

CREATE INDEX idx_org_memberships_org_role
  ON org_memberships(org_id, role) WHERE deleted_at IS NULL;

-- Meeting lookups
CREATE INDEX idx_meetings_org_date
  ON meetings(org_id, date DESC) WHERE deleted_at IS NULL;

CREATE INDEX idx_meetings_committee_status
  ON meetings(committee_id, status) WHERE deleted_at IS NULL;

-- Agenda items per meeting
CREATE INDEX idx_agenda_items_meeting_sort
  ON agenda_items(meeting_id, sort_order) WHERE deleted_at IS NULL;

-- Agenda item attendees (critical for RLS)
CREATE INDEX idx_aia_item_membership
  ON agenda_item_attendees(agenda_item_id, org_membership_id);

CREATE INDEX idx_aia_membership_access
  ON agenda_item_attendees(org_membership_id, access_level);

-- Documents per agenda item
CREATE INDEX idx_documents_item
  ON documents(agenda_item_id, sort_order) WHERE deleted_at IS NULL;

-- Document reads per user
CREATE INDEX idx_doc_reads_user
  ON document_reads(user_id, document_id);

-- IQ analyses per item
CREATE UNIQUE INDEX idx_iq_analyses_item
  ON iq_analyses(agenda_item_id);

-- Notifications per user (unread)
CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, is_read, created_at DESC);

-- Audit log by org and entity
CREATE INDEX idx_audit_org_entity
  ON audit_log(org_id, entity_type, entity_id, created_at DESC);

-- Action items by org and status
CREATE INDEX idx_actions_org_status
  ON action_items(org_id, status) WHERE deleted_at IS NULL;
```

---

## 15. Storage Buckets (Supabase Storage)

```
Buckets:
├── documents          -- board papers, attachments, presentations
│   └── policy: authenticated users, scoped by RLS on documents table
├── organisation-assets -- logos, branding
│   └── policy: org members can read, secretariat can write
├── exports            -- generated PDFs (board books, minutes exports)
│   └── policy: user who requested export only, auto-expire after 24h
├── avatars            -- user profile images
│   └── policy: authenticated users read all, own write only
```

---

## 16. Key Queries the Application Will Run

These are the queries that matter most for performance and correctness. Each maps to a specific UI feature.

**Director briefing — "Show me my meeting":**
```
agenda_items WHERE meeting_id = X
  JOIN agenda_item_attendees WHERE user = me AND access != 'excluded'
  JOIN documents
  JOIN iq_analyses
  JOIN document_reads WHERE user = me
  ORDER BY phase_sort_order, sort_order
```
Returns: all visible items with their docs, IQ status, and the user's read progress. This is the most common query in the application.

**Secretariat paper tracking — "What papers are missing?":**
```
agenda_items WHERE meeting_id = X AND paper_status != 'complete'
  JOIN org_memberships ON paper_owner_id
  LEFT JOIN documents
  ORDER BY paper_status ASC, paper_deadline ASC
```

**Board readiness — "Who has read their papers?":**
```
meeting_attendees WHERE meeting_id = X
  JOIN org_memberships → users
  LEFT JOIN document_reads ON user_id
    JOIN documents ON agenda_item_id IN (items for this meeting)
  GROUP BY user → percentage read
```

**Preparation progress — "How prepared am I?":**
```
documents WHERE agenda_item_id IN (my visible items for meeting X)
  LEFT JOIN document_reads WHERE user = me
  → count read / count total
```

**IQ briefing generation (async, background):**
```
For each user attending meeting X:
  - Fetch their visible agenda_items + attendee records
  - Fetch all iq_analyses for those items
  - Fetch their role, committee memberships
  - Generate personalised briefing narrative
  - Store in meetings.briefing_summary JSONB
```

---

## 17. Data Lifecycle & Retention

| Data | Retention | Rationale |
|------|-----------|-----------|
| Meetings, agenda items, documents | Indefinite | Governance record |
| Audit log | Configurable, min 7 years | Compliance |
| Notebook entries | Until user deletes | Personal data |
| IQ chat messages | 12 months after meeting | Reduce storage, low re-use |
| Notifications (read) | 90 days | Housekeeping |
| Document read tracking | Indefinite | Effectiveness analytics |
| Votes | Indefinite, immutable | Legal record |
| Export files (Storage) | 24 hours | Temporary artefacts |

---

## 18. Migration & Seeding Notes for Demo

For the localhost demo with role switcher (no auth), seed the database with:

1. One organisation: "Coastal Health Foundation"
2. One committee: "Full Board" (is_full_board = true)
3. Users: 6 board members + 3 executives + 1 secretariat
4. One meeting: the April 16 2026 board meeting from the prototype
5. 11 agenda items with all metadata from mock data
6. ~18 documents (file metadata only — actual PDFs not needed for demo, use placeholder content)
7. IQ analyses for 7 items with claims, questions, and cross-references
8. Document reads: varied completion per user (matches the prototype data)
9. Action items: 4 outstanding from the February meeting
10. Notebook entries: 2 saved IQ questions for Patricia
11. Meeting briefing summaries: pre-generated per role

The demo bypasses auth entirely — the role switcher sets a context variable that the API uses instead of `auth.uid()`.
