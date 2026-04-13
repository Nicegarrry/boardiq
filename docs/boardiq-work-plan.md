# BoardIQ — Work Plan

## Build Sequence

Each phase produces a deployable state. Ship to Vercel after Phase 3.

---

### Phase 0: Scaffold
Set up the project foundation. No visible UI yet.

- [ ] `npx create-next-app@latest boardiq` with TypeScript, Tailwind, App Router
- [ ] Install shadcn/ui, configure with custom theme tokens from design brief
- [ ] Add Google Fonts (Instrument Serif, Hanken Grotesk) to layout
- [ ] Set up Tailwind config with custom colors (`--ember`, `--paper`, warm greys)
- [ ] Create `/docs` folder, copy in all spec docs
- [ ] Create `src/lib/types.ts` — TypeScript types for all entities (Organisation, User, Meeting, AgendaItem, Document, IQAnalysis, etc.)
- [ ] Create `src/lib/mock-data.ts` — port mock-data.js to TypeScript
- [ ] Create `src/hooks/useData.ts` — data hook router with mock implementation
- [ ] Create `src/hooks/useRole.ts` — role context provider (director/secretariat/executive)
- [ ] Create `.env.local` with `NEXT_PUBLIC_DATA_SOURCE=mock`
- [ ] Verify: `npm run dev` loads blank page with correct fonts

**Output:** Empty shell, correct fonts, types compile, mock data loads in hooks.

---

### Phase 1: Shared Components
Build the component library. No pages yet — test in a scratch page.

- [ ] `src/components/shared/Badge.tsx` — action type labels, IQ indicators per design brief (no colored chips — typographic treatment)
- [ ] `src/components/shared/Card.tsx` — standard card container with hover state
- [ ] `src/components/shared/ProgressRing.tsx` — SVG circular progress
- [ ] `src/components/shared/ProgressBar.tsx` — linear progress
- [ ] `src/components/shared/SectionHeader.tsx` — section divider with label + count
- [ ] `src/components/shared/StatusLabel.tsx` — status text treatment (bold/medium/faded, no pills)
- [ ] `src/components/shared/Button.tsx` — primary (ember), secondary (outline), small variants
- [ ] `src/components/shared/TabBar.tsx` — tab navigation
- [ ] `src/components/shared/SlideOver.tsx` — right slide-over panel with backdrop
- [ ] `src/components/layout/TopBar.tsx` — logo, org name, nav items, notification bell, role switcher
- [ ] `src/components/layout/RoleSwitcher.tsx` — dropdown to switch demo roles
- [ ] `src/components/layout/NotificationPanel.tsx` — dropdown notification list
- [ ] Wire up role context: TopBar reads from useRole, RoleSwitcher updates it

**Output:** Scratch page showing all components. TopBar functional with role switching.

---

### Phase 2: Director Meeting Briefing
The money screen. Build this first and make it exceptional.

- [ ] `src/app/page.tsx` — root page, renders the appropriate view based on role context
- [ ] `src/components/meeting/MeetingHeader.tsx` — meeting type, date (serif hero), time, location
- [ ] `src/components/meeting/ModeToggle.tsx` — prep / meeting day switcher
- [ ] `src/components/meeting/PrepProgress.tsx` — progress ring + docs read + days until
- [ ] `src/components/meeting/BriefingCard.tsx` — AI narrative with ember top-bar accent, IQ severity markers
- [ ] `src/components/meeting/AgendaCard.tsx` — expandable card with:
  - Collapsed: action label, IQ indicator, title (serif), metadata, progress ring
  - Expanded: your-role callout, summary, IQ analysis panel, document list, vote preview, action buttons
- [ ] `src/components/meeting/IQPanel.tsx` — inline IQ analysis with claims, questions (star/dismiss)
- [ ] `src/components/meeting/DocumentRow.tsx` — document with type indicator, read status, page count
- [ ] `src/components/meeting/VoteCard.tsx` — motion text + voting buttons (active in day mode only)
- [ ] `src/components/meeting/ActionItemList.tsx` — outstanding actions section
- [ ] `src/components/meeting/ChronologicalAgenda.tsx` — compact time-ordered list (day mode only)
- [ ] `src/components/meeting/MeetingBriefing.tsx` — orchestrator: groups items by role/theme, renders sections with narratives
- [ ] Wire up: mark document read (updates mock state), save/dismiss IQ questions, expand/collapse cards
- [ ] Slide-over integration: "Open full detail" on any card opens SlideOver with Overview/Documents/IQ tabs

