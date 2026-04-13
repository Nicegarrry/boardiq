# CLAUDE.md — BoardIQ

## What This Is

Board governance platform. AI-native alternative to Diligent/Boardvantage. Replaces 500-page board packs with personalised intelligence briefings.

## Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Fonts:** Instrument Serif (display) + Hanken Grotesk (UI) via Google Fonts
- **Backend (Tier 1 / demo):** No backend. Mock data in `src/lib/mock-data.ts`. React state for interactivity. Anthropic API for IQ chat via `/api/iq-chat` route.
- **Backend (Tier 2 / full):** Supabase (Postgres, Auth, Storage, RLS). Switch via `NEXT_PUBLIC_DATA_SOURCE=mock|supabase`.
- **Deploy:** Vercel

## Key Docs (read before building)

All in `/docs`:
- `screen-specs.md` — Every screen, every state, every interaction
- `design-brief.md` — Visual language, color system, anti-AI principles, typography
- `data-model.md` — Database schema, RLS policies, key queries
- `dev-approach.md` — Two-tier architecture, file structure, data hook interface
- `mock-data.ts` — Complete demo data for Coastal Health Foundation
- `backlog.md` — Deferred features
- `work-plan.md` — Build sequence

## Core Concepts

Three user roles (demo uses top-right dropdown switcher, no auth):
- **Director** → Meeting Briefing (prep + day modes). The money screen.
- **Secretariat** → Paper tracking, board readiness, agenda management, minutes
- **Executive** → Session briefing scoped to their items, "what the board will ask"

Data flows through hooks (`src/hooks/useData.ts`) that route to mock or Supabase.

## Design Rules

Read `design-brief.md` for full detail. Non-negotiables:
- Warm off-white backgrounds (`#FAF9F7`), not cool grey
- Single accent: ember `#C2410C`. Appears in ~5% of screen. Everything else is warm greyscale.
- No traffic-light colored chips. Status via typographic weight (bold = important, faded = resolved).
- Serif (Instrument Serif) for titles/display. Sans (Hanken Grotesk) for everything functional.
- No drop shadows. Borders only.
- No emoji in UI chrome.
- Cards: 8px radius, 1px solid border, no shadow.
- Max content width 800px. Transitions 150ms ease.
- IQ markers feel like editorial margin notes, not notification badges.

## Conventions

- Components in `src/components/{domain}/` (meeting, secretariat, executive, shared, layout, ui)
- Types in `src/lib/types.ts` matching data model
- All data access via hooks in `src/hooks/`, never import mock-data directly from components
- File naming: PascalCase for components, camelCase for hooks/utils
- No `any` types. Strict TypeScript.
- Prefer server components. Use `'use client'` only when state/interactivity needed.

## Environment

```
ANTHROPIC_API_KEY=           # Required. For IQ chat.
NEXT_PUBLIC_DATA_SOURCE=mock # 'mock' for demo, 'supabase' for full
```
