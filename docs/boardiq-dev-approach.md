# BoardIQ — Development Approach: Two-Tier Architecture

## Overview

BoardIQ is developed in two parallel tiers that share the same Next.js codebase but differ in how data flows:

**Tier 1: Interactive Demo (Vercel)**
Ships first. A fully functional frontend deployed to Vercel that uses hardcoded mock data and React state for interactivity. Real AI chat via direct Anthropic API calls from the client. No backend, no database, no auth. Purpose: customer demos, investor presentations, user testing.

**Tier 2: Full Application (Local Dev → Supabase)**
The real platform with Supabase backend, PostgreSQL database, Row Level Security, file storage, and server-side AI processing pipeline. Developed locally in Docker, deployed to Supabase when ready.

Both tiers use the same component library, design system, and page layouts. The difference is the data layer.

---

## Tier 1: Interactive Demo

### What works without a backend

| Feature | How it works in demo | Feels real? |
|---------|---------------------|-------------|
| Role switching | Dropdown in top nav sets React context. All components read role from context and render accordingly. | ✓ Fully functional |
| Director briefing (prep + day) | Renders from `mock-data.js`. Cards expand, IQ badges show, progress rings calculate from read status. | ✓ Fully functional |
| Secretariat dashboard | Paper tracking, board readiness, action items — all render from mock data. Tabs work, sorting works. | ✓ Fully functional |
| Executive briefing | Filters mock data to exec's sessions. IQ "what the board may ask" renders from same analysis data. | ✓ Fully functional |
| Expanding cards | React state (`expandedCards`) tracks which cards are open. | ✓ Fully functional |
| Slide-over detail panel | React state controls panel visibility. Tabs (Overview / Documents / IQ) all render from mock data. | ✓ Fully functional |
| Mark document as read | Toggles read status in React state. Progress rings recalculate. Briefing narrative doesn't update (static text). | ✓ Convincing |
| Add agenda item | Opens a form, adds to React state array. New item appears in agenda. Persists within session only. | ✓ Convincing |
| Edit agenda item | Inline editing of title, description, timing. Updates React state. | ✓ Convincing |
| Reorder agenda | Drag-and-drop reordering with state update. | ✓ Convincing |
| Cast vote | Vote buttons active in day mode. Selection stored in React state. Tally updates. | ✓ Convincing |
| Add notebook entry | Text input saved to React state. Shows in notebook list. | ✓ Convincing |
| Save IQ question to notebook | Click handler copies question text to notebook state array. | ✓ Convincing |
| Dismiss IQ question | Removes from visible list (state update). | ✓ Convincing |
| Notifications panel | Renders from mock data. Click to mark as read (state toggle). | ✓ Convincing |
| **IQ Chat — REAL AI** | Calls Anthropic API directly from the browser. Document summaries from mock data injected as context. Real conversational responses. | ✓✓ Actually real |
| Search | Client-side text search across mock data (titles, descriptions, document summaries). | ✓ Convincing |
| PDF viewer | Show placeholder "document preview" UI. No actual PDF rendering in demo. Link to "Open document" that shows the summary. | ○ Placeholder |
| Document upload | File picker opens, filename added to state, no actual storage. | ○ Placeholder |
| Board book export | Button triggers download of a pre-generated placeholder PDF. | ○ Placeholder |

### IQ Chat — the demo's killer feature

The demo can run **real AI conversations** about the board papers because:

1. Document summaries in `mock-data.js` contain enough detail (500-800 words each) to serve as rich context
2. The Anthropic API is callable from the browser in Vercel-deployed Next.js
3. The `iqChatSystemPrompt` and `buildItemChatContext()` function in mock-data.js construct a properly scoped prompt
4. Each chat is scoped to the current agenda item — the model only sees that item's documents and IQ analysis

Implementation:
```typescript
// In the IQ Chat component
const response = await fetch('/api/iq-chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: chatHistory,
    itemId: currentItem.id,
    userRole: currentRole, // 'director' | 'executive'
  }),
});

// In /api/iq-chat route handler
const context = buildItemChatContext(itemId);
const systemPrompt = iqChatSystemPrompt + context;

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: systemPrompt,
  messages: messages,
});
```

The API key is stored as a Vercel environment variable. The route handler is a Next.js API route — no separate backend needed.

### Demo limitations (clearly communicated)

