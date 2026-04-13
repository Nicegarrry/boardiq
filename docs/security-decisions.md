# Security & Privacy Design Decisions

This document tracks all security and privacy design choices made during BoardIQ development, with rationale. Updated incrementally as features are built.

---

## Phase 1: Frontend Demo (Tier 1)

### SD-001: No authentication in demo tier
**Decision:** Demo mode uses a client-side role switcher (React context) instead of real authentication.
**Rationale:** Tier 1 is a demo deployed to Vercel for customer presentations. No real user data exists. Authentication adds friction without value at this stage.
**Risk:** None — demo data is synthetic (Coastal Health Foundation). No real PII.
**Mitigation:** Role switcher clearly labelled as demo mode. Will be replaced by Supabase Auth in Tier 2.

### SD-002: API key stored server-side only
**Decision:** `ANTHROPIC_API_KEY` is stored as a Vercel environment variable and accessed only in the Next.js API route handler (`/api/iq-chat`). Never exposed to the client.
**Rationale:** Client-side API key exposure would allow key theft and abuse.
**Implementation:** Confirmed implemented. Key read via `process.env.ANTHROPIC_API_KEY` in `src/app/api/iq-chat/route.ts` only. The route handler validates the key exists before making API calls and returns a 500 error with a helpful message if missing. The client component (`src/components/meeting/IQChat.tsx`) calls the API route via `fetch('/api/iq-chat')` and never touches the key directly.

### SD-003: No PII in client-side storage
**Decision:** No personal data stored in localStorage, sessionStorage, or cookies in Tier 1.
**Rationale:** Demo mode uses in-memory React state. No persistence needed. Avoids GDPR/privacy concerns.

### SD-004: IQ Chat input sanitisation
**Decision:** User messages to the IQ Chat API are validated (non-empty string, max length) and the `itemId` parameter is validated against known agenda items before constructing the AI prompt.
**Rationale:** Prevents prompt injection via crafted itemIds and limits abuse via oversized inputs.

### SD-005: No real document storage in demo
**Decision:** Document "uploads" in Tier 1 are simulated — filename added to React state, no file stored anywhere.
**Rationale:** Avoids need for storage infrastructure in demo. Prevents accidental upload of real board documents to a demo system.

---

## Phase 2: Backend (Tier 2) — To Be Added

Planned entries:
- SD-006: Row Level Security (RLS) on all tables
- SD-007: Multi-org data isolation at database level
- SD-008: Notebook entry privacy (user-only access, no admin read)
- SD-009: Audit log immutability (append-only, no UPDATE/DELETE)
- SD-010: Soft deletes everywhere (governance audit trail)
- SD-011: Magic link authentication (no passwords)
- SD-012: Session cookies (httpOnly, secure, sameSite=lax)
- SD-013: Document storage RLS (matching document table policies)
- SD-014: Vote immutability (legal record)
- SD-015: Document text sent only to Anthropic API (no third-party training)
- SD-016: Data retention policies per entity type
