-- BoardIQ — Seed Data
-- Demo organisation: Coastal Health Foundation
-- Converts all mock data from src/lib/mock-data.ts to SQL
--
-- Uses deterministic UUIDs for cross-referencing between tables.
-- Password for all demo users: demo123

DO $$
DECLARE
  -- Organisation
  v_org_id uuid := '11111111-1111-1111-1111-111111111111';

  -- Users (auth.users IDs)
  v_david_kim         uuid := '22222222-0001-0001-0001-000000000001';
  v_patricia_moreau   uuid := '22222222-0001-0001-0001-000000000002';
  v_james_achebe      uuid := '22222222-0001-0001-0001-000000000003';
  v_susan_cho         uuid := '22222222-0001-0001-0001-000000000004';
  v_robert_menzies    uuid := '22222222-0001-0001-0001-000000000005';
  v_helen_papadopoulos uuid := '22222222-0001-0001-0001-000000000006';
  v_sarah_brennan     uuid := '22222222-0001-0001-0001-000000000007';
  v_michael_torres    uuid := '22222222-0001-0001-0001-000000000008';
  v_anika_patel       uuid := '22222222-0001-0001-0001-000000000009';
  v_lisa_chang        uuid := '22222222-0001-0001-0001-000000000010';
  v_jenny_walsh       uuid := '22222222-0001-0001-0001-000000000011';

  -- Org memberships
  v_om_david          uuid := '33333333-0001-0001-0001-000000000001';
  v_om_patricia       uuid := '33333333-0001-0001-0001-000000000002';
  v_om_james          uuid := '33333333-0001-0001-0001-000000000003';
  v_om_susan          uuid := '33333333-0001-0001-0001-000000000004';
  v_om_robert         uuid := '33333333-0001-0001-0001-000000000005';
  v_om_helen          uuid := '33333333-0001-0001-0001-000000000006';
  v_om_sarah          uuid := '33333333-0001-0001-0001-000000000007';
  v_om_michael        uuid := '33333333-0001-0001-0001-000000000008';
  v_om_anika          uuid := '33333333-0001-0001-0001-000000000009';
  v_om_lisa           uuid := '33333333-0001-0001-0001-000000000010';
  v_om_jenny          uuid := '33333333-0001-0001-0001-000000000011';

  -- Committees
  v_com_full_board    uuid := '44444444-0001-0001-0001-000000000001';
  v_com_finance_audit uuid := '44444444-0001-0001-0001-000000000002';
  v_com_programs      uuid := '44444444-0001-0001-0001-000000000003';
  v_com_nominations   uuid := '44444444-0001-0001-0001-000000000004';

  -- Meetings
  v_mtg_apr_2026      uuid := '55555555-0001-0001-0001-000000000001';
  v_mtg_feb_2026      uuid := '55555555-0001-0001-0001-000000000002';

  -- Agenda items
  v_item_1_1          uuid := '66666666-0001-0001-0001-000000000001';
  v_item_1_2          uuid := '66666666-0001-0001-0001-000000000002';
  v_item_2_1          uuid := '66666666-0001-0001-0001-000000000003';
  v_item_3_1          uuid := '66666666-0001-0001-0001-000000000004';
  v_item_4_1          uuid := '66666666-0001-0001-0001-000000000005';
  v_item_5_1          uuid := '66666666-0001-0001-0001-000000000006';
  v_item_5_2          uuid := '66666666-0001-0001-0001-000000000007';
  v_item_6_1          uuid := '66666666-0001-0001-0001-000000000008';
  v_item_6_2          uuid := '66666666-0001-0001-0001-000000000009';
  v_item_7_1          uuid := '66666666-0001-0001-0001-000000000010';
  v_item_8_1          uuid := '66666666-0001-0001-0001-000000000011';

  -- Documents
  v_doc_minutes_feb       uuid := '77777777-0001-0001-0001-000000000001';
  v_doc_action_tracker    uuid := '77777777-0001-0001-0001-000000000002';
  v_doc_ceo_report        uuid := '77777777-0001-0001-0001-000000000003';
  v_doc_program_dashboard uuid := '77777777-0001-0001-0001-000000000004';
  v_doc_charter           uuid := '77777777-0001-0001-0001-000000000005';
  v_doc_fa_tor            uuid := '77777777-0001-0001-0001-000000000006';
  v_doc_mh_concept        uuid := '77777777-0001-0001-0001-000000000007';
  v_doc_needs_assessment  uuid := '77777777-0001-0001-0001-000000000008';
  v_doc_budget            uuid := '77777777-0001-0001-0001-000000000009';
  v_doc_fa_minutes_mar    uuid := '77777777-0001-0001-0001-000000000010';
  v_doc_budget_variance   uuid := '77777777-0001-0001-0001-000000000011';
  v_doc_investments       uuid := '77777777-0001-0001-0001-000000000012';
  v_doc_risk_register     uuid := '77777777-0001-0001-0001-000000000013';
  v_doc_fundraising       uuid := '77777777-0001-0001-0001-000000000014';
  v_doc_ceo_performance   uuid := '77777777-0001-0001-0001-000000000015';
  v_doc_kpi_scorecard     uuid := '77777777-0001-0001-0001-000000000016';
  v_doc_remuneration      uuid := '77777777-0001-0001-0001-000000000017';

  -- IQ analyses
  v_iq_2_1            uuid := '88888888-0001-0001-0001-000000000001';
  v_iq_4_1            uuid := '88888888-0001-0001-0001-000000000002';
  v_iq_5_1            uuid := '88888888-0001-0001-0001-000000000003';
  v_iq_5_2            uuid := '88888888-0001-0001-0001-000000000004';
  v_iq_6_1            uuid := '88888888-0001-0001-0001-000000000005';
  v_iq_6_2            uuid := '88888888-0001-0001-0001-000000000006';
  v_iq_7_1            uuid := '88888888-0001-0001-0001-000000000007';

  -- IQ questions
  v_iq_q_2_1_1        uuid := '99999999-0001-0001-0001-000000000001';
  v_iq_q_2_1_2        uuid := '99999999-0001-0001-0001-000000000002';
  v_iq_q_4_1_1        uuid := '99999999-0001-0001-0001-000000000003';
  v_iq_q_4_1_2        uuid := '99999999-0001-0001-0001-000000000004';
  v_iq_q_4_1_3        uuid := '99999999-0001-0001-0001-000000000005';
  v_iq_q_4_1_4        uuid := '99999999-0001-0001-0001-000000000006';
  v_iq_q_5_1_1        uuid := '99999999-0001-0001-0001-000000000007';
  v_iq_q_5_1_2        uuid := '99999999-0001-0001-0001-000000000008';
  v_iq_q_6_1_1        uuid := '99999999-0001-0001-0001-000000000009';
  v_iq_q_6_2_1        uuid := '99999999-0001-0001-0001-000000000010';
  v_iq_q_7_1_1        uuid := '99999999-0001-0001-0001-000000000011';
  v_iq_q_7_1_2        uuid := '99999999-0001-0001-0001-000000000012';

  -- Action items
  v_act_1             uuid := 'aaaaaaaa-0001-0001-0001-000000000001';
  v_act_2             uuid := 'aaaaaaaa-0001-0001-0001-000000000002';
  v_act_3             uuid := 'aaaaaaaa-0001-0001-0001-000000000003';
  v_act_4             uuid := 'aaaaaaaa-0001-0001-0001-000000000004';

  -- Notebook entries
  v_note_1            uuid := 'bbbbbbbb-0001-0001-0001-000000000001';
  v_note_2            uuid := 'bbbbbbbb-0001-0001-0001-000000000002';

  -- Notifications
  v_notif_1           uuid := 'cccccccc-0001-0001-0001-000000000001';
  v_notif_2           uuid := 'cccccccc-0001-0001-0001-000000000002';
  v_notif_3           uuid := 'cccccccc-0001-0001-0001-000000000003';
  v_notif_4           uuid := 'cccccccc-0001-0001-0001-000000000004';
  v_notif_5           uuid := 'cccccccc-0001-0001-0001-000000000005';
  v_notif_6           uuid := 'cccccccc-0001-0001-0001-000000000006';

