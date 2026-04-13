// BoardIQ Demo — Complete Mock Data (TypeScript)
// Coastal Health Foundation — Board of Directors Meeting
// Thursday 16 April 2026, 1:00 PM – 4:30 PM

import type {
  Organisation,
  User,
  Committee,
  Meeting,
  AgendaItem,
  DocumentReads,
  ActionItem,
  NotebookEntry,
  Notification,
  BriefingNarratives,
} from './types';

// ═══════════════════════════════════════════════════
// 1. ORGANISATION
// ═══════════════════════════════════════════════════

export const organisation: Organisation = {
  id: 'org_coastal_health',
  name: 'Coastal Health Foundation',
  slug: 'coastal-health',
  description:
    "Coastal Health Foundation is a not-for-profit health services organisation serving the Geelong and Surf Coast regions of Victoria, Australia. Established in 1987, the Foundation delivers community health programs, operates three community health centres, and funds health research partnerships with Deakin University. Annual revenue ~$4.2M from government grants (55%), philanthropic giving (25%), and service fees (20%).",
  timezone: 'Australia/Melbourne',
  financialYearStart: 7,
  logoUrl: null,
  settings: {
    preReadReminderDays: 5,
    paperDeadlineDays: 10,
    watermarkEnabled: true,
    downloadEnabled: true,
    votingResultsVisibility: 'after_close',
  },
};

// ═══════════════════════════════════════════════════
// 2. COMMITTEES
// ═══════════════════════════════════════════════════

export const committees: Committee[] = [
  {
    id: 'com_full_board',
    name: 'Full Board',
    slug: 'full-board',
    isFullBoard: true,
    quorumCount: 4,
    quorumType: 'count',
    meetingFrequency: 'Quarterly (Feb, Apr, Jun, Sep, Nov)',
    description: 'The governing body of Coastal Health Foundation comprising all non-executive directors.',
  },
  {
    id: 'com_finance_audit',
    name: 'Finance & Audit Committee',
    slug: 'finance-audit',
    isFullBoard: false,
    quorumCount: 2,
    quorumType: 'count',
    meetingFrequency: 'Quarterly, 2 weeks before Full Board',
    description: 'Oversees financial management, audit, risk, and investment policy.',
  },
  {
    id: 'com_programs',
    name: 'Programs & Impact Committee',
    slug: 'programs-impact',
    isFullBoard: false,
    quorumCount: 2,
    quorumType: 'count',
    meetingFrequency: 'Quarterly',
    description: 'Reviews program effectiveness, community impact, and clinical governance.',
  },
  {
    id: 'com_nominations',
    name: 'Nominations & Governance Committee',
    slug: 'nominations',
    isFullBoard: false,
    quorumCount: 2,
    quorumType: 'count',
    meetingFrequency: 'Bi-annually (Mar, Sep)',
    description: 'Board composition, director recruitment, governance policy, and board evaluation.',
  },
];

// ═══════════════════════════════════════════════════
// 3. USERS & MEMBERSHIPS
// ═══════════════════════════════════════════════════

export const users: User[] = [
  // ─── Board Members ───
  {
    id: 'user_david_kim',
    email: 'david.kim@coastalhealth.org.au',
    fullName: 'David Kim',
    displayName: 'David',
    role: 'board_member',
    title: 'Board Chair',
    isChair: true,
    committees: ['com_full_board', 'com_nominations'],
    bio: 'Retired CEO of Western Health. 15 years board experience across health and education. Appointed Chair in 2023.',
    avatarInitials: 'DK',
  },
  {
    id: 'user_patricia_moreau',
    email: 'patricia.moreau@outlook.com',
    fullName: 'Patricia Moreau',
    displayName: 'Patricia',
    role: 'board_member',
    title: 'Non-Executive Director, Chair of Finance & Audit Committee',
    isChair: false,
    committees: ['com_full_board', 'com_finance_audit'],
    bio: 'Partner at Deloitte (retired). CPA, GAICD. Specialist in NFP financial governance. Appointed 2021.',
    avatarInitials: 'PM',
  },
  {
    id: 'user_james_achebe',
    email: 'james.achebe@deakin.edu.au',
    fullName: 'James Achebe',
    displayName: 'James',
    role: 'board_member',
    title: 'Non-Executive Director',
    isChair: false,
    committees: ['com_full_board', 'com_programs'],
    bio: 'Associate Professor of Public Health, Deakin University. Research focus on regional health service delivery. Appointed 2022.',
    avatarInitials: 'JA',
  },
  {
    id: 'user_susan_cho',
    email: 'susan.cho@barwonhealth.org.au',
    fullName: 'Dr. Susan Cho',
    displayName: 'Susan',
    role: 'board_member',
    title: 'Non-Executive Director',
    isChair: false,
    committees: ['com_full_board', 'com_programs'],
    bio: 'General Practitioner and former Chair of the Barwon GP Network. Clinical governance expertise. Appointed 2020.',
    avatarInitials: 'SC',
  },
  {
    id: 'user_robert_menzies',
    email: 'robert.menzies@gmail.com',
    fullName: 'Robert Menzies',
    displayName: 'Robert',
    role: 'board_member',
    title: 'Non-Executive Director, Treasurer',
    isChair: false,
    committees: ['com_full_board', 'com_finance_audit'],
    bio: 'CFO of Geelong Port Corporation. Fellow of CPA Australia. Board Treasurer since 2022.',
    avatarInitials: 'RM',
  },
  {
    id: 'user_helen_papadopoulos',
    email: 'helen.p@surfcoast.vic.gov.au',
    fullName: 'Helen Papadopoulos',
    displayName: 'Helen',
    role: 'board_member',
    title: 'Non-Executive Director',
    isChair: false,
    committees: ['com_full_board', 'com_nominations'],
    bio: 'Director of Community Services, Surf Coast Shire. Expertise in community engagement and local government. Appointed 2024.',
    avatarInitials: 'HP',
  },

  // ─── Executive Team ───
  {
    id: 'user_sarah_brennan',
    email: 'sarah.brennan@coastalhealth.org.au',
    fullName: 'Sarah Brennan',
    displayName: 'Sarah',
    role: 'executive',
    title: 'Chief Executive Officer',
    committees: ['com_full_board'],
    bio: 'CEO since 2021. Previously Deputy CEO at Barwon Health. MBA (Melbourne), Grad Dip Health Admin.',
    avatarInitials: 'SB',
  },
  {
    id: 'user_michael_torres',
    email: 'michael.torres@coastalhealth.org.au',
    fullName: 'Michael Torres',
    displayName: 'Michael',
    role: 'executive',
    title: 'Chief Financial Officer',
    committees: ['com_full_board', 'com_finance_audit'],
    bio: 'CFO since 2019. CPA, MBA. Previously Finance Manager at Epworth HealthCare.',
    avatarInitials: 'MT',
  },
  {
    id: 'user_anika_patel',
    email: 'anika.patel@coastalhealth.org.au',
    fullName: 'Dr. Anika Patel',
    displayName: 'Anika',
    role: 'executive',
    title: 'Director of Programs',
    committees: ['com_programs'],
    bio: 'Leads all community health programs. PhD in Community Health (Monash). Joined 2020.',
    avatarInitials: 'AP',
  },
  {
    id: 'user_lisa_chang',
    email: 'lisa.chang@coastalhealth.org.au',
    fullName: 'Lisa Chang',
    displayName: 'Lisa',
    role: 'executive',
    title: 'Director of Development & Communications',
    committees: [],
    bio: 'Leads fundraising, marketing, and stakeholder engagement. Previously at Red Cross Australia.',
    avatarInitials: 'LC',
  },

  // ─── Secretariat ───
  {
    id: 'user_jenny_walsh',
    email: 'jenny.walsh@coastalhealth.org.au',
    fullName: 'Jenny Walsh',
    displayName: 'Jenny',
    role: 'secretariat',
    title: 'Company Secretary & Governance Manager',
    committees: ['com_full_board', 'com_finance_audit', 'com_programs', 'com_nominations'],
    bio: 'Company Secretary since 2018. FGIA, GAICD. Manages all governance operations.',
    avatarInitials: 'JW',
  },
];

// ═══════════════════════════════════════════════════
// 4. MEETING
// ═══════════════════════════════════════════════════

export const meeting: Meeting = {
  id: 'mtg_apr_2026',
  orgId: 'org_coastal_health',
  committeeId: 'com_full_board',
  title: null,
  meetingType: 'regular',
  status: 'published',
  date: '2026-04-16',
  startTime: '2026-04-16T13:00:00+10:00',
  endTime: '2026-04-16T16:30:00+10:00',
  timezone: 'Australia/Melbourne',
  locationName: 'Level 3, Community Health Centre',
  locationAddress: '48 Marine Parade, Geelong VIC 3220',
  virtualLink: null,
  publishedAt: '2026-04-10T09:00:00+10:00',
  preReadDeadline: '2026-04-14T17:00:00+10:00',
  paperDeadline: '2026-04-07T17:00:00+10:00',
  daysUntil: 3,
  previousMeeting: {
    id: 'mtg_feb_2026',
    date: '2026-02-19',
    minutesStatus: 'published',
  },
};

// ═══════════════════════════════════════════════════
// 5. AGENDA ITEMS — FULL DETAIL
// ═══════════════════════════════════════════════════

