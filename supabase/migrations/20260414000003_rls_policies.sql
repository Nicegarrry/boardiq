-- BoardIQ — Row Level Security Policies
-- Migration 003: Enable RLS on all tables and create access policies
--
-- Policy patterns:
--   1. Standard org isolation — most tables (SELECT/INSERT/UPDATE scoped to auth_org_ids())
--   2. Own-only — notebook_entries, document_reads, document_annotations, iq_question_interactions
--   3. Append-only — audit_log (no UPDATE/DELETE)
--   4. Complex visibility — agenda_items (secretariat sees all, others need attendee record + published meeting)
--   5. Votes — own insert, org-scoped select

-- ============================================================================
-- 1. USERS — org members can see users who share an org
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select" ON public.users
  FOR SELECT USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.org_memberships om1
      JOIN public.org_memberships om2 ON om1.org_id = om2.org_id
      WHERE om1.user_id = auth.uid()
        AND om2.user_id = users.id
        AND om1.status = 'active' AND om1.deleted_at IS NULL
        AND om2.status = 'active' AND om2.deleted_at IS NULL
    )
  );

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- ============================================================================
-- 2. ORGANISATIONS — standard org isolation
-- ============================================================================

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_select" ON public.organisations
  FOR SELECT USING (id = ANY(auth_org_ids()));

CREATE POLICY "org_insert" ON public.organisations
  FOR INSERT WITH CHECK (id = ANY(auth_org_ids()));

CREATE POLICY "org_update" ON public.organisations
  FOR UPDATE USING (id = ANY(auth_org_ids()));

-- ============================================================================
-- 3. ORG_MEMBERSHIPS — users see their org's memberships; secretariat can modify
-- ============================================================================

ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_memberships_select" ON public.org_memberships
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "org_memberships_insert" ON public.org_memberships
  FOR INSERT WITH CHECK (
    org_id = ANY(auth_org_ids())
    AND EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = org_memberships.org_id
        AND role = 'secretariat'
        AND status = 'active'
        AND deleted_at IS NULL
    )
  );

CREATE POLICY "org_memberships_update" ON public.org_memberships
  FOR UPDATE USING (
    org_id = ANY(auth_org_ids())
    AND EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = org_memberships.org_id
        AND role = 'secretariat'
        AND status = 'active'
        AND deleted_at IS NULL
    )
  );

-- ============================================================================
-- 4. PERMISSION_OVERRIDES — standard org isolation via org_membership
-- ============================================================================

ALTER TABLE public.permission_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perm_overrides_select" ON public.permission_overrides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships om
      WHERE om.id = permission_overrides.org_membership_id
        AND om.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "perm_overrides_insert" ON public.permission_overrides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships om
      WHERE om.id = permission_overrides.org_membership_id
        AND om.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "perm_overrides_update" ON public.permission_overrides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships om
      WHERE om.id = permission_overrides.org_membership_id
        AND om.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 5. COMMITTEES — standard org isolation
-- ============================================================================

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committees_select" ON public.committees
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "committees_insert" ON public.committees
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "committees_update" ON public.committees
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 6. COMMITTEE_MEMBERSHIPS — standard org isolation via committee
-- ============================================================================

ALTER TABLE public.committee_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committee_memberships_select" ON public.committee_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.committees c
      WHERE c.id = committee_memberships.committee_id
        AND c.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "committee_memberships_insert" ON public.committee_memberships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.committees c
      WHERE c.id = committee_memberships.committee_id
        AND c.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "committee_memberships_update" ON public.committee_memberships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.committees c
      WHERE c.id = committee_memberships.committee_id
        AND c.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 7. MEETING_TEMPLATES — standard org isolation
-- ============================================================================

ALTER TABLE public.meeting_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meeting_templates_select" ON public.meeting_templates
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "meeting_templates_insert" ON public.meeting_templates
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "meeting_templates_update" ON public.meeting_templates
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 8. MEETINGS — standard org isolation
-- ============================================================================

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_select" ON public.meetings
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "meetings_insert" ON public.meetings
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "meetings_update" ON public.meetings
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 9. MEETING_ATTENDEES — standard org isolation via meeting
-- ============================================================================

ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meeting_attendees_select" ON public.meeting_attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = meeting_attendees.meeting_id
        AND m.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "meeting_attendees_insert" ON public.meeting_attendees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = meeting_attendees.meeting_id
        AND m.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "meeting_attendees_update" ON public.meeting_attendees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = meeting_attendees.meeting_id
        AND m.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 10. AGENDA_ITEMS — Complex visibility policy
