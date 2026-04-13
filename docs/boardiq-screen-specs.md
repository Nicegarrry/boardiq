# BoardIQ — Screen Specifications v1.0

## Design Philosophy

**Aesthetic direction:** Refined, high-trust, editorial. Think Bloomberg Terminal meets Notion — information-dense but never cluttered. Dark mode default (boards meet in dim rooms, execs read on planes). Light mode available. Typography-led hierarchy, not colour-led.

**Core UX principle:** Every screen answers "what do I need to do right now?" before anything else. Board members are time-poor. Secretariat staff are context-switching constantly. The UI should reduce cognitive load, not add to it.

**Top Team Effectiveness philosophy:** BoardIQ doesn't just organise meetings — it makes governance better. Every AI feature is framed around improving decision quality, preparedness, and accountability. The IQ feature isn't a gimmick; it's a coach that helps directors ask better questions and helps executives present more rigorous papers.

---

## 1. Authentication & Entry

### 1.1 Login Screen

**Route:** `/login`

**Purpose:** Magic link authentication via Supabase Auth.

**Layout:**
- Centred card on a full-bleed branded background
- BoardIQ logo and tagline: "Intelligence for the boardroom"
- Single email input field
- "Send magic link" button
- Footer: security assurance text ("End-to-end encrypted. SOC 2 compliant.")

**States:**
- Default: email input focused
- Submitted: "Check your email" confirmation with resend option (30s cooldown)
- Error: inline validation for malformed email
- Expired link: redirect back here with "Link expired, request a new one" message

**Notes:** No password field ever. Magic links only. Session tokens stored in httpOnly cookies. Consider adding "Remember this device" checkbox for 30-day sessions.

---

## 2. Organisation Selector

### 2.1 Org Switcher

**Route:** `/orgs`

**Purpose:** Directors serving on multiple boards land here. Shows all organisations they belong to without leaking cross-org information.

**Layout:**
- Clean grid of org cards (logo, name, role, next meeting date)
- Each card shows: org name, user's role (e.g. "Non-Executive Director"), committee memberships as subtle tags, next upcoming meeting with countdown
- "No upcoming meetings" state for dormant orgs
- Visual indicator for orgs with unread materials or pending actions

**Behaviour:**
- Clicking a card enters that org's context — all subsequent screens are scoped to this org
- Org context shown persistently in top nav once selected
- Switcher accessible from top nav at all times (dropdown, not full page reload)

**Data isolation:** This screen must NEVER show agenda items, documents, or AI-generated content. It's purely structural metadata. No cross-org AI calls.

---

## 3. Board Member Experience

### 3.1 Board Dashboard

**Route:** `/org/[orgId]/board`

**Purpose:** The landing page after selecting an org. Answers: "What's coming up and what do I need to prepare for?"

**Layout — Three zones:**

**Zone 1 — Header bar:**
- Org name + logo
- User's role and committee memberships
- Notification bell (unread count)
- Profile/settings dropdown
- Org switcher trigger

**Zone 2 — Timeline (left 40%):**
- Vertical timeline of meetings, scrollable
- Each meeting node shows: date, meeting type (Full Board / Audit Committee / etc.), preparation status (traffic light: red = unread papers, amber = partially read, green = fully reviewed), time until meeting
- Past meetings shown below a "Today" divider, greyed but accessible
- Clicking a meeting navigates to the Meeting View (3.2)

**Zone 3 — Action panel (right 60%):**
- **Priority actions** card: unread board papers ranked by meeting urgency, pending votes, items requiring your input
- **Effectiveness insights** card: personal preparation score (% of papers reviewed before meetings over last 6 months), average question quality trend (if IQ feature is being used), comparison to anonymised board benchmarks — framed constructively ("You're in the top quartile for preparation" not "You're behind")
- **Recent activity** feed: new documents uploaded, agenda changes, minutes published

**Top Team Effectiveness integration:** The dashboard gently surfaces preparation habits without shaming. The effectiveness card uses language like "Your preparation trend" and "Board engagement patterns" — it's coaching, not surveillance. Only the individual sees their own metrics. The Chair sees anonymised aggregate only.

---

### 3.2 Meeting Briefing — THE MONEY SCREEN

**Route:** `/org/[orgId]/meeting/[meetingId]`

**Purpose:** The primary meeting experience for board members. Replaces the traditional two-pane agenda/detail view with a single scrollable "chief of staff cheat sheet" that tells the story of the meeting personalised to this director. Directors spend 80% of their time here. Must be exceptionally polished.

**Design philosophy:** Directors are used to reading a 500-page board pack as a single document. This view is the intelligent, interactive equivalent — a continuous vertical scroll that walks them through the meeting narratively, grouped by theme and relevance rather than agenda sequence. IQ badges and analysis are integrated throughout every card, not siloed into a separate tab.