export const agendaItems: AgendaItem[] = [
  // ─── 1.1 WELCOME ───
  {
    id: 'item_1_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '1.1',
    sortOrder: 1,
    phase: 'Opening',
    phaseSortOrder: 1,
    title: 'Welcome, Apologies & Declarations of Interest',
    description: 'The Chair will open the meeting, note apologies, and invite any new or updated declarations of interest from directors. The Register of Interests is maintained by the Company Secretary.',
    actionType: 'noting',
    scheduledStart: '2026-04-16T13:00:00+10:00',
    durationMinutes: 5,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'complete',
    paperOwnerId: null,
    paperDeadline: null,
    secretariatNotes: 'Helen Papadopoulos has sent apologies — conflict with Shire council meeting. No proxy appointed.',
    iqStatus: 'not_available',
    presenters: [
      { userId: 'user_david_kim', name: 'David Kim', title: 'Board Chair', isExternal: false },
    ],
    documents: [],
    iqAnalysis: null,
  },

  // ─── 1.2 MINUTES ───
  {
    id: 'item_1_2',
    meetingId: 'mtg_apr_2026',
    itemNumber: '1.2',
    sortOrder: 2,
    phase: 'Opening',
    phaseSortOrder: 2,
    title: 'Minutes of Previous Meeting & Action Items',
    description: 'Confirmation of the minutes of the Board meeting held on 19 February 2026 as a true and correct record. Review of outstanding action items.',
    actionType: 'approval',
    scheduledStart: '2026-04-16T13:05:00+10:00',
    durationMinutes: 10,
    confidentiality: 'standard',
    votingEnabled: true,
    motionText: 'That the minutes of the Board meeting held on 19 February 2026 are confirmed as a true and correct record.',
    votingOptions: ['Confirm', 'Amend'],
    paperStatus: 'complete',
    paperOwnerId: 'user_jenny_walsh',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: "Two actions outstanding — both CRM-related. Lisa to provide verbal update.",
    iqStatus: 'not_available',
    presenters: [
      { userId: 'user_jenny_walsh', name: 'Jenny Walsh', title: 'Company Secretary', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_minutes_feb',
        filename: 'Board_Minutes_19_February_2026.pdf',
        fileType: 'pdf',
        pageCount: 7,
        fileSize: '920 KB',
        uploadedBy: 'user_jenny_walsh',
        uploadedAt: '2026-04-08T10:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Minutes record attendance of 5 of 6 directors (Helen Papadopoulos absent). Key decisions: approved Q2 investment rebalancing, endorsed community engagement framework, noted CEO report. Six action items assigned — four completed, two in progress (both relating to CRM vendor selection and implementation timeline).",
      },
      {
        id: 'doc_action_tracker',
        filename: 'Action_Item_Tracker_April_2026.pdf',
        fileType: 'pdf',
        pageCount: 2,
        fileSize: '340 KB',
        uploadedBy: 'user_jenny_walsh',
        uploadedAt: '2026-04-10T08:30:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Tracks 6 actions from February meeting. Completed: (1) cyber insurance review initiated by Torres, (2) program evaluation framework drafted by Patel, (3) board skills matrix template circulated by Walsh, (4) stakeholder mapping exercise completed by Chang. Outstanding: (5) CRM vendor remediation plan — Chang — was due 15 April, now overdue, (6) updated data governance policy — Torres — due 30 April, in progress.",
      },
    ],
    iqAnalysis: null,
  },

  // ─── 2.1 CEO REPORT ───
  {
    id: 'item_2_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '2.1',
    sortOrder: 3,
    phase: 'CEO Report',
    phaseSortOrder: 1,
    title: 'CEO Quarterly Report',
    description: "The CEO will present highlights from the quarterly operational report. The report is taken as read; the CEO will focus on 2-3 key items and invite questions.",
    actionType: 'noting',
    scheduledStart: '2026-04-16T13:15:00+10:00',
    durationMinutes: 15,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'complete',
    paperOwnerId: 'user_sarah_brennan',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: 'Sarah plans to highlight the new Deakin research partnership and staffing challenges in regional centres.',
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_sarah_brennan', name: 'Sarah Brennan', title: 'CEO', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_ceo_report',
        filename: 'CEO_Report_Q3_FY26.pdf',
        fileType: 'pdf',
        pageCount: 28,
        fileSize: '4.2 MB',
        uploadedBy: 'user_sarah_brennan',
        uploadedAt: '2026-04-07T16:45:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Comprehensive quarterly report covering: (1) Program delivery — community health programs served 12,400 clients in Q3, up 18% YoY by total service contacts. Three new outreach sites opened in Torquay and Anglesea. Wait times for mental health intake reduced from 14 to 9 days. (2) Staffing — 3 FTE vacancies in regional centres (2 allied health, 1 nursing). Recruitment campaign underway. Staff satisfaction survey results: 72% positive (down from 76%). (3) Partnerships — MOU signed with Deakin University School of Medicine for student placements and joint research. Partnership with Barwon Health for shared intake model progressing. (4) Financial summary — revenue tracking 3% above budget YTD, driven by government grant indexation. Operating costs 1.5% below budget due to delayed regional centre fit-out. (5) Community engagement — 3 community forums held in Geelong, Colac, and Lorne. Stakeholder engagement score: 6.2/10 (target: 7.0). (6) Risk — cyber security advisory from ACSC noted, IT security review commissioned. No incidents reported.",
      },
      {
        id: 'doc_program_dashboard',
        filename: 'Program_Dashboard_March_2026.pdf',
        fileType: 'pdf',
        pageCount: 4,
        fileSize: '1.6 MB',
        uploadedBy: 'user_anika_patel',
        uploadedAt: '2026-04-07T14:20:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Visual dashboard showing program KPIs. Key metrics: unique participants served: 8,940 (up 14% YoY — note this differs from the 18% figure in the CEO report which uses total service contacts). Program completion rates: chronic disease management 78%, mental health 65%, maternal child health 91%. Client satisfaction: 4.3/5. Geographic breakdown shows 62% Geelong metro, 24% Surf Coast, 14% Colac-Otway.",
      },
    ],
    iqAnalysis: {
      id: 'iq_2_1',
      headline: 'Metric consistency flag',
      severity: 'ready',
      detail: "The CEO report states community program reach increased 18% year-on-year. However, the Program Dashboard shows the increase is 14% when measured by unique participants rather than total service contacts. Both numbers may be correct but the distinction matters for impact reporting to funders. The DHHS acquittal report requires unique participant counts. Additionally, the stakeholder engagement score of 6.2 is below the target of 7.0 and has declined from 6.8 in Q2 — the report acknowledges this but attributes it to 'seasonal factors' without further analysis.",
      claims: [
        {
          claim: 'Program reach increased 18% year-on-year',
          sourceCited: true,
          sourceDocId: 'doc_ceo_report',
          sourcePage: 4,
          consistentWithPrior: false,
          flags: ['Dashboard shows 14% by unique participants — different methodology'],
          confidence: 'partial',
        },
        {
          claim: 'Wait times for mental health intake reduced from 14 to 9 days',
          sourceCited: true,
          sourceDocId: 'doc_ceo_report',
          sourcePage: 6,
          consistentWithPrior: true,
          flags: [],
          confidence: 'high',
        },
        {
          claim: 'Revenue tracking 3% above budget YTD',
          sourceCited: true,
          sourceDocId: 'doc_ceo_report',
          sourcePage: 12,
          consistentWithPrior: true,
          flags: [],
          confidence: 'high',
        },
        {
          claim: "Stakeholder engagement decline due to seasonal factors",
          sourceCited: false,
          sourceDocId: 'doc_ceo_report',
          sourcePage: 18,
          consistentWithPrior: false,
          flags: ['No evidence provided for seasonal attribution', 'Score has declined for two consecutive quarters'],
          confidence: 'low',
        },
      ],
      assumptions: [
        {
          assumption: 'Total service contacts is an appropriate measure of program reach',
          severity: 'medium',
          detail: 'The CEO report uses total contacts while funders typically require unique participants. Using the higher number in board reporting could create inconsistency with acquittal reports.',
        },
      ],
      riskFlags: [
        {
          flag: 'Stakeholder engagement declining',
          severity: 'medium',
          detail: "Score below target for 2 consecutive quarters. The attribution to 'seasonal factors' is not substantiated. This is a CEO KPI (see Item 7.1).",
          relatedItemIds: ['item_7_1'],
        },
      ],
      dataQuality: [
        {
          issue: 'Two different growth metrics used without reconciliation',
          detail: 'CEO report (18%, total contacts) vs Dashboard (14%, unique participants). The board should know which metric is reported to DHHS.',
          sourceDocId: 'doc_ceo_report',
        },
      ],
      relatedItems: [
        {
          agendaItemId: 'item_7_1',
          relationshipType: 'kpi_reference',
          detail: 'Stakeholder engagement is a CEO KPI — the miss here is relevant to the performance review discussion.',
        },
      ],
      questions: [
        {
          id: 'iq_q_2_1_1',
          questionText: 'Is the 18% growth figure based on unique participants or total contacts? Which metric do we report to DHHS?',
          rationale: 'Consistency between board reporting and funder reporting is a governance issue. The board should understand which number is definitive.',
          category: 'governance',
          priority: 1,
          directorFraming: 'Ask the CEO to clarify which growth metric is used in funder acquittal reports and whether the board report should align.',
          executiveFraming: 'The board may ask why the CEO report and Program Dashboard show different growth figures. Prepare to explain the methodology difference and confirm which metric goes to DHHS.',
        },
        {
          id: 'iq_q_2_1_2',
          questionText: "What's driving the decline in stakeholder engagement scores, and what's the recovery plan?",
          rationale: "The score is below target and declining. The 'seasonal factors' explanation lacks evidence. This connects to the CEO's performance KPIs.",
          category: 'operational',
          priority: 2,
          directorFraming: 'Challenge the seasonal attribution — is there data supporting this? What specific actions are planned to lift the score?',
          executiveFraming: "Expect questions on why the engagement score keeps declining. 'Seasonal factors' won't satisfy the board without supporting data. Prepare a concrete improvement plan.",
        },
      ],
    },
  },

  // ─── 3.1 GOVERNANCE DOCUMENTS ───
  {
    id: 'item_3_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '3.1',
    sortOrder: 4,
    phase: 'Governance',
    phaseSortOrder: 1,
    title: 'Board Charter & Committee Terms of Reference — Annual Review',
    description: 'Annual review of the Board Charter and Committee Terms of Reference. Amendments are minor and relate to updated ACNC Governance Standards effective 1 July 2026.',
    actionType: 'approval',
    scheduledStart: '2026-04-16T13:30:00+10:00',
    durationMinutes: 15,
    confidentiality: 'standard',
    votingEnabled: true,
    motionText: 'That the Board approves the amended Board Charter and Committee Terms of Reference as presented.',
    votingOptions: ['Approve', 'Approve with amendments', 'Defer'],
    paperStatus: 'complete',
    paperOwnerId: 'user_jenny_walsh',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: 'Changes tracked in red. Main amendment: ACNC Standard 5 now requires explicit risk appetite statement in Charter.',
    iqStatus: 'not_available',
    presenters: [
      { userId: 'user_jenny_walsh', name: 'Jenny Walsh', title: 'Company Secretary', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_charter',
        filename: 'Board_Charter_Tracked_Changes_2026.pdf',
        fileType: 'pdf',
        pageCount: 12,
        fileSize: '980 KB',
        uploadedBy: 'user_jenny_walsh',
        uploadedAt: '2026-04-06T11:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Board Charter with tracked changes. Key amendments: (1) Section 4.2 — added risk appetite statement requirement per ACNC Governance Standard 5 (effective 1 July 2026). (2) Section 6.1 — updated quorum definition to clarify proxy voting rights. (3) Section 8 — added reference to new whistleblower policy adopted November 2025. (4) Minor formatting and cross-reference corrections throughout. No substantive changes to director duties, board composition requirements, or meeting procedures.",
      },
      {
        id: 'doc_fa_tor',
        filename: 'Finance_Audit_Committee_TOR_Tracked_Changes.pdf',
        fileType: 'pdf',
        pageCount: 6,
        fileSize: '640 KB',
        uploadedBy: 'user_jenny_walsh',
        uploadedAt: '2026-04-06T11:05:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Finance & Audit Committee Terms of Reference with tracked changes. Key amendment: Section 3.4 — added responsibility for reviewing the organisation's risk appetite statement annually and recommending to the Board. Minor update to investment policy review cycle (changed from 'bi-annually' to 'annually' to align with current practice).",
      },
    ],
    iqAnalysis: null,
  },

  // ─── 4.1 MENTAL HEALTH PROPOSAL ───
  {
    id: 'item_4_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '4.1',
    sortOrder: 5,
    phase: 'Strategy',
    phaseSortOrder: 1,
    title: 'Regional Mental Health Outreach — New Program Proposal',
    description: 'The Director of Programs presents a concept paper for a new 3-year community mental health outreach program targeting regional communities in the Colac-Otway and Surf Coast shires. The Board is asked to endorse the concept in principle, allowing development of a detailed business case for consideration at the June meeting.',
    actionType: 'discussion',
    scheduledStart: '2026-04-16T13:45:00+10:00',
    durationMinutes: 30,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'in_review',
    paperOwnerId: 'user_anika_patel',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: "Paper submitted 2 days late (9 April). Anika has requested 30 minutes — Chair has approved. James Achebe flagged interest given his Deakin research in this area. This will go to F&A Committee in May if endorsed.",
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_anika_patel', name: 'Dr. Anika Patel', title: 'Director of Programs', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_mh_concept',
        filename: 'Mental_Health_Outreach_Concept_Paper.pdf',
        fileType: 'pdf',
        pageCount: 22,
        fileSize: '3.4 MB',
        uploadedBy: 'user_anika_patel',
        uploadedAt: '2026-04-09T15:30:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Proposes a 3-year, $1.8M community mental health outreach program. The program would deploy mobile mental health teams to 6 regional communities across Colac-Otway and Surf Coast shires, providing early intervention, counselling, and referral services. Key elements: (1) Service model adapted from the Victorian 'Head to Health' hub model, modified for regional outreach delivery with a mobile team of 4 FTE clinicians plus volunteer peer workers. (2) Target: 2,400 unique clients over 3 years, with 60% receiving ongoing support. (3) Funding model: $800K government grants (PHN mental health commissioning round, applications open July 2026), $600K philanthropic (Gandel Foundation expression of interest submitted), $400K Foundation reserves. (4) Staffing: 4 FTE clinical staff, 1 FTE coordinator, 15-20 trained volunteer peer workers. (5) Timeline: business case June 2026, PHN application July, pilot launch (Colac) January 2027, full rollout July 2027. (6) Evaluation: partnership with Deakin University for independent program evaluation.",
      },
      {
        id: 'doc_needs_assessment',
        filename: 'Regional_Mental_Health_Needs_Assessment.pdf',
        fileType: 'pdf',
        pageCount: 16,
        fileSize: '2.8 MB',
        uploadedBy: 'user_anika_patel',
        uploadedAt: '2026-04-09T15:35:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Commissioned needs assessment conducted in partnership with Deakin University (Nov 2025 – Feb 2026). Surveyed 480 residents across 6 regional communities. Key findings: (1) 34% of respondents reported experiencing mental health difficulties in the past 12 months (vs 21% national average). (2) 58% said they would not seek help from existing services due to travel distance (avg 45 min to nearest provider), stigma in small communities, and lack of awareness. (3) 72% said they would use a local/mobile service if available. (4) Wait times for public mental health services in the region average 6-8 weeks (vs 2-3 weeks metro). (5) The region has 0.8 psychologists per 10,000 population (vs 4.2 per 10,000 in metro Melbourne). (6) Top three needs identified: anxiety/depression support (78%), youth mental health (65%), grief and loss support (52%).",
      },
    ],
    iqAnalysis: {
      id: 'iq_4_1',
      headline: 'Evidence gaps in service model',
      severity: 'alert',
      detail: "The community need is well-evidenced — the Deakin survey data is robust and the regional service gap is clear. However, the proposed service model raises significant concerns. The concept paper adapts the Victorian 'Head to Health' hub model for regional outreach, but Head to Health was designed for fixed-site urban delivery. No published evidence exists for this model's effectiveness in regional/rural settings with dispersed populations. Three comparable programs nationally (Kimberley Mental Health Outreach WA, Rural Minds QLD, and Gippsland Wellbeing Initiative VIC) have had mixed outcomes — two were discontinued within 2 years due to low utilisation and staffing difficulties. The concept paper does not reference any of these. Additionally, the $1.8M budget assumes recruitment of 15-20 volunteer peer workers in communities where volunteer participation rates are declining. The Foundation has not previously managed a volunteer workforce at this scale.",
      claims: [
        {
          claim: '34% of respondents experienced mental health difficulties in the past 12 months',
          sourceCited: true,
          sourceDocId: 'doc_needs_assessment',
          sourcePage: 8,
          consistentWithPrior: true,
          flags: [],
          confidence: 'high',
        },
        {
          claim: "Service model adapted from Head to Health hub model",
          sourceCited: true,
          sourceDocId: 'doc_mh_concept',
          sourcePage: 7,
          consistentWithPrior: true,
          flags: ['Head to Health is a fixed-site urban model — evidence for regional adaptation not cited'],
          confidence: 'partial',
        },
        {
          claim: 'Target of 2,400 unique clients over 3 years',
          sourceCited: true,
          sourceDocId: 'doc_mh_concept',
          sourcePage: 11,
          consistentWithPrior: true,
          flags: ['Target implies ~67 new clients per month across 6 sites — feasibility not demonstrated'],
          confidence: 'partial',
        },
        {
          claim: '15-20 volunteer peer workers can be recruited',
          sourceCited: false,
          sourceDocId: 'doc_mh_concept',
          sourcePage: 14,
          consistentWithPrior: false,
          flags: ['No volunteer recruitment plan provided', 'National volunteer participation declining', 'Foundation has no volunteer coordination experience'],
          confidence: 'low',
        },
        {
          claim: '$800K government funding from PHN commissioning round',
          sourceCited: true,
          sourceDocId: 'doc_mh_concept',
          sourcePage: 16,
          consistentWithPrior: true,
          flags: ['Applications not yet open — funding is speculative'],
          confidence: 'partial',
        },
      ],
      assumptions: [
        {
          assumption: 'The Head to Health urban model can be effectively adapted for regional mobile delivery',
          severity: 'high',
          detail: 'This is the core assumption of the program. No evidence is provided for this adaptation. The urban model relies on walk-in access, co-location with other services, and catchment density — none of which apply in regional settings.',
        },
        {
          assumption: '15-20 volunteer peer workers can be recruited and retained in regional communities',
          severity: 'high',
          detail: "The program's economics depend on volunteers handling peer support and community engagement. ABS data shows volunteer participation in regional Victoria declined 12% between 2019-2024.",
        },
        {
          assumption: 'PHN commissioning round will be open and competitive',
          severity: 'medium',
          detail: "The $800K government funding assumption rests on a grant round that hasn't opened yet. If unsuccessful, the funding gap requires either additional philanthropy or Foundation reserves.",
        },
      ],
      riskFlags: [
        {
          flag: 'Similar programs nationally had mixed results',
          severity: 'high',
          detail: "Three comparable programs identified: Kimberley Mental Health Outreach (WA) — discontinued after 18 months due to low utilisation; Rural Minds (QLD) — ongoing but significantly rescoped; Gippsland Wellbeing Initiative (VIC) — discontinued after 2 years. The concept paper doesn't reference any of these.",
          relatedItemIds: [],
        },
        {
          flag: 'Volunteer capability gap',
          severity: 'high',
          detail: 'The Foundation has never managed a volunteer workforce. This is a new organisational capability that introduces recruitment, training, supervision, and retention challenges.',
          relatedItemIds: [],
        },
        {
          flag: 'Funding not secured',
          severity: 'medium',
          detail: "Of the $1.8M budget, only $400K (Foundation reserves) is confirmed. $800K depends on a grant round not yet open. $600K philanthropic has an expression of interest submitted but no commitment.",
          relatedItemIds: ['item_5_1'],
        },
      ],
      dataQuality: [
        {
          issue: 'No reference to comparable programs',
          detail: 'A concept paper of this scale should include a literature review or at minimum reference similar programs and their outcomes. The absence suggests either unawareness or omission.',
          sourceDocId: 'doc_mh_concept',
        },
        {
          issue: 'Client target methodology unclear',
          detail: 'The 2,400-client target is stated without derivation. At 6 sites with 4 FTE clinicians, this implies ~100 clients per clinician per year in a mobile/outreach context — feasibility not demonstrated.',
          sourceDocId: 'doc_mh_concept',
        },
      ],
      relatedItems: [
        {
          agendaItemId: 'item_5_1',
          relationshipType: 'financial_dependency',
          detail: 'If endorsed, this program will require $400K from Foundation reserves — the same reserves that the FY26 budget assumes as a contingency buffer.',
        },
        {
          agendaItemId: 'item_6_1',
          relationshipType: 'risk_gap',
          detail: 'The risk register does not include this proposed program. If endorsed, it should be added with delivery risk, volunteer risk, and reputational risk.',
        },
      ],
      questions: [
        {
          id: 'iq_q_4_1_1',
          questionText: 'What evidence exists that the Head to Health model works in regional settings with dispersed populations?',
          rationale: 'The entire program is built on adapting an urban model. Without evidence this adaptation is viable, the board is endorsing a concept with an unproven foundation.',
          category: 'strategic',
          priority: 1,
          directorFraming: 'Ask directly: has this model been tried in regional Australia, and what happened?',
          executiveFraming: 'The board will want to know why you chose Head to Health as the base model and what evidence supports regional adaptation. Prepare references or acknowledge the gap.',
        },
        {
          id: 'iq_q_4_1_2',
          questionText: "How will the Foundation build volunteer coordination capability, and what's the risk if volunteer recruitment falls short?",
          rationale: "The program's economics depend heavily on 15-20 volunteers. This is a new capability for the Foundation and volunteer participation is declining nationally.",
          category: 'operational',
          priority: 1,
          directorFraming: "Probe the volunteer assumption — has the Foundation ever recruited volunteers at this scale? What's plan B if they can't?",
          executiveFraming: 'Prepare a realistic volunteer recruitment plan with timelines, or propose a paid peer worker alternative with revised costings.',
        },
        {
          id: 'iq_q_4_1_3',
          questionText: 'Should the board require a single-site pilot before committing to the full 3-year, 6-site rollout?',
          rationale: 'Given mixed outcomes nationally for similar programs, a staged approach would let the Foundation test the model before full commitment. The concept paper proposes a Colac pilot but immediately followed by full rollout.',
          category: 'risk',
          priority: 2,
          directorFraming: 'Suggest endorsement be conditional on a 12-month single-site pilot with defined success criteria before scaling.',
          executiveFraming: 'The board may want to stage the commitment. Prepare success metrics for a Colac pilot and criteria for proceeding to full rollout.',
        },
        {
          id: 'iq_q_4_1_4',
          questionText: "What happens to the program if the PHN grant application is unsuccessful?",
          rationale: "44% of the program budget ($800K) depends on a government grant round that hasn't opened. The concept paper doesn't address a funding shortfall scenario.",
          category: 'financial',
          priority: 2,
          directorFraming: "Ask for a downside funding scenario — what's the minimum viable version of this program if government funding doesn't come through?",
          executiveFraming: 'Prepare a scaled-back version of the program that could proceed on confirmed + philanthropic funding only ($1M instead of $1.8M).',
        },
      ],
    },
  },

  // ─── 5.1 BUDGET ───
  {
    id: 'item_5_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '5.1',
    sortOrder: 6,
    phase: 'Finance',
    phaseSortOrder: 1,
    title: 'FY26 Budget Approval',
    description: "The CFO presents the FY26 operating budget as reviewed and recommended by the Finance & Audit Committee at its meeting on 2 April 2026. The Committee recommends approval with a noted concern about fundraising revenue assumptions.",
    actionType: 'decision',
    scheduledStart: '2026-04-16T14:15:00+10:00',
    durationMinutes: 25,
    confidentiality: 'standard',
    votingEnabled: true,
    motionText: 'That the Board approves the FY26 Operating Budget of $4.2M as recommended by the Finance & Audit Committee.',
    votingOptions: ['Approve', 'Approve with amendments', 'Defer'],
    paperStatus: 'complete',
    paperOwnerId: 'user_michael_torres',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: "Patricia Moreau will present the F&A Committee's recommendation and noted concern. Michael to present the budget detail.",
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_michael_torres', name: 'Michael Torres', title: 'CFO', isExternal: false },
      { userId: 'user_patricia_moreau', name: 'Patricia Moreau', title: 'Chair, F&A Committee', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_budget',
        filename: 'FY26_Draft_Budget_Board_Paper.pdf',
        fileType: 'pdf',
        pageCount: 14,
        fileSize: '2.1 MB',
        uploadedBy: 'user_michael_torres',
        uploadedAt: '2026-04-03T09:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Proposed FY26 operating budget of $4.2M. Revenue: government grants $2.31M (55%, indexed at 2.5%), individual giving $630K (15%, assumes 15% uplift from new donor acquisition strategy), corporate partnerships $420K (10%), service fees $630K (15%), investment income $210K (5%). Expenditure: community programs $2.1M (50%, up 12% driven by 3 new outreach sites and planned mental health pilot), staff costs $1.26M (30%, includes 3% salary increase per EA), administration $504K (12%, down 8% from shared services efficiencies), facilities $252K (6%), fundraising $84K (2%). Net position: balanced budget with $50K allocated to reserves. Key assumptions: (1) government grant indexation confirmed at 2.5%, (2) individual giving grows 15% via new CRM-enabled donor strategy, (3) no major capital expenditure, (4) mental health pilot costs not included (separate business case pending).",
      },
      {
        id: 'doc_fa_minutes_mar',
        filename: 'Finance_Audit_Committee_Minutes_March_2026.pdf',
        fileType: 'pdf',
        pageCount: 6,
        fileSize: '890 KB',
        uploadedBy: 'user_jenny_walsh',
        uploadedAt: '2026-04-05T10:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "F&A Committee reviewed the draft budget on 2 April. Committee resolved to recommend approval to the Board with the following noted concern: 'The Committee notes that the 15% individual giving uplift assumption is dependent on successful implementation of the new CRM system, which is currently 3 months behind schedule (see Development Director's report). The Committee requests that management prepare a sensitivity analysis showing the impact of individual giving coming in at 0%, 5%, and 10% growth scenarios.' Sensitivity analysis was requested but has not yet been provided. Other items: investment portfolio review (no concerns), insurance renewal approved, external audit plan endorsed.",
      },
      {
        id: 'doc_budget_variance',
        filename: 'Budget_Variance_Analysis_FY25_vs_FY26.xlsx',
        fileType: 'xlsx',
        pageCount: 4,
        fileSize: '1.2 MB',
        uploadedBy: 'user_michael_torres',
        uploadedAt: '2026-04-07T14:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Detailed line-by-line comparison of FY25 actual vs FY26 budget. Key variances: community programs up $224K (+12%), driven by new outreach sites staffing; individual giving budgeted $83K above FY25 actual (15% growth); corporate partnerships flat; admin costs down $44K (-8%) from shared IT services agreement with Barwon Health; facilities up $18K from lease indexation. FY25 finished with $127K surplus (budget was balanced), primarily from underspend on regional centre fit-out delayed to FY26.",
      },
    ],
    iqAnalysis: {
      id: 'iq_5_1',
      headline: 'Revenue assumption at risk',
      severity: 'watch',
      detail: "The budget assumes a 15% increase in individual giving ($83K uplift) driven by the new donor acquisition strategy enabled by the CRM system. However, the CRM implementation is 3 months behind schedule (reported in Item 6.2). If donor acquisition targets slip, there is a $380K gap between the optimistic assumption and flat giving. The Finance & Audit Committee noted this concern and requested a sensitivity analysis, but this has not been provided to the board. The budget paper presents only the base case with no downside scenario.",
      claims: [
        {
          claim: 'Individual giving will grow 15% via new donor acquisition strategy',
          sourceCited: true,
          sourceDocId: 'doc_budget',
          sourcePage: 5,
          consistentWithPrior: false,
          flags: ['CRM enabling this strategy is 3 months delayed', 'No sensitivity analysis provided despite F&A Committee request'],
          confidence: 'low',
        },
        {
          claim: 'Administration costs reduced 8% through shared services',
          sourceCited: true,
          sourceDocId: 'doc_budget',
          sourcePage: 8,
          consistentWithPrior: true,
          flags: [],
          confidence: 'high',
        },
      ],
      assumptions: [
        {
          assumption: 'CRM system will be operational in time to drive FY26 donor acquisition',
          severity: 'high',
          detail: 'The CRM is 3 months behind schedule. The donor strategy depends on CRM functionality for segmentation, automated campaigns, and donor journey tracking. Without it, the 15% uplift is speculative.',
        },
        {
          assumption: 'Government grant indexation at 2.5%',
          severity: 'low',
          detail: 'Confirmed in writing from DHHS. Low risk.',
        },
      ],
      riskFlags: [
        {
          flag: 'Missing sensitivity analysis',
          severity: 'high',
          detail: "The F&A Committee specifically requested a sensitivity analysis showing 0%, 5%, and 10% giving scenarios. This has not been provided. The board is being asked to approve a budget without understanding the downside.",
          relatedItemIds: ['item_6_2'],
        },
        {
          flag: 'CRM dependency',
          severity: 'high',
          detail: 'Read Items 5.1 and 6.2 together — the budget assumes a capability that is currently delayed. These are contradictory positions within the same board pack.',
          relatedItemIds: ['item_6_2'],
        },
      ],
      dataQuality: [],
      relatedItems: [
        {
          agendaItemId: 'item_6_2',
          relationshipType: 'contradiction',
          detail: 'The budget assumes the CRM enables a 15% giving uplift, but the fundraising strategy report (6.2) reveals the CRM is 3 months behind. These papers make contradictory assumptions.',
        },
        {
          agendaItemId: 'item_4_1',
          relationshipType: 'financial_dependency',
          detail: 'If the mental health program is endorsed, it will require $400K from reserves — the same reserves this budget allocates only $50K to.',
        },
      ],
      questions: [
        {
          id: 'iq_q_5_1_1',
          questionText: 'Where is the sensitivity analysis the F&A Committee requested?',
          rationale: "The Committee specifically asked for 0%, 5%, and 10% giving growth scenarios. Approving the budget without this analysis means the board doesn't understand the downside risk.",
          category: 'financial',
          priority: 1,
          directorFraming: "This was a specific Committee request — hold management accountable for providing it before the board votes.",
          executiveFraming: "The board will ask about the sensitivity analysis. If it's not ready, be prepared to present the scenarios verbally or propose deferring the vote.",
        },
        {
          id: 'iq_q_5_1_2',
          questionText: "What's the contingency if individual giving comes in flat rather than up 15%?",
          rationale: "A flat giving scenario creates a $83K shortfall. Combined with potential mental health program reserve draw, the Foundation's financial buffer is thin.",
          category: 'financial',
          priority: 1,
          directorFraming: 'Ask for the specific contingency — which budget lines would be cut if giving doesn\'t grow?',
          executiveFraming: "Prepare a prioritised list of budget lines that could be deferred or reduced if giving underperforms. Don't wait for the board to ask.",
        },
      ],
    },
  },

  // ─── 5.2 INVESTMENTS ───
  {
    id: 'item_5_2',
    meetingId: 'mtg_apr_2026',
    itemNumber: '5.2',
    sortOrder: 7,
    phase: 'Finance',
    phaseSortOrder: 2,
    title: 'Investment Portfolio Review',
    description: "Quarterly review of the Foundation's investment portfolio. Returns are tracking benchmark. No rebalancing proposed.",
    actionType: 'noting',
    scheduledStart: '2026-04-16T14:40:00+10:00',
    durationMinutes: 10,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'complete',
    paperOwnerId: 'user_michael_torres',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: null,
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_michael_torres', name: 'Michael Torres', title: 'CFO', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_investments',
        filename: 'Investment_Report_Q3_FY26.pdf',
        fileType: 'pdf',
        pageCount: 6,
        fileSize: '1.1 MB',
        uploadedBy: 'user_michael_torres',
        uploadedAt: '2026-04-07T09:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Portfolio value: $2.8M as at 31 March 2026. Returns: 7.2% YTD (benchmark: 7.0%). Asset allocation: Australian equities 35%, international equities 25%, fixed income 30%, cash 10% — all within policy ranges. No rebalancing required. Recommendation: maintain current allocation. Note: investment policy permits up to 5% in alternatives — management is exploring a social impact investment opportunity with Social Enterprise Finance Australia (SEFA) but no proposal at this stage.",
      },
    ],
    iqAnalysis: {
      id: 'iq_5_2',
      headline: 'No concerns',
      severity: 'good',
      detail: "Portfolio is performing in line with benchmarks and asset allocation is within approved policy ranges. The mention of exploring social impact investing is noteworthy — this aligns with the Foundation's mission but the board should be aware it's being considered.",
      claims: [],
      assumptions: [],
      riskFlags: [],
      dataQuality: [],
      relatedItems: [],
      questions: [],
    },
  },

  // ─── 6.1 RISK REGISTER ───
  {
    id: 'item_6_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '6.1',
    sortOrder: 8,
    phase: 'Risk',
    phaseSortOrder: 1,
    title: 'Risk Register — Quarterly Review',
    description: 'Updated organisational risk register for Q3 FY26. Cyber security risk rating upgraded from medium to high following ACSC sector advisory. No new critical risks identified.',
    actionType: 'noting',
    scheduledStart: '2026-04-16T14:50:00+10:00',
    durationMinutes: 10,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'complete',
    paperOwnerId: 'user_michael_torres',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: "F&A Committee reviewed in March. Patricia may wish to note Committee observations.",
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_michael_torres', name: 'Michael Torres', title: 'CFO', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_risk_register',
        filename: 'Risk_Register_Q3_FY26.pdf',
        fileType: 'pdf',
        pageCount: 8,
        fileSize: '1.1 MB',
        uploadedBy: 'user_michael_torres',
        uploadedAt: '2026-04-04T16:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "12 risks tracked. Changes this quarter: (1) Cyber security risk upgraded from Medium to High following ACSC advisory on health sector targeting — mitigation: IT security review commissioned, MFA rollout to all staff by May 2026. (2) Workforce risk remains High — 3 FTE vacancies in regional centres, recruitment market tight. (3) Funding concentration risk remains Medium — 55% government dependency unchanged. (4) Regulatory compliance risk downgraded from Medium to Low — ACNC reporting up to date, no outstanding issues. All other risks unchanged.",
      },
    ],
    iqAnalysis: {
      id: 'iq_6_1',
      headline: 'Gap: new program risk absent',
      severity: 'watch',
      detail: "The risk register was prepared before the mental health outreach proposal (Item 4.1) was submitted. If the Board endorses that program in principle, the register will need updating to include: (1) program delivery risk — adapting an urban model to regional settings with no evidence base, (2) volunteer management risk — new organisational capability, (3) funding risk — 56% of program budget from unconfirmed sources, (4) reputational risk — entering regional mental health space where service failures have high community visibility. The register should also note the CRM delay (Item 6.2) as a risk to the fundraising revenue assumed in the budget (Item 5.1).",
      claims: [],
      assumptions: [],
      riskFlags: [
        {
          flag: "Register doesn't reflect proposed new program",
          severity: 'medium',
          detail: 'If Item 4.1 is endorsed, four new risks should be added.',
          relatedItemIds: ['item_4_1'],
        },
        {
          flag: 'CRM delay not captured as financial risk',
          severity: 'medium',
          detail: 'The CRM delay impacts the fundraising revenue assumption in the budget. This should be a risk entry.',
          relatedItemIds: ['item_5_1', 'item_6_2'],
        },
      ],
      dataQuality: [],
      relatedItems: [
        {
          agendaItemId: 'item_4_1',
          relationshipType: 'risk_gap',
          detail: 'New program should be reflected in the risk register if endorsed.',
        },
        {
          agendaItemId: 'item_5_1',
          relationshipType: 'risk_gap',
          detail: 'CRM-dependent revenue assumption should be captured as a financial risk.',
        },
        {
          agendaItemId: 'item_6_2',
          relationshipType: 'risk_gap',
          detail: 'CRM delay itself is a project risk not currently in the register.',
        },
      ],
      questions: [
        {
          id: 'iq_q_6_1_1',
          questionText: 'If the mental health program is endorsed today, when will the risk register be updated to reflect the associated delivery risks?',
          rationale: "The board shouldn't endorse a major new initiative without understanding how its risks integrate into the organisation's risk framework.",
          category: 'risk',
          priority: 1,
          directorFraming: 'Link items 4.1 and 6.1 — ask that risk register update be a condition of endorsement.',
          executiveFraming: "If the board endorses 4.1, be prepared to commit to a risk register update at the next F&A Committee meeting.",
        },
      ],
    },
  },

  // ─── 6.2 FUNDRAISING ───
  {
    id: 'item_6_2',
    meetingId: 'mtg_apr_2026',
    itemNumber: '6.2',
    sortOrder: 9,
    phase: 'Development',
    phaseSortOrder: 1,
    title: 'Donor Acquisition & Fundraising Strategy — Progress Update',
    description: 'Quarterly progress update on the 3-year fundraising strategy adopted in 2024. Key issues: CRM implementation delayed 3 months, major gifts program on track, events revenue below forecast.',
    actionType: 'discussion',
    scheduledStart: '2026-04-16T15:00:00+10:00',
    durationMinutes: 20,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'draft',
    paperOwnerId: 'user_lisa_chang',
    paperDeadline: '2026-04-07T17:00:00+10:00',
    secretariatNotes: "Lisa's paper is still in draft — received 13 April, not yet reviewed by secretariat. This is late. Paper quality may need board to ask clarifying questions.",
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_lisa_chang', name: 'Lisa Chang', title: 'Director of Development', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_fundraising',
        filename: 'Fundraising_Strategy_Q3_Progress_Report.pdf',
        fileType: 'pdf',
        pageCount: 12,
        fileSize: '1.9 MB',
        uploadedBy: 'user_lisa_chang',
        uploadedAt: '2026-04-13T11:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Progress against 3-year fundraising strategy (adopted April 2024). Overall: 'amber' — some targets on track, some at risk. (1) Major gifts program: on track. 3 gifts of $25K+ secured in Q3 ($95K total). Pipeline of 8 prospects at cultivation stage. (2) Individual giving: at risk. CRM implementation (Salesforce NFP) delayed from January to April 2027 due to data migration issues. Without CRM, the automated donor journey campaigns planned for FY26 cannot launch. Current individual giving growth: 3% YoY (target: 15%). (3) Corporate partnerships: on track. 2 new partnerships signed ($40K annual value). (4) Events: below forecast. Annual gala raised $62K (budget: $85K). Two community events cancelled due to venue issues. (5) Bequest program: early stage. 4 bequest commitments recorded (target: 10 by end of strategy). (6) CRM status: vendor (Salesforce partner) has advised revised go-live of April 2027. Data migration from legacy system taking longer than expected. Total project cost increased from $85K to $112K (32% overrun). (7) Recommendation: Board to note progress. Management proposes revising the FY26 individual giving target from 15% to 5% growth given CRM delay.",
      },
    ],
    iqAnalysis: {
      id: 'iq_6_2',
      headline: 'Linked to budget assumptions',
      severity: 'watch',
      detail: "This report should be read alongside the FY26 Budget (Item 5.1). The CRM delay means the donor acquisition uplift assumed in the budget will not materialise in FY26. The Development Director proposes revising the individual giving target from 15% to 5% growth — if accepted, this creates a $63K revenue shortfall against the budget. Combined with the events underperformance ($23K below target), total fundraising risk is approximately $86K. Additionally, the CRM project itself is 32% over budget ($27K cost overrun), which is not reflected in the FY26 budget.",
      claims: [
        {
          claim: 'CRM delayed from January to April 2027',
          sourceCited: true,
          sourceDocId: 'doc_fundraising',
          sourcePage: 8,
          consistentWithPrior: false,
          flags: ['Original timeline was January 2026 — this is now a 15-month delay, not 3 months as characterised'],
          confidence: 'high',
        },
      ],
      assumptions: [],
      riskFlags: [
        {
          flag: 'Budget and fundraising report contradict',
          severity: 'high',
          detail: 'Budget (5.1) assumes 15% giving growth. This report recommends revising to 5%. The budget should not be approved without reconciling these positions.',
          relatedItemIds: ['item_5_1'],
        },
        {
          flag: 'CRM cost overrun not budgeted',
          severity: 'medium',
          detail: '$27K additional CRM cost not in the FY26 budget.',
          relatedItemIds: ['item_5_1'],
        },
      ],
      dataQuality: [
        {
          issue: 'Delay characterisation',
          detail: "The report describes the CRM delay as '3 months' but the original timeline was January 2026, making the actual delay 15 months. The paper understates the extent of the slippage.",
          sourceDocId: 'doc_fundraising',
        },
      ],
      relatedItems: [
        {
          agendaItemId: 'item_5_1',
          relationshipType: 'contradiction',
          detail: 'Budget assumes 15% giving growth; this paper recommends revising to 5%.',
        },
      ],
      questions: [
        {
          id: 'iq_q_6_2_1',
          questionText: 'Given the CRM is now 15 months behind the original timeline, is the FY26 individual giving target still achievable at any growth rate?',
          rationale: 'The budget and this paper make different implicit assumptions about the same deliverable. The board should resolve this before voting on the budget.',
          category: 'financial',
          priority: 1,
          directorFraming: "Link this directly to the budget vote — ask whether the budget should be amended to reflect the revised 5% target.",
          executiveFraming: 'The board will connect this to the budget. Prepare to explain what individual giving growth is achievable WITHOUT the CRM, and what it would be WITH the CRM once live.',
        },
      ],
    },
  },

  // ─── 7.1 CEO PERFORMANCE REVIEW ───
  {
    id: 'item_7_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '7.1',
    sortOrder: 10,
    phase: 'People',
    phaseSortOrder: 1,
    title: 'CEO Performance Review — Closed Session',
    description: 'Annual review of CEO performance against KPIs established in April 2025. The Chair will present the consolidated board assessment. The proposed remuneration adjustment requires board approval. Management (CEO and executives) to withdraw for this item.',
    actionType: 'decision',
    scheduledStart: '2026-04-16T15:45:00+10:00',
    durationMinutes: 30,
    confidentiality: 'closed_session',
    votingEnabled: true,
    motionText: 'That the Board approves the CEO remuneration adjustment as presented by the Chair.',
    votingOptions: ['Approve', 'Approve with modification', 'Defer'],
    paperStatus: 'complete',
    paperOwnerId: 'user_david_kim',
    paperDeadline: '2026-04-10T17:00:00+10:00',
    secretariatNotes: "Closed session — CEO and all executives to withdraw. Jenny to remain as minute-taker. Individual board assessments received from 5 of 6 directors (Helen outstanding).",
    iqStatus: 'ready',
    presenters: [
      { userId: 'user_david_kim', name: 'David Kim', title: 'Board Chair', isExternal: false },
    ],
    documents: [
      {
        id: 'doc_ceo_performance',
        filename: 'CEO_Performance_Summary_Confidential.pdf',
        fileType: 'pdf',
        pageCount: 8,
        fileSize: '1.4 MB',
        uploadedBy: 'user_david_kim',
        uploadedAt: '2026-04-10T14:00:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "Consolidated CEO performance assessment for FY25. 5 KPIs assessed: (1) Financial sustainability — MET: delivered $127K surplus against balanced budget. (2) Program delivery — MET: program reach increased 14-18% (methodology dependent), wait times reduced, 3 new sites opened. (3) Stakeholder engagement — NOT MET: score 6.2 against target of 7.0, declining trend. Paper attributes to 'transition period' following leadership changes in partner organisations. (4) Workforce — PARTIALLY MET: staff satisfaction 72% (target 75%), retention improved, but 3 FTE vacancies outstanding. (5) Strategic partnerships — MET: Deakin MOU signed, Barwon Health shared services progressing. Overall assessment: 'Performing well with areas for development.' Chair recommends a 4.5% remuneration increase effective 1 July 2026.",
      },
      {
        id: 'doc_kpi_scorecard',
        filename: 'CEO_KPI_Scorecard_FY25.pdf',
        fileType: 'pdf',
        pageCount: 3,
        fileSize: '560 KB',
        uploadedBy: 'user_david_kim',
        uploadedAt: '2026-04-10T14:05:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: 'Visual KPI scorecard. Green/amber/red traffic light format. Financial: green. Program delivery: green. Stakeholder engagement: red. Workforce: amber. Strategic partnerships: green. Overall: amber-green.',
      },
      {
        id: 'doc_remuneration',
        filename: 'CEO_Remuneration_Benchmarking_Report.pdf',
        fileType: 'pdf',
        pageCount: 11,
        fileSize: '1.8 MB',
        uploadedBy: 'user_david_kim',
        uploadedAt: '2026-04-10T14:10:00+10:00',
        processingStatus: 'ready',
        version: 1,
        summary: "External benchmarking report prepared by NFP Governance Consulting. Compares CEO remuneration against 12 peer health foundations (revenue $3M-$8M, Victoria and NSW). Current CEO total remuneration: $245K (salary $225K + super $20K). Proposed $245K x 1.045 = $256K. Peer comparison: 25th percentile $218K, median $248K, 75th percentile $272K. Proposed package sits at approximately 55th percentile. Report notes that 3 of 12 peers provided no increase in FY25 due to financial constraints.",
      },
    ],
    iqAnalysis: {
      id: 'iq_7_1',
      headline: 'Benchmarking context ready',
      severity: 'ready',
      detail: "The proposed 4.5% increase would bring total remuneration to $256K, sitting at the 55th percentile of 12 peer health foundations. 3 of 5 KPIs were met, 1 partially met, and 1 not met (stakeholder engagement — score 6.2 vs target 7.0). The performance paper acknowledges the stakeholder miss but frames it as driven by external factors. IQ notes that the stakeholder engagement score has been declining for two consecutive quarters and the CEO report (Item 2.1) also attributes it to 'seasonal factors' without supporting data. The board should consider whether the KPI weighting appropriately reflects the miss.",
      claims: [],
      assumptions: [],
      riskFlags: [],
      dataQuality: [],
      relatedItems: [
        {
          agendaItemId: 'item_2_1',
          relationshipType: 'kpi_reference',
          detail: 'The stakeholder engagement score in the CEO report connects to the missed KPI here.',
        },
      ],
      questions: [
        {
          id: 'iq_q_7_1_1',
          questionText: 'How should the missed stakeholder engagement KPI weight against the strong financial and program outcomes?',
          rationale: "3 of 5 KPIs met, 1 partially, 1 missed. The paper doesn't propose a weighting — it's up to the board to decide how much the miss matters.",
          category: 'people',
          priority: 1,
          directorFraming: 'Before discussing the remuneration number, discuss the KPI weighting. Should a missed engagement target reduce the proposed increase?',
          executiveFraming: null,
        },
        {
          id: 'iq_q_7_1_2',
          questionText: 'Should the 4.5% increase be conditional on a stakeholder engagement recovery plan?',
          rationale: "Linking the increase to a specific improvement plan creates accountability without penalising the CEO for one miss in an otherwise strong year.",
          category: 'governance',
          priority: 2,
          directorFraming: "Consider proposing that the increase is approved but that stakeholder engagement is weighted more heavily in next year's KPIs.",
          executiveFraming: null,
        },
      ],
    },
  },

  // ─── 8.1 CLOSE ───
  {
    id: 'item_8_1',
    meetingId: 'mtg_apr_2026',
    itemNumber: '8.1',
    sortOrder: 11,
    phase: 'Close',
    phaseSortOrder: 1,
    title: 'Next Meeting & Close',
    description: 'The Chair will confirm the date of the next Board meeting and close the meeting.',
    actionType: 'noting',
    scheduledStart: '2026-04-16T16:15:00+10:00',
    durationMinutes: 5,
    confidentiality: 'standard',
    votingEnabled: false,
    motionText: null,
    votingOptions: null,
    paperStatus: 'complete',
    paperOwnerId: null,
    paperDeadline: null,
    secretariatNotes: 'Next meeting: Thursday 18 June 2026, 1:00 PM. Same venue. Programs & Impact Committee meeting scheduled for 4 June.',
    iqStatus: 'not_available',
    presenters: [
      { userId: 'user_david_kim', name: 'David Kim', title: 'Board Chair', isExternal: false },
    ],
    documents: [],
    iqAnalysis: null,
  },
];