-- ============================================================================

ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;

-- SELECT: Secretariat sees all in org. Others need attendee record + published meeting.
CREATE POLICY "agenda_items_select" ON public.agenda_items
  FOR SELECT USING (
    org_id = ANY(auth_org_ids())
    AND (
      -- Secretariat sees all items in their org
      EXISTS (
        SELECT 1 FROM public.org_memberships
        WHERE user_id = auth.uid()
          AND org_id = agenda_items.org_id
          AND role = 'secretariat'
          AND status = 'active'
          AND deleted_at IS NULL
      )
      OR
      -- Others: must have attendee record and meeting must be published+
      (
        EXISTS (
          SELECT 1 FROM public.agenda_item_attendees aia
          JOIN public.org_memberships om ON om.id = aia.org_membership_id
          WHERE aia.agenda_item_id = agenda_items.id
            AND om.user_id = auth.uid()
            AND aia.access_level != 'excluded'
        )
        AND EXISTS (
          SELECT 1 FROM public.meetings m
          WHERE m.id = agenda_items.meeting_id
            AND m.status NOT IN ('draft', 'review')
        )
      )
    )
  );

-- INSERT/UPDATE: standard org isolation (secretariat manages agenda)
CREATE POLICY "agenda_items_insert" ON public.agenda_items
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "agenda_items_update" ON public.agenda_items
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 11. AGENDA_ITEM_PRESENTERS — standard org isolation via agenda_item
-- ============================================================================

ALTER TABLE public.agenda_item_presenters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agenda_item_presenters_select" ON public.agenda_item_presenters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_presenters.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "agenda_item_presenters_insert" ON public.agenda_item_presenters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_presenters.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "agenda_item_presenters_update" ON public.agenda_item_presenters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_presenters.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 12. AGENDA_ITEM_ATTENDEES — org isolation + secretariat can modify
-- ============================================================================

ALTER TABLE public.agenda_item_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agenda_item_attendees_select" ON public.agenda_item_attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_attendees.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "agenda_item_attendees_insert" ON public.agenda_item_attendees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_attendees.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "agenda_item_attendees_update" ON public.agenda_item_attendees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = agenda_item_attendees.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 13. DOCUMENTS — standard org isolation
-- ============================================================================

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select" ON public.documents
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "documents_insert" ON public.documents
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "documents_update" ON public.documents
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 14. DOCUMENT_READS — own only
-- ============================================================================

ALTER TABLE public.document_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "document_reads_select" ON public.document_reads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "document_reads_insert" ON public.document_reads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "document_reads_update" ON public.document_reads
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 15. DOCUMENT_ANNOTATIONS — own only
-- ============================================================================

ALTER TABLE public.document_annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "document_annotations_select" ON public.document_annotations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "document_annotations_insert" ON public.document_annotations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "document_annotations_update" ON public.document_annotations
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 16. LIBRARY_FOLDERS — standard org isolation
-- ============================================================================

ALTER TABLE public.library_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_folders_select" ON public.library_folders
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "library_folders_insert" ON public.library_folders
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "library_folders_update" ON public.library_folders
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 17. IQ_ANALYSES — standard org isolation
-- ============================================================================

ALTER TABLE public.iq_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iq_analyses_select" ON public.iq_analyses
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_analyses_insert" ON public.iq_analyses
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_analyses_update" ON public.iq_analyses
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 18. IQ_QUESTIONS — standard org isolation
-- ============================================================================

ALTER TABLE public.iq_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iq_questions_select" ON public.iq_questions
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_questions_insert" ON public.iq_questions
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_questions_update" ON public.iq_questions
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 19. IQ_QUESTION_INTERACTIONS — own only
-- ============================================================================

ALTER TABLE public.iq_question_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iq_question_interactions_select" ON public.iq_question_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "iq_question_interactions_insert" ON public.iq_question_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "iq_question_interactions_update" ON public.iq_question_interactions
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 20. IQ_CHATS — standard org isolation
-- ============================================================================

ALTER TABLE public.iq_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iq_chats_select" ON public.iq_chats
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_chats_insert" ON public.iq_chats
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "iq_chats_update" ON public.iq_chats
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 21. IQ_CHAT_MESSAGES — org isolation via chat
-- ============================================================================