**Two modes — toggled at the top:**

#### 3.2a Preparation Mode (default before meeting day)

**Purpose:** Guide directors through their reading and preparation in the days before a meeting. Gamifies preparation tracking and drives early engagement with IQ features.

**Layout — Single column, unlimited vertical scroll:**

**Header block:**
- Meeting type label (e.g. "Board of Directors Meeting")
- Meeting date as hero text (serif, large)
- Time, location, item count

**Preparation progress card:**
- Circular progress indicator showing overall prep percentage
- Documents read vs total, days until meeting
- Progress bar visualisation
- This card creates gentle accountability — directors can see at a glance if they're behind

**AI Briefing card — "Your Preparation Briefing":**
- AI-generated personalised summary of what this meeting means for THIS director
- Written in first person, addressing them by name
- Highlights: number of decisions requiring their vote, items where they're presenting, IQ flags that need attention, recommended reading order
- IQ badges inline showing alert levels
- Tone: like a trusted chief of staff wrote a one-paragraph executive brief

**Content sections — grouped thematically, not chronologically:**

Sections are ordered by relevance to the director, not by agenda sequence:
1. "Your Key Actions" — items where the director votes, decides, or presents (always first)
2. Thematic groups — "Strategic & Programmatic", "Governance & Risk", "CEO Report & Operations", "Opening & Closing" etc.

Each section has:
- Section header with item count and divider line
- Optional narrative paragraph — editorial context connecting the items in this section, highlighting cross-references between items (e.g. "The budget assumes a CRM deliverable that's delayed — read these two papers together")

**Item cards within sections:**

Each agenda item is a card that expands inline on click. Collapsed state shows:
- Action badge (DECISION / DISCUSSION / NOTING / APPROVAL)
- VOTE badge if applicable
- IQ badge with headline (e.g. "IQ: Revenue assumption needs scrutiny") — visible without expanding
- Title (serif, prominent)
- Time, duration, presenters, document count
- Per-item preparation progress ring (in prep mode)

Expanded state reveals (without leaving the page):
- "Your role" callout — personalised context for this director's involvement
- Summary paragraph
- IQ Analysis panel — inline, with headline, detail text, and suggested questions
- Documents list with read/unread status and click-to-open
- Vote/motion preview (shown but voting only active in day mode)
- Action buttons: "Open full detail →", "Ask IQ a question", "Add to notebook"

**Preparation engagement features:**
- IQ questions can be starred and saved to notebook during prep
- Saved questions are remembered and surfaced again on meeting day
- The AI briefing card updates as the director reads documents ("You've now reviewed the key budget paper — the mental health proposal is your most important unread item")
- Reading progress feeds into the effectiveness metrics on the dashboard

#### 3.2b Meeting Day Mode

**Purpose:** Condensed, action-oriented view for the day of the meeting. Assumes preparation is complete. Focuses on decisions, notes from prep, and real-time meeting flow.

**Changes from Prep Mode:**
- AI Briefing card changes to "Your Day at a Glance" — references the director's own preparation, saved questions, and unresolved concerns
- Preparation progress card hidden (or shown as final state)
- Vote buttons become active on items where voting is open
- Cards show saved IQ questions from prep as "Your notes" alongside the AI-generated questions
- Chronological mini-agenda appears at the bottom — a compact, traditional timeline of all items for quick reference during the live meeting
- During live meetings (when secretariat has started the meeting), the current item is highlighted in the chronological view

**Detail slide-over panel:**

When a director clicks "Open full detail" on any card, a slide-over panel appears from the right (overlay, not navigation):
- Panel header: title, badges, time, presenters
- Three tabs: Overview, Documents, IQ
- Overview tab: full description, your role callout, motion/vote card
- Documents tab: document list with inline PDF viewer, read status, annotations
- IQ tab: full analysis, all suggested questions with save/dismiss, IQ chat interface
- Clicking outside or pressing Escape closes the panel
- The main briefing page remains visible behind a dimmed overlay

**Key design principle:** The director should rarely need to leave the briefing page. The cards contain enough information for 80% of their needs. The slide-over handles the remaining 20% (deep reading, full IQ analysis, document annotations). There is no separate "agenda view" — the briefing IS the agenda, just told as a narrative rather than a list.

**IQ integration throughout:**
- IQ badges appear on every card that has AI analysis (visible without expanding)
- IQ analysis panels appear inline in expanded cards
- IQ suggested questions appear inline with save/dismiss actions
- IQ chat is accessible from both expanded cards and the slide-over panel
- The AI briefing card at the top synthesises IQ findings across all items
- Cross-item IQ connections are highlighted in section narratives (e.g. "IQ has identified that Items 5.1 and 6.2 make contradictory assumptions")