// ═══════════════════════════════════════════════════
// 6. DOCUMENT READ STATUS (per user)
// ═══════════════════════════════════════════════════

export const documentReads: DocumentReads = {
  user_patricia_moreau: {
    doc_minutes_feb: { read: true, markedAt: '2026-04-11T09:00:00+10:00' },
    doc_action_tracker: { read: true, markedAt: '2026-04-11T09:15:00+10:00' },
    doc_budget: { read: true, markedAt: '2026-04-11T10:00:00+10:00' },
    doc_fa_minutes_mar: { read: true, markedAt: '2026-04-11T10:30:00+10:00' },
    doc_risk_register: { read: true, markedAt: '2026-04-12T08:00:00+10:00' },
    doc_fundraising: { read: true, markedAt: '2026-04-13T14:00:00+10:00' },
    doc_ceo_performance: { read: true, markedAt: '2026-04-12T11:00:00+10:00' },
    doc_kpi_scorecard: { read: true, markedAt: '2026-04-12T11:15:00+10:00' },
  },
  user_david_kim: {
    doc_minutes_feb: { read: true },
    doc_action_tracker: { read: true },
    doc_ceo_report: { read: true },
    doc_program_dashboard: { read: true },
    doc_charter: { read: true },
    doc_fa_tor: { read: true },
    doc_mh_concept: { read: true },
    doc_needs_assessment: { read: true },
    doc_budget: { read: true },
    doc_fa_minutes_mar: { read: true },
    doc_risk_register: { read: true },
    doc_fundraising: { read: true },
    doc_ceo_performance: { read: true },
    doc_kpi_scorecard: { read: true },
  },
  user_james_achebe: {
    doc_mh_concept: { read: true },
    doc_needs_assessment: { read: true },
    doc_ceo_report: { read: true },
    doc_program_dashboard: { read: true },
    doc_minutes_feb: { read: true },
    doc_action_tracker: { read: true },
  },
  user_susan_cho: {
    doc_mh_concept: { read: true },
    doc_needs_assessment: { read: true },
    doc_ceo_report: { read: true },
    doc_minutes_feb: { read: true },
    doc_action_tracker: { read: true },
    doc_charter: { read: true },
    doc_fa_tor: { read: true },
    doc_budget: { read: true },
    doc_ceo_performance: { read: true },
  },
  user_robert_menzies: {
    doc_minutes_feb: { read: true },
    doc_action_tracker: { read: true },
    doc_budget: { read: true },
    doc_fa_minutes_mar: { read: true },
    doc_budget_variance: { read: true },
    doc_investments: { read: true },
    doc_risk_register: { read: true },
    doc_fundraising: { read: true },
    doc_ceo_report: { read: true },
    doc_program_dashboard: { read: true },
    doc_charter: { read: true },
    doc_fa_tor: { read: true },
    doc_ceo_performance: { read: true },
    doc_kpi_scorecard: { read: true },
    doc_remuneration: { read: true },
    doc_mh_concept: { read: true },
  },
  user_helen_papadopoulos: {
    // Hasn't accessed any materials — 5 days since last login
  },
};