BEGIN

  -- ==========================================================================
  -- 1. AUTH USERS (Supabase auth.users table)
  -- ==========================================================================

  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token)
  VALUES
    (v_david_kim,          '00000000-0000-0000-0000-000000000000', 'david.kim@coastalhealth.org.au',     crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"David Kim"}',              'authenticated', 'authenticated', now(), now(), '', ''),
    (v_patricia_moreau,    '00000000-0000-0000-0000-000000000000', 'patricia.moreau@outlook.com',         crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Patricia Moreau"}',         'authenticated', 'authenticated', now(), now(), '', ''),
    (v_james_achebe,       '00000000-0000-0000-0000-000000000000', 'james.achebe@deakin.edu.au',          crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"James Achebe"}',            'authenticated', 'authenticated', now(), now(), '', ''),
    (v_susan_cho,          '00000000-0000-0000-0000-000000000000', 'susan.cho@barwonhealth.org.au',       crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Susan Cho"}',           'authenticated', 'authenticated', now(), now(), '', ''),
    (v_robert_menzies,     '00000000-0000-0000-0000-000000000000', 'robert.menzies@gmail.com',            crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Robert Menzies"}',          'authenticated', 'authenticated', now(), now(), '', ''),
    (v_helen_papadopoulos, '00000000-0000-0000-0000-000000000000', 'helen.p@surfcoast.vic.gov.au',        crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Helen Papadopoulos"}',      'authenticated', 'authenticated', now(), now(), '', ''),
    (v_sarah_brennan,      '00000000-0000-0000-0000-000000000000', 'sarah.brennan@coastalhealth.org.au',  crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Brennan"}',           'authenticated', 'authenticated', now(), now(), '', ''),
    (v_michael_torres,     '00000000-0000-0000-0000-000000000000', 'michael.torres@coastalhealth.org.au', crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Michael Torres"}',          'authenticated', 'authenticated', now(), now(), '', ''),
    (v_anika_patel,        '00000000-0000-0000-0000-000000000000', 'anika.patel@coastalhealth.org.au',    crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Anika Patel"}',         'authenticated', 'authenticated', now(), now(), '', ''),
    (v_lisa_chang,         '00000000-0000-0000-0000-000000000000', 'lisa.chang@coastalhealth.org.au',     crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lisa Chang"}',              'authenticated', 'authenticated', now(), now(), '', ''),
    (v_jenny_walsh,        '00000000-0000-0000-0000-000000000000', 'jenny.walsh@coastalhealth.org.au',    crypt('demo123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jenny Walsh"}',             'authenticated', 'authenticated', now(), now(), '', '');

  -- Also insert identities for each user (required by Supabase Auth)
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES
    (v_david_kim,          v_david_kim,          '{"sub":"' || v_david_kim || '","email":"david.kim@coastalhealth.org.au"}',     'email', v_david_kim::text,          now(), now(), now()),
    (v_patricia_moreau,    v_patricia_moreau,    '{"sub":"' || v_patricia_moreau || '","email":"patricia.moreau@outlook.com"}',   'email', v_patricia_moreau::text,    now(), now(), now()),
    (v_james_achebe,       v_james_achebe,       '{"sub":"' || v_james_achebe || '","email":"james.achebe@deakin.edu.au"}',      'email', v_james_achebe::text,       now(), now(), now()),
    (v_susan_cho,          v_susan_cho,          '{"sub":"' || v_susan_cho || '","email":"susan.cho@barwonhealth.org.au"}',      'email', v_susan_cho::text,          now(), now(), now()),
    (v_robert_menzies,     v_robert_menzies,     '{"sub":"' || v_robert_menzies || '","email":"robert.menzies@gmail.com"}',     'email', v_robert_menzies::text,     now(), now(), now()),
    (v_helen_papadopoulos, v_helen_papadopoulos, '{"sub":"' || v_helen_papadopoulos || '","email":"helen.p@surfcoast.vic.gov.au"}', 'email', v_helen_papadopoulos::text, now(), now(), now()),
    (v_sarah_brennan,      v_sarah_brennan,      '{"sub":"' || v_sarah_brennan || '","email":"sarah.brennan@coastalhealth.org.au"}', 'email', v_sarah_brennan::text,  now(), now(), now()),
    (v_michael_torres,     v_michael_torres,     '{"sub":"' || v_michael_torres || '","email":"michael.torres@coastalhealth.org.au"}', 'email', v_michael_torres::text, now(), now(), now()),
    (v_anika_patel,        v_anika_patel,        '{"sub":"' || v_anika_patel || '","email":"anika.patel@coastalhealth.org.au"}', 'email', v_anika_patel::text,       now(), now(), now()),
    (v_lisa_chang,         v_lisa_chang,         '{"sub":"' || v_lisa_chang || '","email":"lisa.chang@coastalhealth.org.au"}',   'email', v_lisa_chang::text,         now(), now(), now()),
    (v_jenny_walsh,        v_jenny_walsh,        '{"sub":"' || v_jenny_walsh || '","email":"jenny.walsh@coastalhealth.org.au"}', 'email', v_jenny_walsh::text,        now(), now(), now());

  -- ==========================================================================
  -- 2. PUBLIC USERS (profile data)
  -- ==========================================================================

  INSERT INTO public.users (id, email, full_name, display_name)
  VALUES
    (v_david_kim,          'david.kim@coastalhealth.org.au',     'David Kim',            'David'),
    (v_patricia_moreau,    'patricia.moreau@outlook.com',         'Patricia Moreau',      'Patricia'),
    (v_james_achebe,       'james.achebe@deakin.edu.au',          'James Achebe',         'James'),
    (v_susan_cho,          'susan.cho@barwonhealth.org.au',       'Dr. Susan Cho',        'Susan'),
    (v_robert_menzies,     'robert.menzies@gmail.com',            'Robert Menzies',       'Robert'),
    (v_helen_papadopoulos, 'helen.p@surfcoast.vic.gov.au',        'Helen Papadopoulos',   'Helen'),
    (v_sarah_brennan,      'sarah.brennan@coastalhealth.org.au',  'Sarah Brennan',        'Sarah'),
    (v_michael_torres,     'michael.torres@coastalhealth.org.au', 'Michael Torres',       'Michael'),
    (v_anika_patel,        'anika.patel@coastalhealth.org.au',    'Dr. Anika Patel',      'Anika'),
    (v_lisa_chang,         'lisa.chang@coastalhealth.org.au',     'Lisa Chang',           'Lisa'),
    (v_jenny_walsh,        'jenny.walsh@coastalhealth.org.au',    'Jenny Walsh',          'Jenny');

  -- ==========================================================================
  -- 3. ORGANISATION
  -- ==========================================================================

  INSERT INTO public.organisations (id, name, slug, description, timezone, financial_year_start, settings)
  VALUES (
    v_org_id,
    'Coastal Health Foundation',
    'coastal-health',
    'Coastal Health Foundation is a not-for-profit health services organisation serving the Geelong and Surf Coast regions of Victoria, Australia. Established in 1987, the Foundation delivers community health programs, operates three community health centres, and funds health research partnerships with Deakin University. Annual revenue ~$4.2M from government grants (55%), philanthropic giving (25%), and service fees (20%).',
    'Australia/Melbourne',
    7,
    '{
      "preReadReminderDays": 5,
      "paperDeadlineDays": 10,
      "watermarkEnabled": true,
      "downloadEnabled": true,
      "votingResultsVisibility": "after_close"
    }'::jsonb
  );

  -- ==========================================================================
  -- 4. ORG MEMBERSHIPS
  -- ==========================================================================

  INSERT INTO public.org_memberships (id, org_id, user_id, role, title, is_chair, is_deputy_chair, is_company_secretary, status, activated_at)
  VALUES
    -- Board members
    (v_om_david,    v_org_id, v_david_kim,          'board_member', 'Board Chair',                                            true,  false, false, 'active', now()),
    (v_om_patricia, v_org_id, v_patricia_moreau,    'board_member', 'Non-Executive Director, Chair of Finance & Audit Committee', false, false, false, 'active', now()),
    (v_om_james,    v_org_id, v_james_achebe,       'board_member', 'Non-Executive Director',                                  false, false, false, 'active', now()),
    (v_om_susan,    v_org_id, v_susan_cho,          'board_member', 'Non-Executive Director',                                  false, false, false, 'active', now()),
    (v_om_robert,   v_org_id, v_robert_menzies,     'board_member', 'Non-Executive Director, Treasurer',                       false, false, false, 'active', now()),
    (v_om_helen,    v_org_id, v_helen_papadopoulos, 'board_member', 'Non-Executive Director',                                  false, false, false, 'active', now()),
    -- Executives
    (v_om_sarah,    v_org_id, v_sarah_brennan,      'executive',    'Chief Executive Officer',                                  false, false, false, 'active', now()),
    (v_om_michael,  v_org_id, v_michael_torres,     'executive',    'Chief Financial Officer',                                  false, false, false, 'active', now()),
    (v_om_anika,    v_org_id, v_anika_patel,        'executive',    'Director of Programs',                                     false, false, false, 'active', now()),
    (v_om_lisa,     v_org_id, v_lisa_chang,          'executive',    'Director of Development & Communications',                 false, false, false, 'active', now()),
    -- Secretariat
    (v_om_jenny,    v_org_id, v_jenny_walsh,        'secretariat',  'Company Secretary & Governance Manager',                   false, false, true,  'active', now());

  -- ==========================================================================
  -- 5. COMMITTEES
  -- ==========================================================================

  INSERT INTO public.committees (id, org_id, name, slug, is_full_board, quorum_count, quorum_type, meeting_frequency, description, sort_order)
  VALUES
    (v_com_full_board,    v_org_id, 'Full Board',                         'full-board',      true,  4, 'count', 'Quarterly (Feb, Apr, Jun, Sep, Nov)',   'The governing body of Coastal Health Foundation comprising all non-executive directors.',                    0),
    (v_com_finance_audit, v_org_id, 'Finance & Audit Committee',          'finance-audit',   false, 2, 'count', 'Quarterly, 2 weeks before Full Board', 'Oversees financial management, audit, risk, and investment policy.',                                        1),
    (v_com_programs,      v_org_id, 'Programs & Impact Committee',        'programs-impact',  false, 2, 'count', 'Quarterly',                            'Reviews program effectiveness, community impact, and clinical governance.',                                 2),
    (v_com_nominations,   v_org_id, 'Nominations & Governance Committee', 'nominations',     false, 2, 'count', 'Bi-annually (Mar, Sep)',                'Board composition, director recruitment, governance policy, and board evaluation.',                         3);

  -- ==========================================================================
  -- 6. COMMITTEE MEMBERSHIPS
  -- ==========================================================================

  INSERT INTO public.committee_memberships (committee_id, org_membership_id, role_in_committee, is_default_attendee)
  VALUES
    -- Full Board: all directors + CEO + CFO + secretariat
    (v_com_full_board, v_om_david,    'chair',     true),
    (v_com_full_board, v_om_patricia, 'member',    true),
    (v_com_full_board, v_om_james,    'member',    true),
    (v_com_full_board, v_om_susan,    'member',    true),
    (v_com_full_board, v_om_robert,   'member',    true),
    (v_com_full_board, v_om_helen,    'member',    true),
    (v_com_full_board, v_om_sarah,    'observer',  true),
    (v_com_full_board, v_om_michael,  'observer',  true),
    (v_com_full_board, v_om_jenny,    'secretary', true),
    -- Finance & Audit: Patricia (chair), Robert, Michael (exec), Jenny (sec)
    (v_com_finance_audit, v_om_patricia, 'chair',     true),
    (v_com_finance_audit, v_om_robert,   'member',    true),
    (v_com_finance_audit, v_om_michael,  'observer',  true),
    (v_com_finance_audit, v_om_jenny,    'secretary', true),
    -- Programs & Impact: James, Susan, Anika (exec)
    (v_com_programs, v_om_james,  'member',    true),
    (v_com_programs, v_om_susan,  'member',    true),
    (v_com_programs, v_om_anika,  'observer',  true),
    (v_com_programs, v_om_jenny,  'secretary', true),
    -- Nominations: David, Helen, Jenny (sec)
    (v_com_nominations, v_om_david,  'chair',     true),
    (v_com_nominations, v_om_helen,  'member',    true),
    (v_com_nominations, v_om_jenny,  'secretary', true);

  -- ==========================================================================
  -- 7. MEETINGS
  -- ==========================================================================

  -- Previous meeting (February 2026) — referenced by action items
  INSERT INTO public.meetings (id, org_id, committee_id, meeting_type, status, date, start_time, end_time, timezone, location_name, location_address, published_at, concluded_at, minutes_published_at, created_by)
  VALUES (
    v_mtg_feb_2026, v_org_id, v_com_full_board, 'regular', 'minutes_published',
    '2026-02-19',
    '2026-02-19T13:00:00+11:00',
    '2026-02-19T16:30:00+11:00',
    'Australia/Melbourne',
    'Level 3, Community Health Centre',
    '48 Marine Parade, Geelong VIC 3220',
    '2026-02-12T09:00:00+11:00',
    '2026-02-19T16:30:00+11:00',
    '2026-03-05T10:00:00+11:00',
    v_jenny_walsh
  );

  -- Current meeting (April 2026)
  INSERT INTO public.meetings (id, org_id, committee_id, meeting_type, status, date, start_time, end_time, timezone, location_name, location_address, published_at, pre_read_deadline, paper_deadline, created_by)
  VALUES (
    v_mtg_apr_2026, v_org_id, v_com_full_board, 'regular', 'published',
    '2026-04-16',
    '2026-04-16T13:00:00+10:00',
    '2026-04-16T16:30:00+10:00',
    'Australia/Melbourne',
    'Level 3, Community Health Centre',
    '48 Marine Parade, Geelong VIC 3220',
    '2026-04-10T09:00:00+10:00',
    '2026-04-14T17:00:00+10:00',
    '2026-04-07T17:00:00+10:00',
    v_jenny_walsh
  );

  -- ==========================================================================
  -- 8. MEETING ATTENDEES (April meeting)
  -- ==========================================================================

  INSERT INTO public.meeting_attendees (meeting_id, org_membership_id, attendance_status, is_required)
  VALUES
    -- Directors
    (v_mtg_apr_2026, v_om_david,    'confirmed', true),
    (v_mtg_apr_2026, v_om_patricia, 'confirmed', true),
    (v_mtg_apr_2026, v_om_james,    'confirmed', true),
    (v_mtg_apr_2026, v_om_susan,    'confirmed', true),
    (v_mtg_apr_2026, v_om_robert,   'confirmed', true),
    (v_mtg_apr_2026, v_om_helen,    'declined',  true),
    -- Executives
    (v_mtg_apr_2026, v_om_sarah,    'confirmed', false),
    (v_mtg_apr_2026, v_om_michael,  'confirmed', false),
    (v_mtg_apr_2026, v_om_anika,    'confirmed', false),
    (v_mtg_apr_2026, v_om_lisa,     'confirmed', false),
    -- Secretariat
    (v_mtg_apr_2026, v_om_jenny,    'confirmed', true);

  -- ==========================================================================
  -- 9. AGENDA ITEMS
  -- ==========================================================================

  -- 1.1 Welcome
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_1_1, v_mtg_apr_2026, v_org_id, '1.1', 1, 'Opening', 1,
    'Welcome, Apologies & Declarations of Interest',
    'The Chair will open the meeting, note apologies, and invite any new or updated declarations of interest from directors. The Register of Interests is maintained by the Company Secretary.',
    'noting', '2026-04-16T13:00:00+10:00', 5, 'standard', false, 'complete', 'not_available',
    'Helen Papadopoulos has sent apologies — conflict with Shire council meeting. No proxy appointed.',
    v_jenny_walsh
  );

  -- 1.2 Minutes
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, motion_text, voting_options, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_1_2, v_mtg_apr_2026, v_org_id, '1.2', 2, 'Opening', 2,
    'Minutes of Previous Meeting & Action Items',
    'Confirmation of the minutes of the Board meeting held on 19 February 2026 as a true and correct record. Review of outstanding action items.',
    'approval', '2026-04-16T13:05:00+10:00', 10, 'standard', true,
    'That the minutes of the Board meeting held on 19 February 2026 are confirmed as a true and correct record.',
    '["Confirm", "Amend"]'::jsonb,
    'complete', v_om_jenny, '2026-04-07T17:00:00+10:00', 'not_available',
    'Two actions outstanding — both CRM-related. Lisa to provide verbal update.',
    v_jenny_walsh
  );

  -- 2.1 CEO Report
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_2_1, v_mtg_apr_2026, v_org_id, '2.1', 3, 'CEO Report', 1,
    'CEO Quarterly Report',
    'The CEO will present highlights from the quarterly operational report. The report is taken as read; the CEO will focus on 2-3 key items and invite questions.',
    'noting', '2026-04-16T13:15:00+10:00', 15, 'standard', false,
    'complete', v_om_sarah, '2026-04-07T17:00:00+10:00', 'ready',
    'Sarah plans to highlight the new Deakin research partnership and staffing challenges in regional centres.',
    v_jenny_walsh
  );

  -- 3.1 Governance Documents
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, motion_text, voting_options, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_3_1, v_mtg_apr_2026, v_org_id, '3.1', 4, 'Governance', 1,
    'Board Charter & Committee Terms of Reference — Annual Review',
    'Annual review of the Board Charter and Committee Terms of Reference. Amendments are minor and relate to updated ACNC Governance Standards effective 1 July 2026.',
    'approval', '2026-04-16T13:30:00+10:00', 15, 'standard', true,
    'That the Board approves the amended Board Charter and Committee Terms of Reference as presented.',
    '["Approve", "Approve with amendments", "Defer"]'::jsonb,
    'complete', v_om_jenny, '2026-04-07T17:00:00+10:00', 'not_available',
    'Changes tracked in red. Main amendment: ACNC Standard 5 now requires explicit risk appetite statement in Charter.',
    v_jenny_walsh
  );

  -- 4.1 Mental Health Proposal
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_4_1, v_mtg_apr_2026, v_org_id, '4.1', 5, 'Strategy', 1,
    'Regional Mental Health Outreach — New Program Proposal',
    'The Director of Programs presents a concept paper for a new 3-year community mental health outreach program targeting regional communities in the Colac-Otway and Surf Coast shires. The Board is asked to endorse the concept in principle, allowing development of a detailed business case for consideration at the June meeting.',
    'discussion', '2026-04-16T13:45:00+10:00', 30, 'standard', false,
    'in_review', v_om_anika, '2026-04-07T17:00:00+10:00', 'ready',
    E'Paper submitted 2 days late (9 April). Anika has requested 30 minutes \u2014 Chair has approved. James Achebe flagged interest given his Deakin research in this area. This will go to F&A Committee in May if endorsed.',
    v_jenny_walsh
  );

  -- 5.1 Budget
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, motion_text, voting_options, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_5_1, v_mtg_apr_2026, v_org_id, '5.1', 6, 'Finance', 1,
    'FY26 Budget Approval',
    E'The CFO presents the FY26 operating budget as reviewed and recommended by the Finance & Audit Committee at its meeting on 2 April 2026. The Committee recommends approval with a noted concern about fundraising revenue assumptions.',
    'decision', '2026-04-16T14:15:00+10:00', 25, 'standard', true,
    'That the Board approves the FY26 Operating Budget of $4.2M as recommended by the Finance & Audit Committee.',
    '["Approve", "Approve with amendments", "Defer"]'::jsonb,
    'complete', v_om_michael, '2026-04-07T17:00:00+10:00', 'ready',
    E'Patricia Moreau will present the F&A Committee''s recommendation and noted concern. Michael to present the budget detail.',
    v_jenny_walsh
  );

  -- 5.2 Investments
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, paper_owner_id, paper_deadline, iq_status, created_by)
  VALUES (
    v_item_5_2, v_mtg_apr_2026, v_org_id, '5.2', 7, 'Finance', 2,
    'Investment Portfolio Review',
    E'Quarterly review of the Foundation''s investment portfolio. Returns are tracking benchmark. No rebalancing proposed.',
    'noting', '2026-04-16T14:40:00+10:00', 10, 'standard', false,
    'complete', v_om_michael, '2026-04-07T17:00:00+10:00', 'ready',
    v_jenny_walsh
  );

  -- 6.1 Risk Register
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_6_1, v_mtg_apr_2026, v_org_id, '6.1', 8, 'Risk', 1,
    'Risk Register — Quarterly Review',
    'Updated organisational risk register for Q3 FY26. Cyber security risk rating upgraded from medium to high following ACSC sector advisory. No new critical risks identified.',
    'noting', '2026-04-16T14:50:00+10:00', 10, 'standard', false,
    'complete', v_om_michael, '2026-04-07T17:00:00+10:00', 'ready',
    E'F&A Committee reviewed in March. Patricia may wish to note Committee observations.',
    v_jenny_walsh
  );

  -- 6.2 Fundraising
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_6_2, v_mtg_apr_2026, v_org_id, '6.2', 9, 'Development', 1,
    'Donor Acquisition & Fundraising Strategy — Progress Update',
    'Quarterly progress update on the 3-year fundraising strategy adopted in 2024. Key issues: CRM implementation delayed 3 months, major gifts program on track, events revenue below forecast.',
    'discussion', '2026-04-16T15:00:00+10:00', 20, 'standard', false,
    'draft', v_om_lisa, '2026-04-07T17:00:00+10:00', 'ready',
    E'Lisa''s paper is still in draft \u2014 received 13 April, not yet reviewed by secretariat. This is late. Paper quality may need board to ask clarifying questions.',
    v_jenny_walsh
  );

  -- 7.1 CEO Performance Review
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, motion_text, voting_options, paper_status, paper_owner_id, paper_deadline, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_7_1, v_mtg_apr_2026, v_org_id, '7.1', 10, 'People', 1,
    'CEO Performance Review — Closed Session',
    'Annual review of CEO performance against KPIs established in April 2025. The Chair will present the consolidated board assessment. The proposed remuneration adjustment requires board approval. Management (CEO and executives) to withdraw for this item.',
    'decision', '2026-04-16T15:45:00+10:00', 30, 'closed_session', true,
    'That the Board approves the CEO remuneration adjustment as presented by the Chair.',
    '["Approve", "Approve with modification", "Defer"]'::jsonb,
    'complete', v_om_david, '2026-04-10T17:00:00+10:00', 'ready',
    E'Closed session \u2014 CEO and all executives to withdraw. Jenny to remain as minute-taker. Individual board assessments received from 5 of 6 directors (Helen outstanding).',
    v_jenny_walsh
  );

  -- 8.1 Close
  INSERT INTO public.agenda_items (id, meeting_id, org_id, item_number, sort_order, phase, phase_sort_order, title, description, action_type, scheduled_start, duration_minutes, confidentiality, voting_enabled, paper_status, iq_status, secretariat_notes, created_by)
  VALUES (
    v_item_8_1, v_mtg_apr_2026, v_org_id, '8.1', 11, 'Close', 1,
    'Next Meeting & Close',
    'The Chair will confirm the date of the next Board meeting and close the meeting.',
    'noting', '2026-04-16T16:15:00+10:00', 5, 'standard', false,
    'complete', 'not_available',
    'Next meeting: Thursday 18 June 2026, 1:00 PM. Same venue. Programs & Impact Committee meeting scheduled for 4 June.',
    v_jenny_walsh
  );

  -- ==========================================================================
  -- 10. AGENDA ITEM PRESENTERS
  -- ==========================================================================

  INSERT INTO public.agenda_item_presenters (agenda_item_id, org_membership_id, sort_order)
  VALUES
    -- 1.1 Welcome: David Kim
    (v_item_1_1, v_om_david, 0),
    -- 1.2 Minutes: Jenny Walsh
    (v_item_1_2, v_om_jenny, 0),
    -- 2.1 CEO Report: Sarah Brennan
    (v_item_2_1, v_om_sarah, 0),
    -- 3.1 Governance: Jenny Walsh
    (v_item_3_1, v_om_jenny, 0),
    -- 4.1 Mental Health: Anika Patel
    (v_item_4_1, v_om_anika, 0),
    -- 5.1 Budget: Michael Torres + Patricia Moreau
    (v_item_5_1, v_om_michael, 0),
    (v_item_5_1, v_om_patricia, 1),
    -- 5.2 Investments: Michael Torres
    (v_item_5_2, v_om_michael, 0),
    -- 6.1 Risk Register: Michael Torres
    (v_item_6_1, v_om_michael, 0),
    -- 6.2 Fundraising: Lisa Chang
    (v_item_6_2, v_om_lisa, 0),
    -- 7.1 CEO Performance: David Kim
    (v_item_7_1, v_om_david, 0),
    -- 8.1 Close: David Kim
    (v_item_8_1, v_om_david, 0);

  -- ==========================================================================
  -- 11. AGENDA ITEM ATTENDEES
  -- All directors get full access to all standard items.
  -- Executives get access to relevant items (excluded from closed session 7.1).
  -- ==========================================================================

  -- Items 1.1 through 6.2 (standard items) — all directors + relevant execs
  -- Directors: full access, can_vote = true for all items
  INSERT INTO public.agenda_item_attendees (agenda_item_id, org_membership_id, access_level, can_vote)
  VALUES
    -- Item 1.1 Welcome — all attendees
    (v_item_1_1, v_om_david,    'full', true),
    (v_item_1_1, v_om_patricia, 'full', true),
    (v_item_1_1, v_om_james,    'full', true),
    (v_item_1_1, v_om_susan,    'full', true),
    (v_item_1_1, v_om_robert,   'full', true),
    (v_item_1_1, v_om_helen,    'full', true),
    (v_item_1_1, v_om_sarah,    'full', false),
    (v_item_1_1, v_om_michael,  'full', false),
    (v_item_1_1, v_om_anika,    'full', false),
    (v_item_1_1, v_om_lisa,     'full', false),
    (v_item_1_1, v_om_jenny,    'full', false),

    -- Item 1.2 Minutes — all attendees
    (v_item_1_2, v_om_david,    'full', true),
    (v_item_1_2, v_om_patricia, 'full', true),
    (v_item_1_2, v_om_james,    'full', true),
    (v_item_1_2, v_om_susan,    'full', true),
    (v_item_1_2, v_om_robert,   'full', true),
    (v_item_1_2, v_om_helen,    'full', true),
    (v_item_1_2, v_om_sarah,    'full', false),
    (v_item_1_2, v_om_michael,  'full', false),
    (v_item_1_2, v_om_anika,    'full', false),
    (v_item_1_2, v_om_lisa,     'full', false),
    (v_item_1_2, v_om_jenny,    'full', false),

    -- Item 2.1 CEO Report — all attendees
    (v_item_2_1, v_om_david,    'full', true),
    (v_item_2_1, v_om_patricia, 'full', true),
    (v_item_2_1, v_om_james,    'full', true),
    (v_item_2_1, v_om_susan,    'full', true),
    (v_item_2_1, v_om_robert,   'full', true),
    (v_item_2_1, v_om_helen,    'full', true),
    (v_item_2_1, v_om_sarah,    'full', false),
    (v_item_2_1, v_om_michael,  'full', false),
    (v_item_2_1, v_om_anika,    'full', false),
    (v_item_2_1, v_om_lisa,     'full', false),
    (v_item_2_1, v_om_jenny,    'full', false),

    -- Item 3.1 Governance — all attendees
    (v_item_3_1, v_om_david,    'full', true),
    (v_item_3_1, v_om_patricia, 'full', true),
    (v_item_3_1, v_om_james,    'full', true),
    (v_item_3_1, v_om_susan,    'full', true),
    (v_item_3_1, v_om_robert,   'full', true),
    (v_item_3_1, v_om_helen,    'full', true),
    (v_item_3_1, v_om_sarah,    'full', false),
    (v_item_3_1, v_om_michael,  'full', false),
    (v_item_3_1, v_om_anika,    'full', false),
    (v_item_3_1, v_om_lisa,     'full', false),
    (v_item_3_1, v_om_jenny,    'full', false),

    -- Item 4.1 Mental Health Proposal — all attendees
    (v_item_4_1, v_om_david,    'full', true),
    (v_item_4_1, v_om_patricia, 'full', true),
    (v_item_4_1, v_om_james,    'full', true),
    (v_item_4_1, v_om_susan,    'full', true),
    (v_item_4_1, v_om_robert,   'full', true),
    (v_item_4_1, v_om_helen,    'full', true),
    (v_item_4_1, v_om_sarah,    'full', false),
    (v_item_4_1, v_om_michael,  'full', false),
    (v_item_4_1, v_om_anika,    'full', false),
    (v_item_4_1, v_om_lisa,     'full', false),
    (v_item_4_1, v_om_jenny,    'full', false),

    -- Item 5.1 Budget — all attendees
    (v_item_5_1, v_om_david,    'full', true),
    (v_item_5_1, v_om_patricia, 'full', true),
    (v_item_5_1, v_om_james,    'full', true),
    (v_item_5_1, v_om_susan,    'full', true),
    (v_item_5_1, v_om_robert,   'full', true),
    (v_item_5_1, v_om_helen,    'full', true),
    (v_item_5_1, v_om_sarah,    'full', false),
    (v_item_5_1, v_om_michael,  'full', false),
    (v_item_5_1, v_om_anika,    'full', false),
    (v_item_5_1, v_om_lisa,     'full', false),
    (v_item_5_1, v_om_jenny,    'full', false),

    -- Item 5.2 Investments — all attendees
    (v_item_5_2, v_om_david,    'full', true),
    (v_item_5_2, v_om_patricia, 'full', true),
    (v_item_5_2, v_om_james,    'full', true),
    (v_item_5_2, v_om_susan,    'full', true),
    (v_item_5_2, v_om_robert,   'full', true),
    (v_item_5_2, v_om_helen,    'full', true),
    (v_item_5_2, v_om_sarah,    'full', false),
    (v_item_5_2, v_om_michael,  'full', false),
    (v_item_5_2, v_om_anika,    'full', false),
    (v_item_5_2, v_om_lisa,     'full', false),
    (v_item_5_2, v_om_jenny,    'full', false),

    -- Item 6.1 Risk Register — all attendees
    (v_item_6_1, v_om_david,    'full', true),
    (v_item_6_1, v_om_patricia, 'full', true),
    (v_item_6_1, v_om_james,    'full', true),
    (v_item_6_1, v_om_susan,    'full', true),
    (v_item_6_1, v_om_robert,   'full', true),
    (v_item_6_1, v_om_helen,    'full', true),
    (v_item_6_1, v_om_sarah,    'full', false),
    (v_item_6_1, v_om_michael,  'full', false),
    (v_item_6_1, v_om_anika,    'full', false),
    (v_item_6_1, v_om_lisa,     'full', false),
    (v_item_6_1, v_om_jenny,    'full', false),

    -- Item 6.2 Fundraising — all attendees
    (v_item_6_2, v_om_david,    'full', true),
    (v_item_6_2, v_om_patricia, 'full', true),
    (v_item_6_2, v_om_james,    'full', true),
    (v_item_6_2, v_om_susan,    'full', true),
    (v_item_6_2, v_om_robert,   'full', true),
    (v_item_6_2, v_om_helen,    'full', true),
    (v_item_6_2, v_om_sarah,    'full', false),
    (v_item_6_2, v_om_michael,  'full', false),
    (v_item_6_2, v_om_anika,    'full', false),
    (v_item_6_2, v_om_lisa,     'full', false),
    (v_item_6_2, v_om_jenny,    'full', false),

    -- Item 7.1 CEO Performance — CLOSED SESSION: directors + Jenny only (execs excluded)
    (v_item_7_1, v_om_david,    'full', true),
    (v_item_7_1, v_om_patricia, 'full', true),
    (v_item_7_1, v_om_james,    'full', true),
    (v_item_7_1, v_om_susan,    'full', true),
    (v_item_7_1, v_om_robert,   'full', true),
    (v_item_7_1, v_om_helen,    'full', true),
    (v_item_7_1, v_om_jenny,    'full', false),
    -- Executives excluded from closed session
    (v_item_7_1, v_om_sarah,    'excluded', false),
    (v_item_7_1, v_om_michael,  'excluded', false),
    (v_item_7_1, v_om_anika,    'excluded', false),
    (v_item_7_1, v_om_lisa,     'excluded', false),

    -- Item 8.1 Close — all attendees
    (v_item_8_1, v_om_david,    'full', true),
    (v_item_8_1, v_om_patricia, 'full', true),
    (v_item_8_1, v_om_james,    'full', true),
    (v_item_8_1, v_om_susan,    'full', true),
    (v_item_8_1, v_om_robert,   'full', true),
    (v_item_8_1, v_om_helen,    'full', true),
    (v_item_8_1, v_om_sarah,    'full', false),
    (v_item_8_1, v_om_michael,  'full', false),
    (v_item_8_1, v_om_anika,    'full', false),
    (v_item_8_1, v_om_lisa,     'full', false),
    (v_item_8_1, v_om_jenny,    'full', false);

  -- ==========================================================================
  -- 12. DOCUMENTS
  -- ==========================================================================

  INSERT INTO public.documents (id, org_id, agenda_item_id, filename, file_type, file_size_bytes, page_count, storage_path, storage_bucket, processing_status, version, uploaded_by, description, sort_order, processed_at)
  VALUES
    -- Item 1.2 Documents
    (v_doc_minutes_feb,    v_org_id, v_item_1_2, 'Board_Minutes_19_February_2026.pdf',    'pdf',  942080,  7,  'documents/mtg_apr_2026/Board_Minutes_19_February_2026.pdf',    'documents', 'ready', 1, v_jenny_walsh,
     'Minutes record attendance of 5 of 6 directors (Helen Papadopoulos absent). Key decisions: approved Q2 investment rebalancing, endorsed community engagement framework, noted CEO report. Six action items assigned — four completed, two in progress (both relating to CRM vendor selection and implementation timeline).',
     0, '2026-04-08T10:00:00+10:00'),

    (v_doc_action_tracker, v_org_id, v_item_1_2, 'Action_Item_Tracker_April_2026.pdf',    'pdf',  348160,  2,  'documents/mtg_apr_2026/Action_Item_Tracker_April_2026.pdf',    'documents', 'ready', 1, v_jenny_walsh,
     'Tracks 6 actions from February meeting. Completed: (1) cyber insurance review initiated by Torres, (2) program evaluation framework drafted by Patel, (3) board skills matrix template circulated by Walsh, (4) stakeholder mapping exercise completed by Chang. Outstanding: (5) CRM vendor remediation plan — Chang — was due 15 April, now overdue, (6) updated data governance policy — Torres — due 30 April, in progress.',
     1, '2026-04-10T08:30:00+10:00'),

    -- Item 2.1 Documents
    (v_doc_ceo_report,     v_org_id, v_item_2_1, 'CEO_Report_Q3_FY26.pdf',                'pdf',  4404019, 28, 'documents/mtg_apr_2026/CEO_Report_Q3_FY26.pdf',               'documents', 'ready', 1, v_sarah_brennan,
     E'Comprehensive quarterly report covering: (1) Program delivery \u2014 community health programs served 12,400 clients in Q3, up 18% YoY by total service contacts. Three new outreach sites opened in Torquay and Anglesea. Wait times for mental health intake reduced from 14 to 9 days. (2) Staffing \u2014 3 FTE vacancies in regional centres (2 allied health, 1 nursing). Recruitment campaign underway. Staff satisfaction survey results: 72% positive (down from 76%). (3) Partnerships \u2014 MOU signed with Deakin University School of Medicine for student placements and joint research. Partnership with Barwon Health for shared intake model progressing. (4) Financial summary \u2014 revenue tracking 3% above budget YTD, driven by government grant indexation. Operating costs 1.5% below budget due to delayed regional centre fit-out. (5) Community engagement \u2014 3 community forums held in Geelong, Colac, and Lorne. Stakeholder engagement score: 6.2/10 (target: 7.0). (6) Risk \u2014 cyber security advisory from ACSC noted, IT security review commissioned. No incidents reported.',
     0, '2026-04-07T16:45:00+10:00'),

    (v_doc_program_dashboard, v_org_id, v_item_2_1, 'Program_Dashboard_March_2026.pdf',    'pdf',  1677722, 4,  'documents/mtg_apr_2026/Program_Dashboard_March_2026.pdf',      'documents', 'ready', 1, v_anika_patel,
     E'Visual dashboard showing program KPIs. Key metrics: unique participants served: 8,940 (up 14% YoY \u2014 note this differs from the 18% figure in the CEO report which uses total service contacts). Program completion rates: chronic disease management 78%, mental health 65%, maternal child health 91%. Client satisfaction: 4.3/5. Geographic breakdown shows 62% Geelong metro, 24% Surf Coast, 14% Colac-Otway.',
     1, '2026-04-07T14:20:00+10:00'),

    -- Item 3.1 Documents
    (v_doc_charter,        v_org_id, v_item_3_1, 'Board_Charter_Tracked_Changes_2026.pdf', 'pdf', 1003520, 12, 'documents/mtg_apr_2026/Board_Charter_Tracked_Changes_2026.pdf', 'documents', 'ready', 1, v_jenny_walsh,
     E'Board Charter with tracked changes. Key amendments: (1) Section 4.2 \u2014 added risk appetite statement requirement per ACNC Governance Standard 5 (effective 1 July 2026). (2) Section 6.1 \u2014 updated quorum definition to clarify proxy voting rights. (3) Section 8 \u2014 added reference to new whistleblower policy adopted November 2025. (4) Minor formatting and cross-reference corrections throughout. No substantive changes to director duties, board composition requirements, or meeting procedures.',
     0, '2026-04-06T11:00:00+10:00'),

    (v_doc_fa_tor,         v_org_id, v_item_3_1, 'Finance_Audit_Committee_TOR_Tracked_Changes.pdf', 'pdf', 655360, 6, 'documents/mtg_apr_2026/Finance_Audit_Committee_TOR_Tracked_Changes.pdf', 'documents', 'ready', 1, v_jenny_walsh,
     E'Finance & Audit Committee Terms of Reference with tracked changes. Key amendment: Section 3.4 \u2014 added responsibility for reviewing the organisation''s risk appetite statement annually and recommending to the Board. Minor update to investment policy review cycle (changed from ''bi-annually'' to ''annually'' to align with current practice).',
     1, '2026-04-06T11:05:00+10:00'),

    -- Item 4.1 Documents
    (v_doc_mh_concept,     v_org_id, v_item_4_1, 'Mental_Health_Outreach_Concept_Paper.pdf', 'pdf', 3565158, 22, 'documents/mtg_apr_2026/Mental_Health_Outreach_Concept_Paper.pdf', 'documents', 'ready', 1, v_anika_patel,
     E'Proposes a 3-year, $1.8M community mental health outreach program. The program would deploy mobile mental health teams to 6 regional communities across Colac-Otway and Surf Coast shires, providing early intervention, counselling, and referral services. Key elements: (1) Service model adapted from the Victorian ''Head to Health'' hub model, modified for regional outreach delivery with a mobile team of 4 FTE clinicians plus volunteer peer workers. (2) Target: 2,400 unique clients over 3 years, with 60% receiving ongoing support. (3) Funding model: $800K government grants (PHN mental health commissioning round, applications open July 2026), $600K philanthropic (Gandel Foundation expression of interest submitted), $400K Foundation reserves. (4) Staffing: 4 FTE clinical staff, 1 FTE coordinator, 15-20 trained volunteer peer workers. (5) Timeline: business case June 2026, PHN application July, pilot launch (Colac) January 2027, full rollout July 2027. (6) Evaluation: partnership with Deakin University for independent program evaluation.',
     0, '2026-04-09T15:30:00+10:00'),

    (v_doc_needs_assessment, v_org_id, v_item_4_1, 'Regional_Mental_Health_Needs_Assessment.pdf', 'pdf', 2936013, 16, 'documents/mtg_apr_2026/Regional_Mental_Health_Needs_Assessment.pdf', 'documents', 'ready', 1, v_anika_patel,
     E'Commissioned needs assessment conducted in partnership with Deakin University (Nov 2025 \u2013 Feb 2026). Surveyed 480 residents across 6 regional communities. Key findings: (1) 34% of respondents reported experiencing mental health difficulties in the past 12 months (vs 21% national average). (2) 58% said they would not seek help from existing services due to travel distance (avg 45 min to nearest provider), stigma in small communities, and lack of awareness. (3) 72% said they would use a local/mobile service if available. (4) Wait times for public mental health services in the region average 6-8 weeks (vs 2-3 weeks metro). (5) The region has 0.8 psychologists per 10,000 population (vs 4.2 per 10,000 in metro Melbourne). (6) Top three needs identified: anxiety/depression support (78%), youth mental health (65%), grief and loss support (52%).',
     1, '2026-04-09T15:35:00+10:00'),

    -- Item 5.1 Documents
    (v_doc_budget,         v_org_id, v_item_5_1, 'FY26_Draft_Budget_Board_Paper.pdf',      'pdf',  2202009, 14, 'documents/mtg_apr_2026/FY26_Draft_Budget_Board_Paper.pdf',     'documents', 'ready', 1, v_michael_torres,
     E'Proposed FY26 operating budget of $4.2M. Revenue: government grants $2.31M (55%, indexed at 2.5%), individual giving $630K (15%, assumes 15% uplift from new donor acquisition strategy), corporate partnerships $420K (10%), service fees $630K (15%), investment income $210K (5%). Expenditure: community programs $2.1M (50%, up 12% driven by 3 new outreach sites and planned mental health pilot), staff costs $1.26M (30%, includes 3% salary increase per EA), administration $504K (12%, down 8% from shared services efficiencies), facilities $252K (6%), fundraising $84K (2%). Net position: balanced budget with $50K allocated to reserves. Key assumptions: (1) government grant indexation confirmed at 2.5%, (2) individual giving grows 15% via new CRM-enabled donor strategy, (3) no major capital expenditure, (4) mental health pilot costs not included (separate business case pending).',
     0, '2026-04-03T09:00:00+10:00'),

    (v_doc_fa_minutes_mar, v_org_id, v_item_5_1, 'Finance_Audit_Committee_Minutes_March_2026.pdf', 'pdf', 911360, 6, 'documents/mtg_apr_2026/Finance_Audit_Committee_Minutes_March_2026.pdf', 'documents', 'ready', 1, v_jenny_walsh,
     E'F&A Committee reviewed the draft budget on 2 April. Committee resolved to recommend approval to the Board with the following noted concern: ''The Committee notes that the 15% individual giving uplift assumption is dependent on successful implementation of the new CRM system, which is currently 3 months behind schedule (see Development Director''s report). The Committee requests that management prepare a sensitivity analysis showing the impact of individual giving coming in at 0%, 5%, and 10% growth scenarios.'' Sensitivity analysis was requested but has not yet been provided. Other items: investment portfolio review (no concerns), insurance renewal approved, external audit plan endorsed.',
     1, '2026-04-05T10:00:00+10:00'),

    (v_doc_budget_variance, v_org_id, v_item_5_1, 'Budget_Variance_Analysis_FY25_vs_FY26.xlsx', 'xlsx', 1258291, 4, 'documents/mtg_apr_2026/Budget_Variance_Analysis_FY25_vs_FY26.xlsx', 'documents', 'ready', 1, v_michael_torres,
     E'Detailed line-by-line comparison of FY25 actual vs FY26 budget. Key variances: community programs up $224K (+12%), driven by new outreach sites staffing; individual giving budgeted $83K above FY25 actual (15% growth); corporate partnerships flat; admin costs down $44K (-8%) from shared IT services agreement with Barwon Health; facilities up $18K from lease indexation. FY25 finished with $127K surplus (budget was balanced), primarily from underspend on regional centre fit-out delayed to FY26.',
     2, '2026-04-07T14:00:00+10:00'),

    -- Item 5.2 Documents
    (v_doc_investments,    v_org_id, v_item_5_2, 'Investment_Report_Q3_FY26.pdf',          'pdf',  1153434, 6,  'documents/mtg_apr_2026/Investment_Report_Q3_FY26.pdf',         'documents', 'ready', 1, v_michael_torres,
     E'Portfolio value: $2.8M as at 31 March 2026. Returns: 7.2% YTD (benchmark: 7.0%). Asset allocation: Australian equities 35%, international equities 25%, fixed income 30%, cash 10% \u2014 all within policy ranges. No rebalancing required. Recommendation: maintain current allocation. Note: investment policy permits up to 5% in alternatives \u2014 management is exploring a social impact investment opportunity with Social Enterprise Finance Australia (SEFA) but no proposal at this stage.',
     0, '2026-04-07T09:00:00+10:00'),

    -- Item 6.1 Documents
    (v_doc_risk_register,  v_org_id, v_item_6_1, 'Risk_Register_Q3_FY26.pdf',              'pdf',  1153434, 8,  'documents/mtg_apr_2026/Risk_Register_Q3_FY26.pdf',            'documents', 'ready', 1, v_michael_torres,
     E'12 risks tracked. Changes this quarter: (1) Cyber security risk upgraded from Medium to High following ACSC advisory on health sector targeting \u2014 mitigation: IT security review commissioned, MFA rollout to all staff by May 2026. (2) Workforce risk remains High \u2014 3 FTE vacancies in regional centres, recruitment market tight. (3) Funding concentration risk remains Medium \u2014 55% government dependency unchanged. (4) Regulatory compliance risk downgraded from Medium to Low \u2014 ACNC reporting up to date, no outstanding issues. All other risks unchanged.',
     0, '2026-04-04T16:00:00+10:00'),

    -- Item 6.2 Documents
    (v_doc_fundraising,    v_org_id, v_item_6_2, 'Fundraising_Strategy_Q3_Progress_Report.pdf', 'pdf', 1992295, 12, 'documents/mtg_apr_2026/Fundraising_Strategy_Q3_Progress_Report.pdf', 'documents', 'ready', 1, v_lisa_chang,
     E'Progress against 3-year fundraising strategy (adopted April 2024). Overall: ''amber'' \u2014 some targets on track, some at risk. (1) Major gifts program: on track. 3 gifts of $25K+ secured in Q3 ($95K total). Pipeline of 8 prospects at cultivation stage. (2) Individual giving: at risk. CRM implementation (Salesforce NFP) delayed from January to April 2027 due to data migration issues. Without CRM, the automated donor journey campaigns planned for FY26 cannot launch. Current individual giving growth: 3% YoY (target: 15%). (3) Corporate partnerships: on track. 2 new partnerships signed ($40K annual value). (4) Events: below forecast. Annual gala raised $62K (budget: $85K). Two community events cancelled due to venue issues. (5) Bequest program: early stage. 4 bequest commitments recorded (target: 10 by end of strategy). (6) CRM status: vendor (Salesforce partner) has advised revised go-live of April 2027. Data migration from legacy system taking longer than expected. Total project cost increased from $85K to $112K (32% overrun). (7) Recommendation: Board to note progress. Management proposes revising the FY26 individual giving target from 15% to 5% growth given CRM delay.',
     0, '2026-04-13T11:00:00+10:00'),

    -- Item 7.1 Documents
    (v_doc_ceo_performance, v_org_id, v_item_7_1, 'CEO_Performance_Summary_Confidential.pdf', 'pdf', 1468006, 8, 'documents/mtg_apr_2026/CEO_Performance_Summary_Confidential.pdf', 'documents', 'ready', 1, v_david_kim,
     E'Consolidated CEO performance assessment for FY25. 5 KPIs assessed: (1) Financial sustainability \u2014 MET: delivered $127K surplus against balanced budget. (2) Program delivery \u2014 MET: program reach increased 14-18% (methodology dependent), wait times reduced, 3 new sites opened. (3) Stakeholder engagement \u2014 NOT MET: score 6.2 against target of 7.0, declining trend. Paper attributes to ''transition period'' following leadership changes in partner organisations. (4) Workforce \u2014 PARTIALLY MET: staff satisfaction 72% (target 75%), retention improved, but 3 FTE vacancies outstanding. (5) Strategic partnerships \u2014 MET: Deakin MOU signed, Barwon Health shared services progressing. Overall assessment: ''Performing well with areas for development.'' Chair recommends a 4.5% remuneration increase effective 1 July 2026.',
     0, '2026-04-10T14:00:00+10:00'),

    (v_doc_kpi_scorecard,  v_org_id, v_item_7_1, 'CEO_KPI_Scorecard_FY25.pdf',            'pdf',  573440,  3,  'documents/mtg_apr_2026/CEO_KPI_Scorecard_FY25.pdf',           'documents', 'ready', 1, v_david_kim,
     'Visual KPI scorecard. Green/amber/red traffic light format. Financial: green. Program delivery: green. Stakeholder engagement: red. Workforce: amber. Strategic partnerships: green. Overall: amber-green.',
     1, '2026-04-10T14:05:00+10:00'),

    (v_doc_remuneration,   v_org_id, v_item_7_1, 'CEO_Remuneration_Benchmarking_Report.pdf', 'pdf', 1887437, 11, 'documents/mtg_apr_2026/CEO_Remuneration_Benchmarking_Report.pdf', 'documents', 'ready', 1, v_david_kim,
     E'External benchmarking report prepared by NFP Governance Consulting. Compares CEO remuneration against 12 peer health foundations (revenue $3M-$8M, Victoria and NSW). Current CEO total remuneration: $245K (salary $225K + super $20K). Proposed $245K x 1.045 = $256K. Peer comparison: 25th percentile $218K, median $248K, 75th percentile $272K. Proposed package sits at approximately 55th percentile. Report notes that 3 of 12 peers provided no increase in FY25 due to financial constraints.',
     2, '2026-04-10T14:10:00+10:00');

  -- ==========================================================================
  -- 13. DOCUMENT READS
  -- ==========================================================================

  INSERT INTO public.document_reads (document_id, user_id, first_opened_at, last_opened_at, marked_as_read, marked_at)
  VALUES
    -- Patricia Moreau reads
    (v_doc_minutes_feb,     v_patricia_moreau, '2026-04-11T09:00:00+10:00', '2026-04-11T09:00:00+10:00', true, '2026-04-11T09:00:00+10:00'),
    (v_doc_action_tracker,  v_patricia_moreau, '2026-04-11T09:15:00+10:00', '2026-04-11T09:15:00+10:00', true, '2026-04-11T09:15:00+10:00'),
    (v_doc_budget,          v_patricia_moreau, '2026-04-11T10:00:00+10:00', '2026-04-11T10:00:00+10:00', true, '2026-04-11T10:00:00+10:00'),
    (v_doc_fa_minutes_mar,  v_patricia_moreau, '2026-04-11T10:30:00+10:00', '2026-04-11T10:30:00+10:00', true, '2026-04-11T10:30:00+10:00'),
    (v_doc_risk_register,   v_patricia_moreau, '2026-04-12T08:00:00+10:00', '2026-04-12T08:00:00+10:00', true, '2026-04-12T08:00:00+10:00'),
    (v_doc_fundraising,     v_patricia_moreau, '2026-04-13T14:00:00+10:00', '2026-04-13T14:00:00+10:00', true, '2026-04-13T14:00:00+10:00'),
    (v_doc_ceo_performance, v_patricia_moreau, '2026-04-12T11:00:00+10:00', '2026-04-12T11:00:00+10:00', true, '2026-04-12T11:00:00+10:00'),
    (v_doc_kpi_scorecard,   v_patricia_moreau, '2026-04-12T11:15:00+10:00', '2026-04-12T11:15:00+10:00', true, '2026-04-12T11:15:00+10:00'),

    -- David Kim reads (all docs)
    (v_doc_minutes_feb,     v_david_kim, '2026-04-10T10:00:00+10:00', '2026-04-10T10:00:00+10:00', true, '2026-04-10T10:00:00+10:00'),
    (v_doc_action_tracker,  v_david_kim, '2026-04-10T10:15:00+10:00', '2026-04-10T10:15:00+10:00', true, '2026-04-10T10:15:00+10:00'),
    (v_doc_ceo_report,      v_david_kim, '2026-04-10T10:30:00+10:00', '2026-04-10T10:30:00+10:00', true, '2026-04-10T10:30:00+10:00'),
    (v_doc_program_dashboard, v_david_kim, '2026-04-10T10:45:00+10:00', '2026-04-10T10:45:00+10:00', true, '2026-04-10T10:45:00+10:00'),
    (v_doc_charter,         v_david_kim, '2026-04-10T11:00:00+10:00', '2026-04-10T11:00:00+10:00', true, '2026-04-10T11:00:00+10:00'),
    (v_doc_fa_tor,          v_david_kim, '2026-04-10T11:15:00+10:00', '2026-04-10T11:15:00+10:00', true, '2026-04-10T11:15:00+10:00'),
    (v_doc_mh_concept,      v_david_kim, '2026-04-10T11:30:00+10:00', '2026-04-10T11:30:00+10:00', true, '2026-04-10T11:30:00+10:00'),
    (v_doc_needs_assessment, v_david_kim, '2026-04-10T11:45:00+10:00', '2026-04-10T11:45:00+10:00', true, '2026-04-10T11:45:00+10:00'),
    (v_doc_budget,          v_david_kim, '2026-04-10T12:00:00+10:00', '2026-04-10T12:00:00+10:00', true, '2026-04-10T12:00:00+10:00'),
    (v_doc_fa_minutes_mar,  v_david_kim, '2026-04-10T12:15:00+10:00', '2026-04-10T12:15:00+10:00', true, '2026-04-10T12:15:00+10:00'),
    (v_doc_risk_register,   v_david_kim, '2026-04-10T12:30:00+10:00', '2026-04-10T12:30:00+10:00', true, '2026-04-10T12:30:00+10:00'),
    (v_doc_fundraising,     v_david_kim, '2026-04-13T15:00:00+10:00', '2026-04-13T15:00:00+10:00', true, '2026-04-13T15:00:00+10:00'),
    (v_doc_ceo_performance, v_david_kim, '2026-04-10T14:00:00+10:00', '2026-04-10T14:00:00+10:00', true, '2026-04-10T14:00:00+10:00'),
    (v_doc_kpi_scorecard,   v_david_kim, '2026-04-10T14:15:00+10:00', '2026-04-10T14:15:00+10:00', true, '2026-04-10T14:15:00+10:00'),

    -- James Achebe reads
    (v_doc_mh_concept,      v_james_achebe, '2026-04-10T09:00:00+10:00', '2026-04-10T09:00:00+10:00', true, '2026-04-10T09:00:00+10:00'),
    (v_doc_needs_assessment, v_james_achebe, '2026-04-10T09:30:00+10:00', '2026-04-10T09:30:00+10:00', true, '2026-04-10T09:30:00+10:00'),
    (v_doc_ceo_report,      v_james_achebe, '2026-04-11T08:00:00+10:00', '2026-04-11T08:00:00+10:00', true, '2026-04-11T08:00:00+10:00'),
    (v_doc_program_dashboard, v_james_achebe, '2026-04-11T08:30:00+10:00', '2026-04-11T08:30:00+10:00', true, '2026-04-11T08:30:00+10:00'),
    (v_doc_minutes_feb,     v_james_achebe, '2026-04-11T09:00:00+10:00', '2026-04-11T09:00:00+10:00', true, '2026-04-11T09:00:00+10:00'),
    (v_doc_action_tracker,  v_james_achebe, '2026-04-11T09:15:00+10:00', '2026-04-11T09:15:00+10:00', true, '2026-04-11T09:15:00+10:00'),

    -- Susan Cho reads
    (v_doc_mh_concept,      v_susan_cho, '2026-04-10T10:00:00+10:00', '2026-04-10T10:00:00+10:00', true, '2026-04-10T10:00:00+10:00'),
    (v_doc_needs_assessment, v_susan_cho, '2026-04-10T10:30:00+10:00', '2026-04-10T10:30:00+10:00', true, '2026-04-10T10:30:00+10:00'),
    (v_doc_ceo_report,      v_susan_cho, '2026-04-11T07:00:00+10:00', '2026-04-11T07:00:00+10:00', true, '2026-04-11T07:00:00+10:00'),
    (v_doc_minutes_feb,     v_susan_cho, '2026-04-11T08:00:00+10:00', '2026-04-11T08:00:00+10:00', true, '2026-04-11T08:00:00+10:00'),
    (v_doc_action_tracker,  v_susan_cho, '2026-04-11T08:15:00+10:00', '2026-04-11T08:15:00+10:00', true, '2026-04-11T08:15:00+10:00'),
    (v_doc_charter,         v_susan_cho, '2026-04-11T09:00:00+10:00', '2026-04-11T09:00:00+10:00', true, '2026-04-11T09:00:00+10:00'),
    (v_doc_fa_tor,          v_susan_cho, '2026-04-11T09:15:00+10:00', '2026-04-11T09:15:00+10:00', true, '2026-04-11T09:15:00+10:00'),
    (v_doc_budget,          v_susan_cho, '2026-04-12T10:00:00+10:00', '2026-04-12T10:00:00+10:00', true, '2026-04-12T10:00:00+10:00'),
    (v_doc_ceo_performance, v_susan_cho, '2026-04-12T11:00:00+10:00', '2026-04-12T11:00:00+10:00', true, '2026-04-12T11:00:00+10:00'),

    -- Robert Menzies reads (most thorough — reads everything)
    (v_doc_minutes_feb,     v_robert_menzies, '2026-04-10T08:00:00+10:00', '2026-04-10T08:00:00+10:00', true, '2026-04-10T08:00:00+10:00'),
    (v_doc_action_tracker,  v_robert_menzies, '2026-04-10T08:15:00+10:00', '2026-04-10T08:15:00+10:00', true, '2026-04-10T08:15:00+10:00'),
    (v_doc_budget,          v_robert_menzies, '2026-04-10T09:00:00+10:00', '2026-04-10T09:00:00+10:00', true, '2026-04-10T09:00:00+10:00'),
    (v_doc_fa_minutes_mar,  v_robert_menzies, '2026-04-10T09:30:00+10:00', '2026-04-10T09:30:00+10:00', true, '2026-04-10T09:30:00+10:00'),
    (v_doc_budget_variance, v_robert_menzies, '2026-04-10T10:00:00+10:00', '2026-04-10T10:00:00+10:00', true, '2026-04-10T10:00:00+10:00'),
    (v_doc_investments,     v_robert_menzies, '2026-04-10T10:30:00+10:00', '2026-04-10T10:30:00+10:00', true, '2026-04-10T10:30:00+10:00'),
    (v_doc_risk_register,   v_robert_menzies, '2026-04-10T11:00:00+10:00', '2026-04-10T11:00:00+10:00', true, '2026-04-10T11:00:00+10:00'),
    (v_doc_fundraising,     v_robert_menzies, '2026-04-13T16:00:00+10:00', '2026-04-13T16:00:00+10:00', true, '2026-04-13T16:00:00+10:00'),
    (v_doc_ceo_report,      v_robert_menzies, '2026-04-11T08:00:00+10:00', '2026-04-11T08:00:00+10:00', true, '2026-04-11T08:00:00+10:00'),
    (v_doc_program_dashboard, v_robert_menzies, '2026-04-11T08:30:00+10:00', '2026-04-11T08:30:00+10:00', true, '2026-04-11T08:30:00+10:00'),
    (v_doc_charter,         v_robert_menzies, '2026-04-11T09:00:00+10:00', '2026-04-11T09:00:00+10:00', true, '2026-04-11T09:00:00+10:00'),
    (v_doc_fa_tor,          v_robert_menzies, '2026-04-11T09:15:00+10:00', '2026-04-11T09:15:00+10:00', true, '2026-04-11T09:15:00+10:00'),
    (v_doc_ceo_performance, v_robert_menzies, '2026-04-12T08:00:00+10:00', '2026-04-12T08:00:00+10:00', true, '2026-04-12T08:00:00+10:00'),
    (v_doc_kpi_scorecard,   v_robert_menzies, '2026-04-12T08:15:00+10:00', '2026-04-12T08:15:00+10:00', true, '2026-04-12T08:15:00+10:00'),
    (v_doc_remuneration,    v_robert_menzies, '2026-04-12T08:30:00+10:00', '2026-04-12T08:30:00+10:00', true, '2026-04-12T08:30:00+10:00'),
    (v_doc_mh_concept,      v_robert_menzies, '2026-04-12T09:00:00+10:00', '2026-04-12T09:00:00+10:00', true, '2026-04-12T09:00:00+10:00');

  -- Helen Papadopoulos: no reads (hasn't accessed any materials)

  -- ==========================================================================
  -- 14. IQ ANALYSES
  -- ==========================================================================

  -- IQ 2.1 — CEO Report
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_2_1, v_item_2_1, v_org_id,
    'Metric consistency flag',
    'ready',
    E'The CEO report states community program reach increased 18% year-on-year. However, the Program Dashboard shows the increase is 14% when measured by unique participants rather than total service contacts. Both numbers may be correct but the distinction matters for impact reporting to funders. The DHHS acquittal report requires unique participant counts. Additionally, the stakeholder engagement score of 6.2 is below the target of 7.0 and has declined from 6.8 in Q2 \u2014 the report acknowledges this but attributes it to ''seasonal factors'' without further analysis.',
    '[
      {"claim": "Program reach increased 18% year-on-year", "sourceCited": true, "sourceDocId": "' || v_doc_ceo_report || '", "sourcePage": 4, "consistentWithPrior": false, "flags": ["Dashboard shows 14% by unique participants — different methodology"], "confidence": "partial"},
      {"claim": "Wait times for mental health intake reduced from 14 to 9 days", "sourceCited": true, "sourceDocId": "' || v_doc_ceo_report || '", "sourcePage": 6, "consistentWithPrior": true, "flags": [], "confidence": "high"},
      {"claim": "Revenue tracking 3% above budget YTD", "sourceCited": true, "sourceDocId": "' || v_doc_ceo_report || '", "sourcePage": 12, "consistentWithPrior": true, "flags": [], "confidence": "high"},
      {"claim": "Stakeholder engagement decline due to seasonal factors", "sourceCited": false, "sourceDocId": "' || v_doc_ceo_report || '", "sourcePage": 18, "consistentWithPrior": false, "flags": ["No evidence provided for seasonal attribution", "Score has declined for two consecutive quarters"], "confidence": "low"}
    ]'::jsonb,
    '[{"assumption": "Total service contacts is an appropriate measure of program reach", "severity": "medium", "detail": "The CEO report uses total contacts while funders typically require unique participants. Using the higher number in board reporting could create inconsistency with acquittal reports."}]'::jsonb,
    '[{"flag": "Stakeholder engagement declining", "severity": "medium", "detail": "Score below target for 2 consecutive quarters. The attribution to ''seasonal factors'' is not substantiated. This is a CEO KPI (see Item 7.1).", "relatedItemIds": ["' || v_item_7_1 || '"]}]'::jsonb,
    '[{"issue": "Two different growth metrics used without reconciliation", "detail": "CEO report (18%, total contacts) vs Dashboard (14%, unique participants). The board should know which metric is reported to DHHS.", "sourceDocId": "' || v_doc_ceo_report || '"}]'::jsonb,
    '[{"agendaItemId": "' || v_item_7_1 || '", "relationshipType": "kpi_reference", "detail": "Stakeholder engagement is a CEO KPI — the miss here is relevant to the performance review discussion."}]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_ceo_report, v_doc_program_dashboard],
    '2026-04-10T10:00:00+10:00'
  );

  -- IQ 4.1 — Mental Health Proposal
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_4_1, v_item_4_1, v_org_id,
    'Evidence gaps in service model',
    'alert',
    E'The community need is well-evidenced \u2014 the Deakin survey data is robust and the regional service gap is clear. However, the proposed service model raises significant concerns. The concept paper adapts the Victorian ''Head to Health'' hub model for regional outreach, but Head to Health was designed for fixed-site urban delivery. No published evidence exists for this model''s effectiveness in regional/rural settings with dispersed populations. Three comparable programs nationally (Kimberley Mental Health Outreach WA, Rural Minds QLD, and Gippsland Wellbeing Initiative VIC) have had mixed outcomes \u2014 two were discontinued within 2 years due to low utilisation and staffing difficulties. The concept paper does not reference any of these. Additionally, the $1.8M budget assumes recruitment of 15-20 volunteer peer workers in communities where volunteer participation rates are declining. The Foundation has not previously managed a volunteer workforce at this scale.',
    '[
      {"claim": "34% of respondents experienced mental health difficulties in the past 12 months", "sourceCited": true, "sourceDocId": "' || v_doc_needs_assessment || '", "sourcePage": 8, "consistentWithPrior": true, "flags": [], "confidence": "high"},
      {"claim": "Service model adapted from Head to Health hub model", "sourceCited": true, "sourceDocId": "' || v_doc_mh_concept || '", "sourcePage": 7, "consistentWithPrior": true, "flags": ["Head to Health is a fixed-site urban model — evidence for regional adaptation not cited"], "confidence": "partial"},
      {"claim": "Target of 2,400 unique clients over 3 years", "sourceCited": true, "sourceDocId": "' || v_doc_mh_concept || '", "sourcePage": 11, "consistentWithPrior": true, "flags": ["Target implies ~67 new clients per month across 6 sites — feasibility not demonstrated"], "confidence": "partial"},
      {"claim": "15-20 volunteer peer workers can be recruited", "sourceCited": false, "sourceDocId": "' || v_doc_mh_concept || '", "sourcePage": 14, "consistentWithPrior": false, "flags": ["No volunteer recruitment plan provided", "National volunteer participation declining", "Foundation has no volunteer coordination experience"], "confidence": "low"},
      {"claim": "$800K government funding from PHN commissioning round", "sourceCited": true, "sourceDocId": "' || v_doc_mh_concept || '", "sourcePage": 16, "consistentWithPrior": true, "flags": ["Applications not yet open — funding is speculative"], "confidence": "partial"}
    ]'::jsonb,
    '[
      {"assumption": "The Head to Health urban model can be effectively adapted for regional mobile delivery", "severity": "high", "detail": "This is the core assumption of the program. No evidence is provided for this adaptation. The urban model relies on walk-in access, co-location with other services, and catchment density — none of which apply in regional settings."},
      {"assumption": "15-20 volunteer peer workers can be recruited and retained in regional communities", "severity": "high", "detail": "The program''s economics depend on volunteers handling peer support and community engagement. ABS data shows volunteer participation in regional Victoria declined 12% between 2019-2024."},
      {"assumption": "PHN commissioning round will be open and competitive", "severity": "medium", "detail": "The $800K government funding assumption rests on a grant round that hasn''t opened yet. If unsuccessful, the funding gap requires either additional philanthropy or Foundation reserves."}
    ]'::jsonb,
    '[
      {"flag": "Similar programs nationally had mixed results", "severity": "high", "detail": "Three comparable programs identified: Kimberley Mental Health Outreach (WA) — discontinued after 18 months due to low utilisation; Rural Minds (QLD) — ongoing but significantly rescoped; Gippsland Wellbeing Initiative (VIC) — discontinued after 2 years. The concept paper doesn''t reference any of these.", "relatedItemIds": []},
      {"flag": "Volunteer capability gap", "severity": "high", "detail": "The Foundation has never managed a volunteer workforce. This is a new organisational capability that introduces recruitment, training, supervision, and retention challenges.", "relatedItemIds": []},
      {"flag": "Funding not secured", "severity": "medium", "detail": "Of the $1.8M budget, only $400K (Foundation reserves) is confirmed. $800K depends on a grant round not yet open. $600K philanthropic has an expression of interest submitted but no commitment.", "relatedItemIds": ["' || v_item_5_1 || '"]}
    ]'::jsonb,
    '[
      {"issue": "No reference to comparable programs", "detail": "A concept paper of this scale should include a literature review or at minimum reference similar programs and their outcomes. The absence suggests either unawareness or omission.", "sourceDocId": "' || v_doc_mh_concept || '"},
      {"issue": "Client target methodology unclear", "detail": "The 2,400-client target is stated without derivation. At 6 sites with 4 FTE clinicians, this implies ~100 clients per clinician per year in a mobile/outreach context — feasibility not demonstrated.", "sourceDocId": "' || v_doc_mh_concept || '"}
    ]'::jsonb,
    '[
      {"agendaItemId": "' || v_item_5_1 || '", "relationshipType": "financial_dependency", "detail": "If endorsed, this program will require $400K from Foundation reserves — the same reserves that the FY26 budget assumes as a contingency buffer."},
      {"agendaItemId": "' || v_item_6_1 || '", "relationshipType": "risk_gap", "detail": "The risk register does not include this proposed program. If endorsed, it should be added with delivery risk, volunteer risk, and reputational risk."}
    ]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_mh_concept, v_doc_needs_assessment],
    '2026-04-10T10:05:00+10:00'
  );

  -- IQ 5.1 — Budget
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_5_1, v_item_5_1, v_org_id,
    'Revenue assumption at risk',
    'watch',
    E'The budget assumes a 15% increase in individual giving ($83K uplift) driven by the new donor acquisition strategy enabled by the CRM system. However, the CRM implementation is 3 months behind schedule (reported in Item 6.2). If donor acquisition targets slip, there is a $380K gap between the optimistic assumption and flat giving. The Finance & Audit Committee noted this concern and requested a sensitivity analysis, but this has not been provided to the board. The budget paper presents only the base case with no downside scenario.',
    '[
      {"claim": "Individual giving will grow 15% via new donor acquisition strategy", "sourceCited": true, "sourceDocId": "' || v_doc_budget || '", "sourcePage": 5, "consistentWithPrior": false, "flags": ["CRM enabling this strategy is 3 months delayed", "No sensitivity analysis provided despite F&A Committee request"], "confidence": "low"},
      {"claim": "Administration costs reduced 8% through shared services", "sourceCited": true, "sourceDocId": "' || v_doc_budget || '", "sourcePage": 8, "consistentWithPrior": true, "flags": [], "confidence": "high"}
    ]'::jsonb,
    '[
      {"assumption": "CRM system will be operational in time to drive FY26 donor acquisition", "severity": "high", "detail": "The CRM is 3 months behind schedule. The donor strategy depends on CRM functionality for segmentation, automated campaigns, and donor journey tracking. Without it, the 15% uplift is speculative."},
      {"assumption": "Government grant indexation at 2.5%", "severity": "low", "detail": "Confirmed in writing from DHHS. Low risk."}
    ]'::jsonb,
    '[
      {"flag": "Missing sensitivity analysis", "severity": "high", "detail": "The F&A Committee specifically requested a sensitivity analysis showing 0%, 5%, and 10% giving scenarios. This has not been provided. The board is being asked to approve a budget without understanding the downside.", "relatedItemIds": ["' || v_item_6_2 || '"]},
      {"flag": "CRM dependency", "severity": "high", "detail": "Read Items 5.1 and 6.2 together — the budget assumes a capability that is currently delayed. These are contradictory positions within the same board pack.", "relatedItemIds": ["' || v_item_6_2 || '"]}
    ]'::jsonb,
    '[]'::jsonb,
    '[
      {"agendaItemId": "' || v_item_6_2 || '", "relationshipType": "contradiction", "detail": "The budget assumes the CRM enables a 15% giving uplift, but the fundraising strategy report (6.2) reveals the CRM is 3 months behind. These papers make contradictory assumptions."},
      {"agendaItemId": "' || v_item_4_1 || '", "relationshipType": "financial_dependency", "detail": "If the mental health program is endorsed, it will require $400K from reserves — the same reserves this budget allocates only $50K to."}
    ]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_budget, v_doc_fa_minutes_mar, v_doc_budget_variance],
    '2026-04-10T10:10:00+10:00'
  );

  -- IQ 5.2 — Investments
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_5_2, v_item_5_2, v_org_id,
    'No concerns',
    'good',
    E'Portfolio is performing in line with benchmarks and asset allocation is within approved policy ranges. The mention of exploring social impact investing is noteworthy \u2014 this aligns with the Foundation''s mission but the board should be aware it''s being considered.',
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_investments],
    '2026-04-10T10:15:00+10:00'
  );

  -- IQ 6.1 — Risk Register
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_6_1, v_item_6_1, v_org_id,
    'Gap: new program risk absent',
    'watch',
    E'The risk register was prepared before the mental health outreach proposal (Item 4.1) was submitted. If the Board endorses that program in principle, the register will need updating to include: (1) program delivery risk \u2014 adapting an urban model to regional settings with no evidence base, (2) volunteer management risk \u2014 new organisational capability, (3) funding risk \u2014 56% of program budget from unconfirmed sources, (4) reputational risk \u2014 entering regional mental health space where service failures have high community visibility. The register should also note the CRM delay (Item 6.2) as a risk to the fundraising revenue assumed in the budget (Item 5.1).',
    '[]'::jsonb,
    '[]'::jsonb,
    '[
      {"flag": "Register doesn''t reflect proposed new program", "severity": "medium", "detail": "If Item 4.1 is endorsed, four new risks should be added.", "relatedItemIds": ["' || v_item_4_1 || '"]},
      {"flag": "CRM delay not captured as financial risk", "severity": "medium", "detail": "The CRM delay impacts the fundraising revenue assumption in the budget. This should be a risk entry.", "relatedItemIds": ["' || v_item_5_1 || '", "' || v_item_6_2 || '"]}
    ]'::jsonb,
    '[]'::jsonb,
    '[
      {"agendaItemId": "' || v_item_4_1 || '", "relationshipType": "risk_gap", "detail": "New program should be reflected in the risk register if endorsed."},
      {"agendaItemId": "' || v_item_5_1 || '", "relationshipType": "risk_gap", "detail": "CRM-dependent revenue assumption should be captured as a financial risk."},
      {"agendaItemId": "' || v_item_6_2 || '", "relationshipType": "risk_gap", "detail": "CRM delay itself is a project risk not currently in the register."}
    ]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_risk_register],
    '2026-04-10T10:20:00+10:00'
  );

  -- IQ 6.2 — Fundraising
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_6_2, v_item_6_2, v_org_id,
    'Linked to budget assumptions',
    'watch',
    E'This report should be read alongside the FY26 Budget (Item 5.1). The CRM delay means the donor acquisition uplift assumed in the budget will not materialise in FY26. The Development Director proposes revising the individual giving target from 15% to 5% growth \u2014 if accepted, this creates a $63K revenue shortfall against the budget. Combined with the events underperformance ($23K below target), total fundraising risk is approximately $86K. Additionally, the CRM project itself is 32% over budget ($27K cost overrun), which is not reflected in the FY26 budget.',
    '[{"claim": "CRM delayed from January to April 2027", "sourceCited": true, "sourceDocId": "' || v_doc_fundraising || '", "sourcePage": 8, "consistentWithPrior": false, "flags": ["Original timeline was January 2026 — this is now a 15-month delay, not 3 months as characterised"], "confidence": "high"}]'::jsonb,
    '[]'::jsonb,
    '[
      {"flag": "Budget and fundraising report contradict", "severity": "high", "detail": "Budget (5.1) assumes 15% giving growth. This report recommends revising to 5%. The budget should not be approved without reconciling these positions.", "relatedItemIds": ["' || v_item_5_1 || '"]},
      {"flag": "CRM cost overrun not budgeted", "severity": "medium", "detail": "$27K additional CRM cost not in the FY26 budget.", "relatedItemIds": ["' || v_item_5_1 || '"]}
    ]'::jsonb,
    '[{"issue": "Delay characterisation", "detail": "The report describes the CRM delay as ''3 months'' but the original timeline was January 2026, making the actual delay 15 months. The paper understates the extent of the slippage.", "sourceDocId": "' || v_doc_fundraising || '"}]'::jsonb,
    '[{"agendaItemId": "' || v_item_5_1 || '", "relationshipType": "contradiction", "detail": "Budget assumes 15% giving growth; this paper recommends revising to 5%."}]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_fundraising],
    '2026-04-13T12:00:00+10:00'
  );

  -- IQ 7.1 — CEO Performance
  INSERT INTO public.iq_analyses (id, agenda_item_id, org_id, headline, severity, detail, claims, assumptions, risk_flags, data_quality, related_items, model_used, prompt_version, source_doc_ids, generated_at)
  VALUES (
    v_iq_7_1, v_item_7_1, v_org_id,
    'Benchmarking context ready',
    'ready',
    E'The proposed 4.5% increase would bring total remuneration to $256K, sitting at the 55th percentile of 12 peer health foundations. 3 of 5 KPIs were met, 1 partially met, and 1 not met (stakeholder engagement \u2014 score 6.2 vs target 7.0). The performance paper acknowledges the stakeholder miss but frames it as driven by external factors. IQ notes that the stakeholder engagement score has been declining for two consecutive quarters and the CEO report (Item 2.1) also attributes it to ''seasonal factors'' without supporting data. The board should consider whether the KPI weighting appropriately reflects the miss.',
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '[{"agendaItemId": "' || v_item_2_1 || '", "relationshipType": "kpi_reference", "detail": "The stakeholder engagement score in the CEO report connects to the missed KPI here."}]'::jsonb,
    'claude-sonnet-4-20250514', 'v1.0',
    ARRAY[v_doc_ceo_performance, v_doc_kpi_scorecard, v_doc_remuneration],
    '2026-04-10T15:00:00+10:00'
  );

  -- ==========================================================================
  -- 15. IQ QUESTIONS
  -- ==========================================================================

  INSERT INTO public.iq_questions (id, iq_analysis_id, agenda_item_id, org_id, question_text, rationale, category, priority, director_framing, executive_framing, sort_order)
  VALUES
    -- Item 2.1 questions
    (v_iq_q_2_1_1, v_iq_2_1, v_item_2_1, v_org_id,
     'Is the 18% growth figure based on unique participants or total contacts? Which metric do we report to DHHS?',
     'Consistency between board reporting and funder reporting is a governance issue. The board should understand which number is definitive.',
     'governance', 1,
     'Ask the CEO to clarify which growth metric is used in funder acquittal reports and whether the board report should align.',
     'The board may ask why the CEO report and Program Dashboard show different growth figures. Prepare to explain the methodology difference and confirm which metric goes to DHHS.',
     0),

    (v_iq_q_2_1_2, v_iq_2_1, v_item_2_1, v_org_id,
     E'What''s driving the decline in stakeholder engagement scores, and what''s the recovery plan?',
     E'The score is below target and declining. The ''seasonal factors'' explanation lacks evidence. This connects to the CEO''s performance KPIs.',
     'operational', 2,
     E'Challenge the seasonal attribution \u2014 is there data supporting this? What specific actions are planned to lift the score?',
     E'Expect questions on why the engagement score keeps declining. ''Seasonal factors'' won''t satisfy the board without supporting data. Prepare a concrete improvement plan.',
     1),

    -- Item 4.1 questions
    (v_iq_q_4_1_1, v_iq_4_1, v_item_4_1, v_org_id,
     'What evidence exists that the Head to Health model works in regional settings with dispersed populations?',
     'The entire program is built on adapting an urban model. Without evidence this adaptation is viable, the board is endorsing a concept with an unproven foundation.',
     'strategic', 1,
     'Ask directly: has this model been tried in regional Australia, and what happened?',
     'The board will want to know why you chose Head to Health as the base model and what evidence supports regional adaptation. Prepare references or acknowledge the gap.',
     0),

    (v_iq_q_4_1_2, v_iq_4_1, v_item_4_1, v_org_id,
     E'How will the Foundation build volunteer coordination capability, and what''s the risk if volunteer recruitment falls short?',
     E'The program''s economics depend heavily on 15-20 volunteers. This is a new capability for the Foundation and volunteer participation is declining nationally.',
     'operational', 1,
     E'Probe the volunteer assumption \u2014 has the Foundation ever recruited volunteers at this scale? What''s plan B if they can''t?',
     'Prepare a realistic volunteer recruitment plan with timelines, or propose a paid peer worker alternative with revised costings.',
     1),

    (v_iq_q_4_1_3, v_iq_4_1, v_item_4_1, v_org_id,
     'Should the board require a single-site pilot before committing to the full 3-year, 6-site rollout?',
     'Given mixed outcomes nationally for similar programs, a staged approach would let the Foundation test the model before full commitment. The concept paper proposes a Colac pilot but immediately followed by full rollout.',
     'risk', 2,
     'Suggest endorsement be conditional on a 12-month single-site pilot with defined success criteria before scaling.',
     'The board may want to stage the commitment. Prepare success metrics for a Colac pilot and criteria for proceeding to full rollout.',
     2),

    (v_iq_q_4_1_4, v_iq_4_1, v_item_4_1, v_org_id,
     'What happens to the program if the PHN grant application is unsuccessful?',
     E'44% of the program budget ($800K) depends on a government grant round that hasn''t opened. The concept paper doesn''t address a funding shortfall scenario.',
     'financial', 2,
     E'Ask for a downside funding scenario \u2014 what''s the minimum viable version of this program if government funding doesn''t come through?',
     E'Prepare a scaled-back version of the program that could proceed on confirmed + philanthropic funding only ($1M instead of $1.8M).',
     3),

    -- Item 5.1 questions
    (v_iq_q_5_1_1, v_iq_5_1, v_item_5_1, v_org_id,
     'Where is the sensitivity analysis the F&A Committee requested?',
     E'The Committee specifically asked for 0%, 5%, and 10% giving growth scenarios. Approving the budget without this analysis means the board doesn''t understand the downside risk.',
     'financial', 1,
     E'This was a specific Committee request \u2014 hold management accountable for providing it before the board votes.',
     E'The board will ask about the sensitivity analysis. If it''s not ready, be prepared to present the scenarios verbally or propose deferring the vote.',
     0),

    (v_iq_q_5_1_2, v_iq_5_1, v_item_5_1, v_org_id,
     E'What''s the contingency if individual giving comes in flat rather than up 15%?',
     E'A flat giving scenario creates a $83K shortfall. Combined with potential mental health program reserve draw, the Foundation''s financial buffer is thin.',
     'financial', 1,
     E'Ask for the specific contingency \u2014 which budget lines would be cut if giving doesn''t grow?',
     E'Prepare a prioritised list of budget lines that could be deferred or reduced if giving underperforms. Don''t wait for the board to ask.',
     1),

    -- Item 6.1 questions
    (v_iq_q_6_1_1, v_iq_6_1, v_item_6_1, v_org_id,
     'If the mental health program is endorsed today, when will the risk register be updated to reflect the associated delivery risks?',
     E'The board shouldn''t endorse a major new initiative without understanding how its risks integrate into the organisation''s risk framework.',
     'risk', 1,
     E'Link items 4.1 and 6.1 \u2014 ask that risk register update be a condition of endorsement.',
     'If the board endorses 4.1, be prepared to commit to a risk register update at the next F&A Committee meeting.',
     0),

    -- Item 6.2 questions
    (v_iq_q_6_2_1, v_iq_6_2, v_item_6_2, v_org_id,
     'Given the CRM is now 15 months behind the original timeline, is the FY26 individual giving target still achievable at any growth rate?',
     'The budget and this paper make different implicit assumptions about the same deliverable. The board should resolve this before voting on the budget.',
     'financial', 1,
     E'Link this directly to the budget vote \u2014 ask whether the budget should be amended to reflect the revised 5% target.',
     'The board will connect this to the budget. Prepare to explain what individual giving growth is achievable WITHOUT the CRM, and what it would be WITH the CRM once live.',
     0),

    -- Item 7.1 questions
    (v_iq_q_7_1_1, v_iq_7_1, v_item_7_1, v_org_id,
     'How should the missed stakeholder engagement KPI weight against the strong financial and program outcomes?',
     E'3 of 5 KPIs met, 1 partially, 1 missed. The paper doesn''t propose a weighting \u2014 it''s up to the board to decide how much the miss matters.',
     'people', 1,
     'Before discussing the remuneration number, discuss the KPI weighting. Should a missed engagement target reduce the proposed increase?',
     NULL,
     0),

    (v_iq_q_7_1_2, v_iq_7_1, v_item_7_1, v_org_id,
     'Should the 4.5% increase be conditional on a stakeholder engagement recovery plan?',
     E'Linking the increase to a specific improvement plan creates accountability without penalising the CEO for one miss in an otherwise strong year.',
     'governance', 2,
     E'Consider proposing that the increase is approved but that stakeholder engagement is weighted more heavily in next year''s KPIs.',
     NULL,
     1);

  -- ==========================================================================
  -- 16. ACTION ITEMS (from February meeting)
  -- ==========================================================================

  INSERT INTO public.action_items (id, org_id, source_meeting_id, follow_up_meeting_id, title, description, assignee_id, due_date, status, priority, completion_notes, created_by)
  VALUES
    (v_act_1, v_org_id, v_mtg_feb_2026, v_mtg_apr_2026,
     'Obtain updated cyber insurance quote reflecting ACSC advisory',
     'Following the ACSC health sector advisory, obtain updated cyber insurance quotation from broker. Compare current coverage against recommended minimums.',
     v_om_michael, '2026-04-30', 'in_progress', 'medium',
     'Broker engaged, quote expected by 25 April.',
     v_jenny_walsh),

    (v_act_2, v_org_id, v_mtg_feb_2026, v_mtg_apr_2026,
     E'CRM vendor remediation plan \u2014 timeline and cost to complete',
     'Provide the Board with a revised CRM implementation timeline, updated total project cost, and remediation plan addressing data migration delays.',
     v_om_lisa, '2026-04-15', 'not_started', 'high',
     NULL,
     v_jenny_walsh),

    (v_act_3, v_org_id, v_mtg_feb_2026, NULL,
     E'Board skills matrix \u2014 complete annual update and gap analysis',
     E'Update the board skills matrix with current director self-assessments. Prepare gap analysis against the Foundation''s strategic priorities for review by Nominations Committee.',
     v_om_jenny, '2026-05-01', 'not_started', 'low',
     NULL,
     v_jenny_walsh),

    (v_act_4, v_org_id, v_mtg_feb_2026, NULL,
     E'Stakeholder engagement strategy \u2014 proposal for Board consideration',
     'CEO to develop a stakeholder engagement improvement strategy addressing the below-target engagement scores, for presentation to the June Board meeting.',
     v_om_sarah, '2026-06-18', 'not_started', 'medium',
     NULL,
     v_jenny_walsh);

  -- ==========================================================================
  -- 17. NOTEBOOK ENTRIES (Patricia's saved IQ questions)
  -- ==========================================================================

  INSERT INTO public.notebook_entries (id, user_id, org_id, meeting_id, agenda_item_id, title, content, is_starred, source, source_reference_id, tags, created_at)
  VALUES
    (v_note_1, v_patricia_moreau, v_org_id, v_mtg_apr_2026, v_item_5_1,
     E'Budget \u2014 revenue assumption question',
     E'From IQ: Where is the sensitivity analysis the F&A Committee requested? This was a specific Committee request \u2014 I need to hold Michael accountable for providing it before the board votes. If it''s not ready, I''ll propose deferring the vote.\n\nMy note: I raised this at Committee. Michael said he''d have it by Board day. If he doesn''t, I''ll recommend we approve with a condition that the sensitivity analysis is provided within 2 weeks.',
     true, 'iq_question', v_iq_q_5_1_1,
     ARRAY['budget', 'revenue', 'sensitivity'],
     '2026-04-11T10:45:00+10:00'),

    (v_note_2, v_patricia_moreau, v_org_id, v_mtg_apr_2026, v_item_5_1,
     E'Budget \u2014 contingency question',
     E'From IQ: What''s the contingency if individual giving comes in flat rather than up 15%?\n\nMy note: The answer should be specific budget lines that would be cut. Community programs should be protected. Admin and fundraising costs should be the first to reduce. Ask Michael to quantify.',
     true, 'iq_question', v_iq_q_5_1_2,
     ARRAY['budget', 'contingency'],
     '2026-04-11T10:50:00+10:00');

  -- ==========================================================================
  -- 18. NOTIFICATIONS (for Patricia)
  -- ==========================================================================

  INSERT INTO public.notifications (id, org_id, user_id, type, title, body, reference_type, reference_id, is_read, created_at)
  VALUES
    (v_notif_1, v_org_id, v_patricia_moreau, 'document_uploaded',
     'New document uploaded',
     'Lisa Chang uploaded Fundraising Strategy Q3 Progress Report to Item 6.2',
     'document', v_doc_fundraising, false, '2026-04-13T11:00:00+10:00'),

    (v_notif_2, v_org_id, v_patricia_moreau, 'paper_deadline',
     'Paper overdue',
     E'Dr. Anika Patel''s concept paper for Item 4.1 was submitted 2 days late and is still in review',
     'agenda_item', v_item_4_1, false, '2026-04-12T09:00:00+10:00'),

    (v_notif_3, v_org_id, v_patricia_moreau, 'document_uploaded',
     'Budget paper finalised',
     'Michael Torres marked the FY26 Budget Board Paper as complete',
     'document', v_doc_budget, true, '2026-04-10T09:30:00+10:00'),

    (v_notif_4, v_org_id, v_patricia_moreau, 'nudge',
     'Board readiness alert',
     E'Helen Papadopoulos hasn''t accessed any meeting materials (5 days since last login)',
     'user', v_helen_papadopoulos, false, '2026-04-13T08:00:00+10:00'),

    (v_notif_5, v_org_id, v_patricia_moreau, 'meeting_published',
     'Agenda published',
     'The April Board meeting agenda has been published with 11 items and 18 documents',
     'meeting', v_mtg_apr_2026, true, '2026-04-10T09:00:00+10:00'),

    (v_notif_6, v_org_id, v_patricia_moreau, 'action_due_soon',
     'Action item overdue',
     E'CRM vendor remediation plan (Lisa Chang) was due 15 April \u2014 now overdue',
     'action_item', v_act_2, false, '2026-04-13T09:00:00+10:00');

END $$;