**Accessibility to traditional agenda view:**
- "Full Agenda — Chronological" section at the bottom of meeting day mode
- "Export as PDF" option generates a traditional formatted agenda document
- The agenda item number (§3.1) is always visible on each card for reference

---

### 3.3 IQ Feature — Integrated Intelligence

**Route:** Integrated throughout the Meeting Briefing (3.2) and accessible via slide-over panel

**Purpose:** AI-powered analysis that helps board members engage more effectively with board papers. Framed as preparation support and governance quality improvement. IQ is NOT a separate destination — it is woven into every card, every section, and the AI briefing summary.

**Where IQ appears:**

1. **AI Briefing card** (top of page) — Synthesises IQ findings across ALL items into a personalised narrative
2. **IQ badges on every card** — Visible without expanding, showing alert level and headline (e.g. "IQ: Evidence gaps identified")
3. **IQ analysis panel in expanded cards** — Detail text, assumptions, risk flags, and 1-2 suggested questions inline
4. **Section narratives** — Cross-item IQ connections highlighted (e.g. "IQ has identified that Items 5.1 and 6.2 make contradictory assumptions about the same deliverable")
5. **Slide-over IQ tab** — Full analysis with all questions, chat interface, and deep-dive tools

**IQ Analysis Content (generated per agenda item on document processing):**

**Section 1 — Paper Analysis (auto-generated on document processing)**
- **Claims Assessment:** Key claims extracted from the board paper, each with a confidence indicator. E.g. "Revenue projected to grow 12% YoY" → flagged with: data source cited? consistent with prior reports? external benchmarks available?
- **Assumptions Surfaced:** Implicit assumptions the paper relies on, highlighted for scrutiny. E.g. "Assumes no regulatory changes in Q3" or "Based on current exchange rates"
- **Risk Flags:** Areas where the paper may be incomplete, inconsistent with previous board materials, or where similar initiatives have historically underperformed
- **Data Quality Notes:** Where figures lack sources, where projections lack methodology disclosure, where comparisons use inconsistent baselines

**Section 2 — Suggested Questions (the coaching element)**
- Prioritised list of questions a well-prepared director might ask
- Categorised: Strategic / Financial / Risk / Governance / Operational
- Each question includes brief rationale ("This question matters because...")
- Questions are generated considering: the specific paper content, the committee context (audit committee gets different questions than strategy committee), historical context from prior meetings on this topic
- User can star questions to save to their notebook
- User can dismiss questions (this trains future relevance)

**Section 3 — IQ Chat**
- Conversational interface scoped to this agenda item's documents and context
- User can ask follow-up questions about the paper
- Responses cite specific sections/pages of the source documents
- Chat history persists per-user per-session
- Suggested prompts: "Compare this to last quarter's report", "What are the key risks not addressed?", "Summarise in 3 bullet points"
- Clear disclaimer: "IQ analysis is AI-generated to support your preparation. It does not constitute advice."

**Top Team Effectiveness integration:**
- The questions aren't just analytical — they model what good governance questioning looks like
- Over time, the system learns which question categories the board engages with most, which get dismissed, and refines
- Post-meeting: if minutes are processed, IQ can surface "Questions from preparation that were / weren't addressed in discussion" — helping directors see the gap between preparation and participation
- This is pure coaching: "Here's what you prepared, here's what got discussed, here's the delta"

---

### 3.4 Board Notebook

**Route:** `/org/[orgId]/notebook` (also accessible as a slide-out panel from Meeting Briefing, and via "Add to notebook" / "Save to notebook" buttons throughout IQ features)

**Purpose:** Personal, private note-taking space for board members. Persists across meetings. Searchable. Deeply integrated with the preparation flow.

**Integration with Meeting Briefing:**
- "Add to notebook" button on every expanded card
- "Save to notebook" on every IQ suggested question
- Saved questions from preparation are surfaced back on meeting day mode as "Your saved questions" alongside AI-generated ones
- This creates a preparation → meeting day → follow-up loop that drives engagement

**Layout:**
- Left sidebar: list of notes, organised by meeting or free-form
- Main area: rich text editor (markdown-backed)
- Notes can be linked to specific agenda items or free-standing
- Tags and search
- When opened from Meeting View as a panel, it slides in from the right and auto-creates a note linked to the current agenda item

**Features:**
- Private by default — never visible to other users, never included in AI training, never part of organisational data
- Export to PDF
- Star important notes
- "From IQ" badge on notes that were saved from IQ suggested questions

**Data handling:** Notebook data is encrypted at rest. Even system admins cannot read it. This is critical for board governance — directors must have a private space.

---

### 3.5 Voting

**Route:** Part of Meeting View, appears as a modal or inline component when voting is active

**Purpose:** Per-agenda-item voting when enabled by secretariat.