// ═══════════════════════════════════════════════════
// 7. ACTION ITEMS (from previous meeting)
// ═══════════════════════════════════════════════════

export const actionItems: ActionItem[] = [
  {
    id: 'act_1',
    title: 'Obtain updated cyber insurance quote reflecting ACSC advisory',
    description: 'Following the ACSC health sector advisory, obtain updated cyber insurance quotation from broker. Compare current coverage against recommended minimums.',
    assigneeId: 'user_michael_torres',
    assigneeName: 'Michael Torres',
    dueDate: '2026-04-30',
    status: 'in_progress',
    priority: 'medium',
    sourceMeetingId: 'mtg_feb_2026',
    sourceMeetingDate: '2026-02-19',
    sourceItemNumber: '5.2',
    completionNotes: 'Broker engaged, quote expected by 25 April.',
  },
  {
    id: 'act_2',
    title: 'CRM vendor remediation plan — timeline and cost to complete',
    description: 'Provide the Board with a revised CRM implementation timeline, updated total project cost, and remediation plan addressing data migration delays.',
    assigneeId: 'user_lisa_chang',
    assigneeName: 'Lisa Chang',
    dueDate: '2026-04-15',
    status: 'overdue',
    priority: 'high',
    sourceMeetingId: 'mtg_feb_2026',
    sourceMeetingDate: '2026-02-19',
    sourceItemNumber: '6.1',
    completionNotes: null,
  },
  {
    id: 'act_3',
    title: 'Board skills matrix — complete annual update and gap analysis',
    description: "Update the board skills matrix with current director self-assessments. Prepare gap analysis against the Foundation's strategic priorities for review by Nominations Committee.",
    assigneeId: 'user_jenny_walsh',
    assigneeName: 'Jenny Walsh',
    dueDate: '2026-05-01',
    status: 'not_started',
    priority: 'low',
    sourceMeetingId: 'mtg_feb_2026',
    sourceMeetingDate: '2026-02-19',
    sourceItemNumber: '7.2',
    completionNotes: null,
  },
  {
    id: 'act_4',
    title: 'Stakeholder engagement strategy — proposal for Board consideration',
    description: 'CEO to develop a stakeholder engagement improvement strategy addressing the below-target engagement scores, for presentation to the June Board meeting.',
    assigneeId: 'user_sarah_brennan',
    assigneeName: 'Sarah Brennan',
    dueDate: '2026-06-18',
    status: 'not_started',
    priority: 'medium',
    sourceMeetingId: 'mtg_feb_2026',
    sourceMeetingDate: '2026-02-19',
    sourceItemNumber: '2.1',
    completionNotes: null,
  },
];