ALTER TABLE public.iq_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "iq_chat_messages_select" ON public.iq_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.iq_chats c
      WHERE c.id = iq_chat_messages.chat_id
        AND c.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "iq_chat_messages_insert" ON public.iq_chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.iq_chats c
      WHERE c.id = iq_chat_messages.chat_id
        AND c.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 22. VOTES — own insert, org-scoped select
-- ============================================================================

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes_select" ON public.votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agenda_items ai
      WHERE ai.id = votes.agenda_item_id
        AND ai.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "votes_insert" ON public.votes
  FOR INSERT WITH CHECK (
    org_membership_id IN (
      SELECT id FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND deleted_at IS NULL
    )
  );

-- No UPDATE or DELETE on votes — immutable after cast

-- ============================================================================
-- 23. NOTEBOOK_ENTRIES — PRIVATE, own only, no admin access
-- ============================================================================

ALTER TABLE public.notebook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notebook_own_only" ON public.notebook_entries
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 24. ACTION_ITEMS — standard org isolation
-- ============================================================================

ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "action_items_select" ON public.action_items
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "action_items_insert" ON public.action_items
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "action_items_update" ON public.action_items
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 25. MEETING_MINUTES — standard org isolation
-- ============================================================================

ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meeting_minutes_select" ON public.meeting_minutes
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "meeting_minutes_insert" ON public.meeting_minutes
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "meeting_minutes_update" ON public.meeting_minutes
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 26. MINUTE_ITEMS — org isolation via meeting_minutes
-- ============================================================================

ALTER TABLE public.minute_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "minute_items_select" ON public.minute_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meeting_minutes mm
      WHERE mm.id = minute_items.minutes_id
        AND mm.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "minute_items_insert" ON public.minute_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meeting_minutes mm
      WHERE mm.id = minute_items.minutes_id
        AND mm.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "minute_items_update" ON public.minute_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.meeting_minutes mm
      WHERE mm.id = minute_items.minutes_id
        AND mm.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 27. MINUTE_VERSIONS — org isolation via meeting_minutes
-- ============================================================================

ALTER TABLE public.minute_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "minute_versions_select" ON public.minute_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meeting_minutes mm
      WHERE mm.id = minute_versions.minutes_id
        AND mm.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "minute_versions_insert" ON public.minute_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meeting_minutes mm
      WHERE mm.id = minute_versions.minutes_id
        AND mm.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 28. NOTIFICATIONS — own only for select/update; system insert
-- ============================================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 29. AUDIT_LOG — append-only (no UPDATE/DELETE policies = immutable)
-- ============================================================================

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_select" ON public.audit_log
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "audit_log_insert" ON public.audit_log
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

-- No UPDATE or DELETE policies — audit_log is immutable

-- ============================================================================
-- 30. MESSAGE_THREADS — standard org isolation
-- ============================================================================

ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_threads_select" ON public.message_threads
  FOR SELECT USING (org_id = ANY(auth_org_ids()));

CREATE POLICY "message_threads_insert" ON public.message_threads
  FOR INSERT WITH CHECK (org_id = ANY(auth_org_ids()));

CREATE POLICY "message_threads_update" ON public.message_threads
  FOR UPDATE USING (org_id = ANY(auth_org_ids()));

-- ============================================================================
-- 31. MESSAGE_PARTICIPANTS — org isolation via thread
-- ============================================================================

ALTER TABLE public.message_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_participants_select" ON public.message_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = message_participants.thread_id
        AND mt.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "message_participants_insert" ON public.message_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = message_participants.thread_id
        AND mt.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 32. MESSAGES — org isolation via thread
-- ============================================================================

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = messages.thread_id
        AND mt.org_id = ANY(auth_org_ids())
    )
  );

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = messages.thread_id
        AND mt.org_id = ANY(auth_org_ids())
    )
  );

-- ============================================================================
-- 33. STORAGE POLICIES — documents bucket scoped to org membership
-- ============================================================================

-- Storage policies are managed via Supabase Storage API / Dashboard.
-- The storage bucket 'documents' was created in migration 002.
-- Access is enforced by the document table RLS above — storage objects
-- are accessed via signed URLs generated server-side after RLS check passes.
-- Direct storage RLS policies can be added via Supabase Dashboard if needed:
--
--   INSERT: authenticated users in the org
--   SELECT: authenticated users in the org
--   DELETE: secretariat only