**Layout:**
- When voting is open on an item, a voting card appears at the top of the reading pane
- Shows: motion text, required action, voting options (For / Against / Abstain typically, configurable)
- User selects their vote, confirms
- After voting: shows their recorded vote, live tally (if permitted by meeting rules), and voting status (X of Y votes cast)

**States:**
- Voting not enabled: no voting UI shown
- Voting open: card shown, user can vote
- Vote cast: confirmation shown, can change until voting closes
- Voting closed: final result shown with breakdown
- Quorum indicator: "X votes needed for quorum — Y received"

**Audit:** Every vote is timestamped and immutable once voting closes. Full audit trail accessible to secretariat and chair.

---

## 4. Secretariat Experience

### 4.1 Secretariat Dashboard

**Route:** `/org/[orgId]/admin`

**Purpose:** Command centre for governance operations. Answers: "What needs my attention across all meetings and committees?"

**Layout:**
- **Upcoming meetings** table: date, committee, status (draft/published/ready), completeness indicator (how many agenda items have all documents uploaded), action button (edit / publish / start)
- **Recent activity** feed: document uploads, agenda changes, new user registrations
- **Quick actions**: Create new meeting, manage committees, manage users
- **Alerts**: items needing attention (e.g. "3 agenda items for Tuesday's Audit Committee have no documents attached")

---

### 4.2 Organisation Setup

**Route:** `/org/[orgId]/admin/settings`

**Purpose:** Configure organisation structure, committees, users, and permissions.

**Sub-sections (tabbed or side-nav):**

**Organisation Profile:**
- Org name, logo upload, description
- Financial year settings (for meeting scheduling patterns)
- Default meeting timezone

**Committees:**
- List of committees (Full Board, Audit, Remuneration, Nominations, custom...)
- Create / edit committee: name, description, meeting frequency guidance, default attendees
- Each committee has: permanent members (auto-invited to all meetings), quorum requirements, chair designation
- A user can be a member of multiple committees
- The "Full Board" committee is special — all directors are members by default

**User Management:**
- Invite users by email (triggers magic link + onboarding)
- Assign roles: Secretariat, Board Member, Executive, Presenter
- Assign committee memberships
- Set special flags: Chair, Deputy Chair, Company Secretary
- Deactivate users (retain history, remove access)
- Access log per user

**Permissions Matrix:**
- Visual grid: roles × capabilities
- Capabilities include: view agenda, view documents, view IQ, use notebook, vote, create meetings, edit agenda, upload documents, manage users, view audit trail, view effectiveness analytics
- Editable per role, with sensible defaults
- Committee-level overrides: e.g. a director might be a full member of Audit but observer-only on Remuneration

---

### 4.3 Meeting Creation & Agenda Builder

**Route:** `/org/[orgId]/admin/meeting/new` and `/org/[orgId]/admin/meeting/[meetingId]/edit`

**Purpose:** Create meetings, build agendas, manage the lifecycle from draft to minutes.

**Meeting Creation Flow:**

**Step 1 — Meeting basics:**
- Select committee (populates default attendees)
- Date, start time, end time
- Location (physical address or video link or both)
- Meeting type: Regular | Special | Ad Hoc

**Step 2 — Agenda builder (the core tool):**

Layout: vertical sortable list of agenda items with an "Add item" button

Each agenda item card (expandable) contains:
- Item number (auto-generated, reorderable)
- Title (required)
- Description (rich text)
- Category: For Decision | For Discussion | For Noting | For Information
- Phase grouping: Opening | Strategic | Financial | Governance | Operations | AOB | Closed Session
- Timing: start time, duration (auto-calculates running schedule)
- Presenter(s): select from org users or add external presenters by name/email
- Attendees: defaults from committee, with ability to add/remove per item (this controls who sees this session)
- Documents: upload area (drag and drop, multi-file)
- Confidentiality level: Standard | Restricted | Board Only
- Voting enabled: yes/no, if yes configure motion text and options
- Notes field (secretariat internal, not shown to board)

**Bulk upload option:**
- Upload a Word/PDF agenda document
- AI parses it into structured agenda items (titles, timings, presenters extracted)
- Secretariat reviews and adjusts parsed results before confirming
- This saves significant setup time for recurring meeting formats

**Templates:**
- Save any meeting structure as a template
- Apply template to new meeting (pre-populates items)
- Template library per committee

---

### 4.4 Meeting Lifecycle Controls

**Route:** `/org/[orgId]/admin/meeting/[meetingId]/control`

**Purpose:** Manage meeting states and live operations.

**Pre-meeting phase:**
- Status: Draft → Review → Published
- Draft: agenda editable, not visible to board members
- Review: agenda visible to chair for approval, locked from other board members
- Published: agenda and documents visible to all permitted attendees
- Pre-read management: set pre-read deadline, track who has accessed documents, send reminders to those who haven't
- Lock/unlock individual agenda items or entire agenda
- Late document additions (flagged as "added after publication")