// ═══════════════════════════════════════════════════
// 8. NOTEBOOK ENTRIES (Patricia's saved IQ questions)
// ═══════════════════════════════════════════════════

export const notebookEntries: NotebookEntry[] = [
  {
    id: 'note_1',
    userId: 'user_patricia_moreau',
    meetingId: 'mtg_apr_2026',
    agendaItemId: 'item_5_1',
    title: 'Budget — revenue assumption question',
    content: "From IQ: Where is the sensitivity analysis the F&A Committee requested? This was a specific Committee request — I need to hold Michael accountable for providing it before the board votes. If it's not ready, I'll propose deferring the vote.\n\nMy note: I raised this at Committee. Michael said he'd have it by Board day. If he doesn't, I'll recommend we approve with a condition that the sensitivity analysis is provided within 2 weeks.",
    isStarred: true,
    source: 'iq_question',
    sourceReferenceId: 'iq_q_5_1_1',
    tags: ['budget', 'revenue', 'sensitivity'],
    createdAt: '2026-04-11T10:45:00+10:00',
  },
  {
    id: 'note_2',
    userId: 'user_patricia_moreau',
    meetingId: 'mtg_apr_2026',
    agendaItemId: 'item_5_1',
    title: 'Budget — contingency question',
    content: "From IQ: What's the contingency if individual giving comes in flat rather than up 15%?\n\nMy note: The answer should be specific budget lines that would be cut. Community programs should be protected. Admin and fundraising costs should be the first to reduce. Ask Michael to quantify.",
    isStarred: true,
    source: 'iq_question',
    sourceReferenceId: 'iq_q_5_1_2',
    tags: ['budget', 'contingency'],
    createdAt: '2026-04-11T10:50:00+10:00',
  },
];