- Data doesn't persist between sessions (refresh = reset)
- No multi-user — role switcher simulates different users but there's one state
- No actual file upload/storage
- No document processing pipeline (IQ analyses are pre-generated)
- No real PDF viewing (summaries shown instead)
- AI briefing narratives are static (don't update as you read documents)
- No audit trail (actions aren't logged)

### Demo data completeness

The `mock-data.js` file provides everything needed:
- 1 organisation with full metadata
- 4 committees with descriptions
- 11 users (6 board, 4 exec, 1 secretariat) with bios
- 1 meeting with complete lifecycle metadata
- 11 agenda items with full descriptions, timing, presenters
- 18 documents with 500-800 word content summaries
- 7 IQ analyses with structured claims, assumptions, risk flags
- 18 suggested questions with director + executive framings
- Cross-item intelligence links (5 connections)
- Per-user document read status for all 6 directors
- 4 action items from previous meeting
- 2 notebook entries (Patricia's saved IQ questions)
- 6 notifications
- Per-role briefing narratives (prep + day modes)
- IQ chat system prompt with context builder function

---

## Tier 2: Full Application

### Architecture

```
┌─────────────────────────────────────────┐
│           Next.js Frontend              │
│  (same components as demo tier)         │
│  deployed to Vercel                     │
├─────────────────────────────────────────┤
│         Next.js API Routes              │
│  /api/meetings, /api/agenda-items, ...  │
│  /api/iq-chat, /api/iq-process          │
├─────────────────────────────────────────┤
│         Supabase                        │
│  ├── PostgreSQL (data model v1.0)       │
│  ├── Row Level Security (RLS)           │
│  ├── Auth (magic links)                 │
│  ├── Storage (documents, exports)       │
│  └── Edge Functions (webhooks)          │
├─────────────────────────────────────────┤
│         AI Processing Pipeline          │
│  ├── Document ingestion (PDF → text)    │
│  ├── IQ analysis generation             │
│  ├── Briefing narrative generation      │
│  ├── Minutes summarisation              │
│  └── Anthropic API (Claude)             │
└─────────────────────────────────────────┘
```

### Data layer swap

The key architectural decision: components never import from `mock-data.js` directly. Instead, they consume data through hooks:

```typescript
// Demo tier
function useMeeting(meetingId: string) {
  return useMockMeeting(meetingId); // reads from mock-data.js
}

// Full tier
function useMeeting(meetingId: string) {
  return useSupabaseMeeting(meetingId); // reads from Supabase
}
```

A single environment variable (`NEXT_PUBLIC_DATA_SOURCE=mock|supabase`) controls which data layer is active. This lets us:
- Develop UI components against mock data (fast iteration)
- Switch to Supabase for integration testing
- Deploy the demo tier to Vercel while developing the full tier locally

### Data hook interface (shared between tiers)

```typescript
interface DataHooks {
  // Read
  useMeeting(meetingId: string): Meeting;
  useAgendaItems(meetingId: string, userId: string): AgendaItem[];
  useDocuments(itemId: string): Document[];
  useDocumentReads(meetingId: string, userId: string): DocumentRead[];
  useIQAnalysis(itemId: string): IQAnalysis | null;
  useIQQuestions(itemId: string): IQQuestion[];
  useActionItems(orgId: string): ActionItem[];
  useNotifications(userId: string): Notification[];
  useNotebookEntries(userId: string, meetingId?: string): NotebookEntry[];
  useBoardReadiness(meetingId: string): BoardMemberReadiness[];
  useBriefingNarrative(meetingId: string, userId: string, mode: string): string;

  // Write
  markDocumentRead(docId: string, userId: string): void;
  addAgendaItem(meetingId: string, item: Partial<AgendaItem>): void;
  updateAgendaItem(itemId: string, updates: Partial<AgendaItem>): void;
  castVote(itemId: string, userId: string, value: string): void;
  addNotebookEntry(entry: Partial<NotebookEntry>): void;
  saveIQQuestion(questionId: string, userId: string): void;
  dismissIQQuestion(questionId: string, userId: string): void;
  markNotificationRead(notifId: string): void;
  updateActionItem(itemId: string, updates: Partial<ActionItem>): void;
}
```

### Local development setup (Tier 2)

```bash
# Docker compose for local Supabase
docker compose up -d  # Supabase local (postgres, auth, storage, studio)

# Seed database with demo data
npm run db:seed  # Transforms mock-data.js → SQL inserts

# Run Next.js with Supabase data source
NEXT_PUBLIC_DATA_SOURCE=supabase npm run dev
```

### Migration path: Demo → Full

1. **Phase 1 (now):** Ship demo to Vercel with mock data. Get customer feedback.
2. **Phase 2:** Build Supabase data hooks. Run locally with Docker. Test with seed data.
3. **Phase 3:** Add auth (magic links). Real user sessions.
4. **Phase 4:** Build document processing pipeline (PDF → text → IQ analysis).
5. **Phase 5:** Deploy Supabase to cloud. Connect Vercel → Supabase.
6. **Phase 6:** Migrate demo to full tier. Demo URL becomes the product.

---

## File Structure

```
boardiq/
├── CLAUDE.md                    # Claude Code guidance (created last)
├── docs/
│   ├── screen-specs.md          # Screen specifications v1.0
│   ├── data-model.md            # Database schema & RLS
│   ├── dev-approach.md          # This document
│   ├── backlog.md               # Feature backlog
│   └── mock-data.ts             # Demo data (TypeScript version)
│
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with fonts, providers
│   │   ├── page.tsx             # Meeting briefing (default view)
│   │   ├── api/
│   │   │   └── iq-chat/
│   │   │       └── route.ts     # IQ chat API route (Anthropic)
│   │   └── ...
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── TopBar.tsx
│   │   │   ├── RoleSwitcher.tsx
│   │   │   └── NotificationPanel.tsx
│   │   ├── meeting/
│   │   │   ├── MeetingBriefing.tsx     # The money screen
│   │   │   ├── BriefingCard.tsx        # AI briefing summary
│   │   │   ├── AgendaCard.tsx          # Expandable item card
│   │   │   ├── IQBadge.tsx
│   │   │   ├── IQPanel.tsx             # Inline IQ analysis
│   │   │   ├── IQChat.tsx              # Chat interface
│   │   │   ├── DocumentList.tsx
│   │   │   ├── VoteCard.tsx
│   │   │   ├── PrepProgress.tsx
│   │   │   └── ChronologicalAgenda.tsx
│   │   ├── secretariat/
│   │   │   ├── SecretariatDashboard.tsx
│   │   │   ├── PaperTracking.tsx
│   │   │   ├── BoardReadiness.tsx
│   │   │   ├── ActionItemTracker.tsx
│   │   │   └── AgendaEditor.tsx
│   │   ├── executive/
│   │   │   └── ExecBriefing.tsx
│   │   └── shared/
│   │       ├── SlideOver.tsx
│   │       ├── Badge.tsx
│   │       ├── ProgressRing.tsx
│   │       ├── Card.tsx
│   │       └── SectionHeader.tsx
│   │
│   ├── hooks/
│   │   ├── useMockData.ts      # Demo tier data hooks
│   │   ├── useSupabaseData.ts  # Full tier data hooks (future)
│   │   ├── useData.ts          # Router that selects mock vs supabase
│   │   └── useRole.ts          # Current role context
│   │
│   ├── lib/
│   │   ├── mock-data.ts        # All demo data
│   │   ├── types.ts            # TypeScript types matching data model
│   │   ├── iq-context.ts       # Chat context builder
│   │   └── supabase.ts         # Supabase client (future)
│   │
│   └── styles/
│       └── globals.css          # Tailwind + custom tokens
│
├── supabase/                    # Tier 2 only
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── seed.sql
│   └── config.toml
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                   # ANTHROPIC_API_KEY, NEXT_PUBLIC_DATA_SOURCE
```

---

## Environment Variables

```env
# Required for both tiers
ANTHROPIC_API_KEY=sk-ant-...          # For IQ chat API route

# Demo tier (Vercel)
NEXT_PUBLIC_DATA_SOURCE=mock

# Full tier (local dev)
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## What to demo and how

### Demo script for customer meetings (15 min)

1. **Open as Patricia (director)** — show the briefing in prep mode. "This is what your directors see 5 days before the meeting. Not an agenda — a personalised intelligence briefing."

2. **Expand the mental health proposal** — show the IQ analysis with evidence gaps. "IQ has read the papers and identified that the service model has no evidence base for regional delivery. Three similar programs nationally failed. The paper doesn't mention any of them."

3. **Show the cross-item intelligence** — expand the budget, point to the IQ badge linking it to the fundraising strategy. "IQ noticed that the budget assumes a CRM-driven revenue uplift, but the fundraising report says the CRM is 15 months behind. Two papers in the same board pack making contradictory assumptions — IQ catches this automatically."

4. **Open IQ chat** — ask a question about the budget. Real AI response using document context. "Directors can interrogate any paper in natural language. The AI cites specific documents and pages."

5. **Switch to secretariat view** — show paper tracking and board readiness. "Your governance team sees which papers are in, who's read what, and who needs a nudge — in real time."

6. **Switch to executive view (Michael Torres, CFO)** — show "What the Board May Ask" framing. "Your executives see the same IQ analysis, but framed as preparation coaching. The AI tells them what questions to expect."

7. **Switch back to Patricia, toggle to Meeting Day mode** — show saved questions from prep, active voting, chronological reference. "On the day, the briefing updates. Saved questions from preparation appear alongside the AI-generated ones. Voting goes live."