**During-meeting phase:**
- "Start meeting" button → meeting goes live
- Live agenda tracker: secretariat advances through items, board members see current item highlighted
- Per-item controls: start, pause, extend time, skip, return to previous
- Attendance tracking: mark present/absent/proxy per attendee
- Live notes panel: structured note-taking per agenda item (separate from minutes)
- Ad hoc item addition: insert unscheduled items with chair approval flag
- Voting trigger: open/close voting per item

**Post-meeting phase:**
- "Conclude meeting" button
- Status: Concluded → Minutes Draft → Minutes Approved → Minutes Published
- Action items: extracted from notes, assignable to individuals with due dates
- Minutes workflow covered in 4.5

---

### 4.5 Minutes & Notes Management

**Route:** `/org/[orgId]/admin/meeting/[meetingId]/minutes`

**Purpose:** Structure, draft, refine, and publish meeting minutes.

**Layout:**

**Left pane:** agenda item list (same structure as meeting view)

**Right pane:** minutes editor per item, containing:
- Auto-generated draft from: live notes taken during meeting, AI summarisation of discussion (if audio/transcript available in future), document content and IQ analysis context
- Structured fields per item: attendees for this item, discussion summary, decisions made, action items (who, what, by when), voting results (if applicable)
- Rich text editor for free-form additions
- "Regenerate summary" button to re-run AI drafting
- Diff view: compare AI draft vs secretariat edits
- Approval workflow: draft → chair review → board approval → published
- Version history with full audit trail

**AI assistance in minutes:**
- Summarisation of verbose notes into concise minute-appropriate language
- Consistency checking: are action items from last meeting referenced where relevant?
- Tone adjustment: ensure minutes read formally and accurately
- Proofing: grammar, consistency of tense, naming conventions

**Top Team Effectiveness integration:**
- Minutes processing feeds back into the IQ system
- Decisions and action items become trackable across meetings
- "Decision follow-up" feature: at the next meeting, IQ can surface "Last time the board decided X — here's what's happened since"

---

### 4.6 Paper Tracking & Board Readiness Dashboard

**Route:** `/org/[orgId]/admin/meeting/[meetingId]/tracking`

**Purpose:** The secretariat's primary pre-meeting operational view. Answers: "Are all papers ready and is the board prepared?" This is the command centre for the weeks between agenda publication and the meeting itself.

**Design philosophy:** Secretariat staff spend enormous time chasing papers from executives and monitoring whether directors have read materials. This view automates tracking and surfaces problems early enough to fix them.

**Layout — Tabbed interface with summary cards at top:**

**Summary cards (always visible, 4-column grid):**
- Papers Ready: X/Y with percentage — how many agenda items have all required documents uploaded and marked complete
- Board Prep: average % across all directors — aggregate document read rate
- Overdue Items: count of papers past their submission deadline — highlighted red if > 0
- Outstanding Actions: count of incomplete action items from previous meetings

**Tab 1: Paper Tracking**

Table view of all agenda items that require papers, ordered by priority (overdue → draft → in review → complete):

Each row shows: agenda item number, title, responsible person (exec owner or presenter), paper status (Not Started → Draft → In Review → Complete), documents uploaded count, action button (View / Nudge)

Status workflow per paper:
- Not Started: no documents uploaded, no draft activity
- Awaiting Upload: secretariat has requested the paper, deadline approaching
- Draft: document uploaded but not marked as final by the author
- In Review: document marked final by author, secretariat reviewing
- Complete: secretariat has approved and attached to agenda item

Overdue papers are highlighted with warm background. Secretariat can:
- Send individual reminders to paper authors (one-click "nudge" button)
- Send bulk reminder to all authors with incomplete papers
- Set/adjust paper submission deadlines per item
- Mark papers as complete or send back for revision with notes

**Tab 2: Board Readiness**

Table of all directors showing their preparation progress:

Each row shows: director name, role, documents read vs total, preparation progress bar, percentage, last active timestamp, action button (Nudge)

Key features:
- Directors who haven't accessed any materials are highlighted red
- "Last active" column shows when they last opened any meeting material
- One-click "nudge" sends a personalised pre-read reminder email
- Aggregate stats shown: "4 of 6 directors have started reading" etc.
- Chair gets a separate summary they can use to encourage preparation
- All tracking is for secretariat/chair eyes only — directors see only their own prep stats

**Tab 3: Action Items**

Cross-meeting action item tracker:
- All outstanding actions from previous meetings
- Each shows: description, assignee, due date, status, originating meeting
- Status: Not Started → In Progress → Complete → Overdue (auto-calculated from due date)
- Filterable by assignee, status, meeting
- These feed into the "Matters Arising" agenda item automatically