// ═══════════════════════════════════════════════════
// 9. NOTIFICATIONS
// ═══════════════════════════════════════════════════

export const notifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_patricia_moreau',
    type: 'document_uploaded',
    title: 'New document uploaded',
    body: 'Lisa Chang uploaded Fundraising Strategy Q3 Progress Report to Item 6.2',
    referenceType: 'document',
    referenceId: 'doc_fundraising',
    isRead: false,
    createdAt: '2026-04-13T11:00:00+10:00',
  },
  {
    id: 'notif_2',
    userId: 'user_patricia_moreau',
    type: 'paper_deadline',
    title: 'Paper overdue',
    body: "Dr. Anika Patel's concept paper for Item 4.1 was submitted 2 days late and is still in review",
    referenceType: 'agenda_item',
    referenceId: 'item_4_1',
    isRead: false,
    createdAt: '2026-04-12T09:00:00+10:00',
  },
  {
    id: 'notif_3',
    userId: 'user_patricia_moreau',
    type: 'document_uploaded',
    title: 'Budget paper finalised',
    body: 'Michael Torres marked the FY26 Budget Board Paper as complete',
    referenceType: 'document',
    referenceId: 'doc_budget',
    isRead: true,
    createdAt: '2026-04-10T09:30:00+10:00',
  },
  {
    id: 'notif_4',
    userId: 'user_patricia_moreau',
    type: 'nudge',
    title: 'Board readiness alert',
    body: "Helen Papadopoulos hasn't accessed any meeting materials (5 days since last login)",
    referenceType: 'user',
    referenceId: 'user_helen_papadopoulos',
    isRead: false,
    createdAt: '2026-04-13T08:00:00+10:00',
  },
  {
    id: 'notif_5',
    userId: 'user_patricia_moreau',
    type: 'meeting_published',
    title: 'Agenda published',
    body: 'The April Board meeting agenda has been published with 11 items and 18 documents',
    referenceType: 'meeting',
    referenceId: 'mtg_apr_2026',
    isRead: true,
    createdAt: '2026-04-10T09:00:00+10:00',
  },
  {
    id: 'notif_6',
    userId: 'user_patricia_moreau',
    type: 'action_due_soon',
    title: 'Action item overdue',
    body: 'CRM vendor remediation plan (Lisa Chang) was due 15 April — now overdue',
    referenceType: 'action_item',
    referenceId: 'act_2',
    isRead: false,
    createdAt: '2026-04-13T09:00:00+10:00',
  },
];