**Output:** Full director briefing, both modes. Expandable cards with IQ inline. Slide-over works. Interactive read tracking.

---

### Phase 3: Secretariat + Executive Views
Complete the three-role demo.

Secretariat:
- [ ] `src/components/secretariat/SecretariatDashboard.tsx` — orchestrator with metric cards + tabs
- [ ] `src/components/secretariat/MetricCards.tsx` — papers ready, board prep %, overdue, actions
- [ ] `src/components/secretariat/PaperTracking.tsx` — sortable table of agenda items by paper status
- [ ] `src/components/secretariat/BoardReadiness.tsx` — per-director prep table with nudge buttons
- [ ] `src/components/secretariat/ActionItemTracker.tsx` — action items with status updates
- [ ] `src/components/secretariat/AgendaEditor.tsx` — agenda list with add/edit/reorder controls

Executive:
- [ ] `src/components/executive/ExecBriefing.tsx` — session briefing with "what the board may ask" IQ framing
- [ ] `src/components/executive/SessionCard.tsx` — rich card with paper status, upload controls, IQ panel
- [ ] `src/components/executive/AwarenessItem.tsx` — compact row for non-presenting items
- [ ] `src/components/executive/PaperDeadlines.tsx` — personal paper status tracker

Interactivity:
- [ ] Secretariat: add agenda item (form → state), update paper status, send nudge (toast)
- [ ] Executive: mark paper complete (state update), upload document (filename to state)

**Output:** All three roles functional. Deploy to Vercel. Demo-ready.

---

### Phase 4: IQ Chat (Real AI)
Add the live AI conversation feature.

- [ ] `src/app/api/iq-chat/route.ts` — API route calling Anthropic with scoped document context
- [ ] `src/lib/iq-context.ts` — builds system prompt + item context from mock data
- [ ] `src/components/meeting/IQChat.tsx` — chat interface within slide-over IQ tab
  - Message list (user/assistant), input field, send button
  - Scoped to current agenda item
  - Shows suggested prompts when empty
  - Streams responses
  - Disclaimer footer
- [ ] Add IQ Chat to executive slide-over too (same component, different system prompt framing)

**Output:** Directors and executives can have real AI conversations about board papers.

---

### Phase 5: Polish & Demo Prep
Refinement pass for customer demos.

- [ ] Notebook panel — slide-out from right with note list and editor
- [ ] Saved IQ questions appear in meeting day mode briefing card
- [ ] Empty states for all views (no meetings, no documents, etc.)
- [ ] Loading skeletons for IQ chat
- [ ] Keyboard shortcuts (Escape to close panels, up/down for agenda navigation)
- [ ] Print-friendly CSS for the briefing view
- [ ] Mobile responsive: single-column stack, collapsible sections
- [ ] SEO/meta: page titles per role, OG image
- [ ] Favicon and PWA manifest
- [ ] Demo landing page with role selection (optional, for sharing link externally)
- [ ] Run through 15-minute demo script (in dev-approach.md), fix any awkward flows

**Output:** Production-quality demo ready for customer meetings.

---

### Phase 6: Supabase Backend (Tier 2)
Begin only after demo is shipping and getting feedback.

- [ ] `docker compose` for local Supabase
- [ ] `supabase/migrations/001_initial_schema.sql` — create all tables from data-model.md
- [ ] RLS policies per data-model.md section 13
- [ ] `supabase/seed.sql` — transform mock-data.ts → SQL inserts
- [ ] `src/lib/supabase.ts` — Supabase client initialisation
- [ ] `src/hooks/useSupabaseData.ts` — implement all data hook interfaces against Supabase
- [ ] Update `useData.ts` router to support `supabase` data source
- [ ] Test: switch env to `supabase`, verify all views render from database
- [ ] Supabase Auth: magic link flow, session management
- [ ] Supabase Storage: document upload bucket, RLS policies
- [ ] Document processing pipeline: upload → extract text → store → trigger IQ analysis
- [ ] IQ analysis generation: server-side Anthropic call per agenda item on document upload
- [ ] Briefing narrative generation: per-user personalised summaries on document change

**Output:** Full application running locally with real data persistence, auth, and AI pipeline.