**Tab 4: Agenda (editing view)**

Full agenda management with inline editing controls:
- Reorderable item list
- Quick-edit fields per item
- Add/remove items
- Import from template
- Publish/unpublish controls
- Bulk operations (e.g., set all items to a default timing)

**Top Team Effectiveness integration:**
- Paper tracking data feeds into organisational governance health metrics
- Patterns visible over time: which executives consistently submit late? Which directors consistently don't read materials?
- These patterns are available to the chair (anonymised for directors, identified for executives since they're employees)
- Helps the chair have evidence-based conversations about governance quality

---

## 5. Presenter & Executive Experience

### 5.1 Executive Session Briefing

**Route:** `/org/[orgId]/exec`

**Purpose:** Executives (CEO, CFO, CTO, etc.) attend multiple agenda items and present papers. Their view mirrors the director briefing philosophy — a personalised "chief of staff cheat sheet" — but scoped to their sessions and reframed around presentation preparation rather than board oversight.

**Design philosophy:** Executives are employees, not governors. Their relationship to the board meeting is fundamentally different from a director's. They need to: (1) ensure their papers are ready and uploaded, (2) anticipate what questions the board will ask, (3) understand the broader meeting context enough to cross-reference their items with others. The executive briefing serves all three needs.

**Layout — Single scrollable page:**

**Header:** Meeting date, time, executive's name and role

**AI Session Briefing card:**
- Personalised narrative addressing the executive by name
- Highlights: how many items they're presenting, which is highest-stakes, what IQ analysis predicts the board will focus on
- Critical differentiator: IQ tells the executive "Here's what the board is likely to ask you" — this is the mirror image of the director's "Here are questions to ask"
- Cross-references: if their paper depends on or contradicts another paper, flag it
- Tone: coaching, not threatening. "IQ suggests preparing for questions about downside scenarios on the revenue assumption"

**Section 1 — Your Sessions (full detail cards):**

Each session the executive owns or presents, shown as a rich card:
- Action badge, IQ badge, paper status badge
- Full title, time, duration, document count
- Summary paragraph
- **IQ panel: "What the Board May Ask"** — the executive's version of IQ suggested questions. Same analysis, but framed from the presenter's perspective. Instead of "Ask this question" it's "Prepare for this question"
- Document list with upload/edit controls (before meeting deadline)
- Paper status: draft → in review → complete
- Edit paper, upload document, view IQ analysis buttons

**Section 2 — Other Sessions for Awareness:**

Compact list of agenda items the executive can see but isn't presenting:
- Title, time, presenter, action type only
- Click-through to slide-over for detail
- Provides context so the executive understands the full meeting shape

**Section 3 — Your Paper Deadlines:**

Status tracker for all papers the executive is responsible for:
- Visual progress per item
- Upload controls
- Deadline indicators

**Top Team Effectiveness for executives:**
- Post-meeting: IQ surfaces "Questions you were asked vs questions IQ predicted" — helps executives improve their papers over time
- Paper submission patterns tracked: consistently late papers flagged to the executive and their secretary
- Quality feedback loop: if IQ consistently flags issues in an executive's papers (unsourced claims, missing baselines), that pattern is surfaced privately to help them improve

---

### 5.2 Presenter Session View

**Route:** `/org/[orgId]/meeting/[meetingId]/session/[sessionId]`

**Purpose:** Minimal, focused view for external presenters or staff invited to present on a single item. More restricted than the executive view.

**What they see:**
- High-level agenda (titles and timings only, no documents from other sessions)
- Full detail of their own session(s): description, timing, documents, attendee list
- Their own session's IQ analysis — framed as "Likely questions from the board" to help them prepare
- Paper status and upload controls for their session

**What they can do (before meeting, editing window open):**
- Upload/replace documents for their session
- Edit description text
- Add presenter notes (visible to secretariat and chair, not board)
- Review IQ-predicted questions

**What they cannot do:**
- View documents or IQ from other sessions
- View board member notebooks or notes
- Access any secretariat controls
- See board readiness or preparation data

---

### 5.3 Executive View

**Route:** `/org/[orgId]/exec`

**Purpose:** Executives (CEO, CFO, etc.) who attend many items but aren't board members. Similar to board view but with appropriate access restrictions.

**Differences from board member view:**
- May not have voting rights (configurable per meeting/item)
- May have restricted access to certain sessions (e.g. CEO performance review)
- Has upload/edit access to items they're presenting
- Sees their own preparation metrics but not board-wide effectiveness data
- Has IQ access for items they can view
- Cannot access board member notebooks
- May have access to secretariat-lite features for managing their own presentations

---

## 6. Shared Components & Patterns

### 6.1 Navigation Structure

**Primary nav (top bar):**
- BoardIQ logo (links to org selector)
- Current org name + switcher dropdown
- Role-appropriate main nav items:
  - Board member: Dashboard | Meetings | Notebook
  - Secretariat: Dashboard | Meetings | Organisation | Minutes
  - Presenter: Sessions
  - Executive: Dashboard | Meetings
- Search (global, respects permissions)
- Notifications
- Profile/settings

**Meeting context nav:**
- When inside a meeting view, the top bar gains: meeting name, back to dashboard, meeting-level actions

### 6.2 Document Viewer

- Embedded PDF viewer for in-app reading
- Page navigation, zoom, search within document
- Personal annotation layer (highlights, sticky notes) — private to user
- Download original file
- Print-optimised view
- Responsive: works on tablet for boardroom use

### 6.3 Notification System

**Types:**
- New meeting published
- New documents uploaded
- Agenda change (item added/removed/reordered)
- Pre-read reminder (configurable timing)
- Voting opened
- Minutes published
- Action item assigned to you
- Action item due soon

**Channels:**
- In-app notification centre (bell icon, badge count)
- Email digests (configurable: immediate, daily, weekly)
- No push notifications in v1 (add to backlog)

### 6.4 Search

- Global search across: meeting titles, agenda items, document content (full text), notes (own only), minutes
- Results grouped by type
- Respects all permission boundaries
- Filters: date range, committee, document type
- Keyboard shortcut: Cmd+K / Ctrl+K

### 6.5 Sharing & Permissions

- Per-session sharing: secretariat can grant ad-hoc access to specific items
- Shareable links with expiry dates
- Download controls: secretariat can disable document downloads per meeting or per item
- Watermarking: optional watermark with viewer's name on viewed/downloaded documents
- External sharing: generate time-limited, view-only links for external advisors

### 6.6 Audit Trail

- Available to secretariat and chair
- Logs: who accessed what document when, who voted and when, agenda changes with before/after, user permission changes, sharing activity, AI feature usage (who queried IQ, when)
- Exportable as CSV/PDF for compliance purposes
- Retention period configurable per org

### 6.7 Document Library

**Route:** `/org/[orgId]/library`

**Purpose:** Persistent document repository beyond individual meetings. Governance documents, policies, reference materials, and historical board packs live here permanently.

**Rationale (competitive gap):** All major competitors (Diligent, OnBoard, Boardvantage) offer a persistent document centre. Board members need access to standing documents (constitution, charters, policies, strategic plans) outside of specific meeting contexts. Without this, users resort to email or shared drives, which undermines the security proposition.

**Layout:**
- Folder-based organisation: Governance Documents, Policies, Strategic Plans, Historical Board Packs, Committee References, Templates
- Each document shows: name, type, upload date, last modified, uploaded by, version
- Version control: track revisions, compare versions, restore previous
- Permission-scoped: different folders visible to different roles
- Search within library (full text)
- "Pin" important documents for quick access from any meeting view
- Integration with meeting view: when attaching documents to agenda items, secretariat can pull from the library rather than re-uploading

### 6.8 Secure Messaging

**Route:** `/org/[orgId]/messages`

**Purpose:** Encrypted, in-platform communication channel between board members, executives, and secretariat. Replaces email for sensitive governance communications.

**Rationale (competitive gap):** Both Diligent and Boardvantage offer encrypted messaging specifically to keep sensitive board communications off general email. This is a governance best practice, not a nice-to-have.

**Layout:**
- Simple messaging interface (not trying to replicate Slack)
- Direct messages and group threads
- Threads can be linked to specific meetings or agenda items
- All messages encrypted end-to-end
- Message retention policies configurable by secretariat
- No forwarding to external email
- Attachments scoped by the same permission model as documents

### 6.9 Board Book Export

**Purpose:** One-click compilation of all meeting materials into a single downloadable PDF "board book" — the traditional format directors are familiar with.

**Features:**
- Auto-generated table of contents matching the agenda
- Cover page with meeting details
- Section dividers between agenda items
- All attached documents compiled in order
- Page numbering across the entire compilation
- Optional: include IQ summaries per item (secretariat-configurable)
- Downloadable for offline reading (tablet/print)
- Watermarked with the director's name

**Rationale:** Every competitor offers this. Many directors still prefer to read a compiled PDF, especially for printing or offline tablet use. This is table-stakes.

---

## 7. AI Processing Pipeline (UX Implications)

### 7.1 Document Upload Flow

From the user's perspective:

1. Secretariat uploads a document to an agenda item
2. Upload progress bar shown
3. On completion: "Processing document..." status with spinner
4. Processing stages (shown as progress steps): Upload complete → Extracting text → Analysing content → Generating IQ insights → Ready
5. If processing fails: clear error message with retry option
6. When complete: document available for viewing, IQ tab populated

### 7.2 IQ Generation Status

- Each agenda item shows IQ status: Not available | Processing | Ready | Updated
- "Updated" appears when new documents are added after initial processing
- Secretariat can trigger re-processing manually
- Board members see "IQ insights available" badge on agenda items

### 7.3 Summarisation

- Per-session summary: available after documents are processed, one-paragraph executive summary of the board paper
- Per-meeting summary: available after all items processed, high-level overview of the full agenda
- Post-meeting summary: generated from minutes, covering decisions made and actions assigned

---

## 8. Responsive & Device Considerations

### 8.1 Primary target: Desktop/laptop (1280px+)
- Full two-pane layouts
- All features available

### 8.2 Secondary target: Tablet (768px–1279px)
- Collapsible agenda sidebar (hamburger toggle)
- Document viewer adapts to width
- Touch-friendly controls for meeting use

### 8.3 Tertiary: Mobile (< 768px)
- Read-only board paper access
- Notifications and action items
- Voting
- Notebook (simplified)
- No secretariat admin features on mobile

---

## 9. Competitive Positioning & Feature Gap Analysis

### 9.1 What competitors offer that BoardIQ must match (table stakes):

- **Board book assembly & PDF export** — Diligent, OnBoard, Boardvantage all offer one-click compiled board packs. Added as 6.9.
- **Persistent document library** — all three offer document centres beyond meetings. Added as 6.7.
- **Secure/encrypted messaging** — Diligent and Boardvantage both offer in-platform encrypted messaging. Added as 6.8.
- **Action item tracking** — OnBoard and Diligent track actions across meetings. Built into secretariat dashboard (4.6) and director briefing.
- **Meeting templates & duplication** — all three offer agenda templates. Already in spec (4.3).
- **Offline/Briefcase mode** — Boardvantage's briefcase mode lets directors download materials for offline reading. Add to backlog.
- **E-signatures & approvals** — Diligent integrates DocuSign, OnBoard has native eSign. Already in backlog.
- **D&O Questionnaires & Evaluations** — Boardvantage and OnBoard offer board evaluation tools. Add to backlog.
- **Meeting analytics** — OnBoard's engagement analytics show who read what, for how long. Built into secretariat Board Readiness tab (4.6).
- **Annotations & highlights** — all three allow personal annotations on documents. Already in spec (6.2).

### 9.2 Where BoardIQ differentiates (what competitors DON'T do):

- **The Briefing** — no competitor reimagines the meeting experience from the director's perspective. They all present agendas + documents. BoardIQ presents a personalised intelligence briefing. This is the primary differentiator.
- **IQ analysis at depth** — Diligent's GovernAI summarises and generates questions. Boardvantage summarises. Neither stress-tests claims, surfaces assumptions, flags evidence gaps, or cross-references items within the same meeting. BoardIQ's IQ feature is fundamentally deeper.
- **Executive coaching via IQ** — no competitor tells executives "here's what the board will ask you." This is unique.
- **Preparation as a feature** — competitors track document access passively. BoardIQ actively gamifies preparation with progress rings, briefing updates that change as you read, and saved questions that carry from prep to meeting day. This is a behaviour-change tool, not just tracking.
- **Cross-item intelligence** — no competitor identifies contradictions or dependencies between agenda items within the same meeting. "The budget assumes a deliverable that's delayed in another paper" is something only a deeply attentive reader would catch. IQ does it automatically.
- **Top Team Effectiveness framing** — no competitor positions itself as a governance improvement tool. They're all positioned as efficiency tools. BoardIQ is positioned as a quality tool.
- **Thematic briefing vs chronological agenda** — every competitor shows a chronological agenda. BoardIQ groups by relevance and role, telling the story of the meeting rather than listing its schedule.

---

## 10. Backlog Items (Not in v1, Referenced for Future)

- Real-time presence indicators (who is viewing which agenda item during live meeting)
- Live meeting analytics dashboard for chair (engagement, time per item vs allocated)
- Virtual meeting integration (Zoom/Teams embed or link)
- Approval workflows and digital signing (DocuSign integration)
- Push notifications
- Board evaluation surveys (annual effectiveness review, built into the platform)
- D&O Questionnaires (conflict of interest, annual declarations)
- Governance calendar (annual planning view across all committees)
- Regulatory compliance checklists per jurisdiction
- Integration with company secretarial systems (entity management)
- Audio/video recording and transcription pipeline
- Board skills matrix management and gap analysis
- Director onboarding flow with historical context briefing via IQ
- Conflict of interest declaration and management
- Board portal public-facing page (for listed company governance disclosures)
- Offline/Briefcase mode for tablet use without connectivity
- Curated news feeds (industry-relevant content for directors)
- Board book compilation with custom formatting options
- Integration with Microsoft 365, Google Workspace