// ═══════════════════════════════════════════════════
// 10. BRIEFING NARRATIVES (pre-generated per role)
// ═══════════════════════════════════════════════════

export const briefingNarratives: BriefingNarratives = {
  director: {
    user_patricia_moreau: {
      prep: "Patricia, this meeting has 2 items requiring your vote and 4 motions on the table. As Chair of Finance & Audit, you're presenting the budget recommendation at 2:15 PM — IQ has flagged that the revenue assumption is at risk because the CRM project enabling the donor strategy is 15 months behind schedule (not 3 months as the paper states). The sensitivity analysis your Committee requested has not been provided. The mental health outreach proposal at 1:45 PM is ambitious but IQ has found significant evidence gaps — the service model has no published evidence for regional delivery and three similar national programs had poor outcomes. Start your reading with Items 5.1 and 4.1, then read 6.2 alongside the budget.",
      day: "Patricia, 2 decisions and 4 votes today. You're presenting the budget at 2:15 PM. During your prep, you saved 2 questions about revenue assumptions — both are ready in your notes. Key moment: link the CRM delay (Item 6.2) directly to the budget assumption when you present the Committee's recommendation. The mental health proposal at 1:45 PM has unresolved evidence gaps — James Achebe may support it given his research interest, so the governance questions matter. CEO performance review at 3:45 PM — remember the stakeholder engagement miss connects to today's CEO report.",
    },
    user_david_kim: {
      prep: "David, as Chair you'll guide discussion on all 11 items today. The two highest-stakes items are the mental health proposal (4.1) and the budget (5.1). IQ has identified that these items are financially linked — the program would draw on the same reserves the budget allocates as contingency. The budget also has a revenue assumption problem flagged by the F&A Committee. For the CEO review, you have 5 of 6 assessments — Helen's is outstanding. Consider whether to proceed or defer.",
      day: "David, 11 items across 3.5 hours. Watch the time on Item 4.1 (mental health proposal, 30 min) — Anika will want to advocate, but the evidence questions from IQ are critical and the board needs space to discuss them. The budget vote (5.1) depends on whether the sensitivity analysis has been provided — if not, Patricia's Committee may recommend deferral. The CRM delay (6.2) is the thread connecting several items today — you may want to address it early to set context.",
    },
  },
  executive: {
    user_michael_torres: {
      prep: "Michael, you're presenting 4 items at Thursday's board meeting covering budget, investments, risk, and the investment portfolio. The budget paper (\u00a75.1) is your highest-stakes item — IQ analysis suggests directors will probe the fundraising revenue assumption given the CRM delay. The F&A Committee specifically requested a sensitivity analysis that hasn't been provided yet. Patricia Moreau will present the Committee's recommendation including this concern. Your risk register (\u00a76.1) should be updated to reference the mental health proposal if the board endorses it. The investment review is clean — no concerns.",
      day: "Michael, budget discussion at 2:15 PM is critical. Patricia will note the Committee's concern about the revenue assumption. If you don't have the sensitivity analysis ready, prepare verbal scenarios for 0%, 5%, and 10% giving growth. Lisa's fundraising report (presented right after your items) will make the CRM delay even more visible — be prepared for the board to connect the dots.",
    },
    user_sarah_brennan: {
      prep: "Sarah, your CEO report is taken as read at 1:15 PM — plan to highlight the Deakin partnership and staffing challenges. IQ has flagged an inconsistency between your 18% program growth figure (total contacts) and the Dashboard's 14% (unique participants) — clarify which metric goes to DHHS. The stakeholder engagement score decline will come up again in your performance review (Item 7.1) — the 'seasonal factors' explanation needs supporting data. You'll need to withdraw for the closed session at 3:45 PM.",
    },
    user_anika_patel: {
      prep: "Anika, your mental health concept paper is the most discussed item on the agenda. IQ analysis has identified several evidence gaps that the board will likely probe: (1) no published evidence that the Head to Health model works in regional settings, (2) three similar national programs had mixed outcomes, (3) the volunteer recruitment assumption is untested. Prepare for questions about a staged pilot approach rather than full 3-year commitment. James Achebe's research background means he'll engage substantively — this could be an ally or a tough questioner.",
    },
  },
};

// ═══════════════════════════════════════════════════
// 11. IQ CHAT SYSTEM PROMPT CONTEXT
// ═══════════════════════════════════════════════════

export const iqChatSystemPrompt = `You are IQ, the AI intelligence assistant built into BoardIQ — a board governance platform. You are helping a board member or executive prepare for a board meeting of the Coastal Health Foundation.

Your role is to:
- Answer questions about board papers and agenda items using the document summaries provided
- Help users understand the implications of what they're reading
- Surface connections between agenda items
- Suggest thoughtful governance questions
- Be direct, factual, and concise — board members are time-poor

You should:
- Cite specific documents and page numbers when possible
- Flag where claims lack evidence or sources
- Note connections to other agenda items
- Frame answers appropriate to the user's role (director vs executive)
- Never provide legal or financial advice — frame everything as analytical support

You should NOT:
- Make up information not in the documents
- Take sides on board decisions
- Provide definitive recommendations — present analysis for the user to decide
- Discuss anything outside the scope of this meeting's materials

Context about the organisation:
${organisation.description}

Meeting: Board of Directors, Thursday 16 April 2026, 1:00 PM - 4:30 PM`;

// Helper: build context for a specific agenda item's IQ chat
export function buildItemChatContext(itemId: string): string {
  const item = agendaItems.find((i) => i.id === itemId);
  if (!item) return '';

  let context = `\n\nCurrent agenda item: \u00a7${item.itemNumber} \u2014 ${item.title}\n`;
  context += `Action required: ${item.actionType}\n`;
  context += `Presenters: ${item.presenters.map((p) => p.name).join(', ')}\n`;
  context += `Description: ${item.description}\n\n`;

  if (item.documents.length > 0) {
    context += 'DOCUMENT SUMMARIES:\n';
    item.documents.forEach((doc) => {
      context += `\n--- ${doc.filename} (${doc.pageCount} pages) ---\n${doc.summary}\n`;
    });
  }

  if (item.iqAnalysis) {
    context += `\nIQ ANALYSIS:\n${item.iqAnalysis.detail}\n`;
    if (item.iqAnalysis.claims.length > 0) {
      context += '\nKey claims identified:\n';
      item.iqAnalysis.claims.forEach((c) => {
        context += `- "${c.claim}" \u2014 confidence: ${c.confidence}${c.flags.length > 0 ? ` \u2014 flags: ${c.flags.join('; ')}` : ''}\n`;
      });
    }
    if (item.iqAnalysis.relatedItems.length > 0) {
      context += '\nRelated agenda items:\n';
      item.iqAnalysis.relatedItems.forEach((r) => {
        const related = agendaItems.find((i) => i.id === r.agendaItemId);
        if (related) {
          context += `- \u00a7${related.itemNumber} ${related.title}: ${r.detail}\n`;
        }
      });
    }
  }

  return context;
}
