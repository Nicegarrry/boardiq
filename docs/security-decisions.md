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

## Phase 2: Backend (Tier 2)

### SD-006: Row Level Security enabled on all tables
**Decision:** RLS is enabled on every table in the schema. No table is accessible without passing a policy check.
**Rationale:** Board governance data is highly sensitive. RLS at the database level ensures that even application bugs or misconfigured API routes cannot leak data across organisations.
**Implementation:** Migration `20260414000003_rls_policies.sql` enables RLS on all 32 tables. Each table has explicit SELECT, INSERT, and UPDATE policies. Tables without UPDATE policies (votes, audit_log) are intentionally immutable.

### SD-007: Multi-org data isolation via `auth_org_ids()` function
**Decision:** Org-scoped tables use a `SECURITY DEFINER` function `auth_org_ids()` that returns the array of org IDs the current authenticated user belongs to. All RLS policies reference this function.
**Rationale:** Centralises the org membership lookup. If the membership model changes, only the function needs updating rather than every policy. `SECURITY DEFINER` ensures the function can read `org_memberships` even when RLS is enabled on that table.
**Risk:** The function is marked `STABLE` and runs with elevated privileges. A bug could grant access to wrong orgs.
**Mitigation:** Function is simple (single query, no dynamic SQL). Covered by integration tests.

### SD-008: Notebook entries — user-only RLS, no admin read access
**Decision:** `notebook_entries` has a single `FOR ALL` policy requiring `user_id = auth.uid()`. No secretariat or admin override exists.
**Rationale:** Notebook entries contain a director's private thoughts, question strategies, and meeting preparation notes. Even the company secretary should not have database-level access to these. This is a privacy guarantee to directors.
**Risk:** If a director's account is compromised, their notes are exposed. Lost notes cannot be recovered by admin.
**Mitigation:** Account security via MFA (planned SD-012). Directors are informed that notes are private and unrecoverable.

### SD-009: Audit log — append-only, no UPDATE/DELETE policies
**Decision:** `audit_log` has RLS policies for SELECT and INSERT only. No UPDATE or DELETE policies exist, making the table effectively immutable at the application level.
**Rationale:** Governance audit trails must be tamper-proof. An attacker who gains application-level access should not be able to modify or delete audit records. Only a database superuser (not accessible via Supabase client) can alter audit entries.
**Implementation:** The `audit_log` table also has no `updated_at` or `deleted_at` columns — it is structurally append-only.

### SD-010: Soft deletes everywhere — governance audit trail compliance
**Decision:** All primary entity tables include a `deleted_at timestamptz` column. Application code sets this rather than issuing DELETE statements. Queries filter `WHERE deleted_at IS NULL` by default.
**Rationale:** Australian governance standards (ACNC Governance Standard 5) require organisations to maintain records of board decisions and processes. Hard deletes would destroy evidence. Soft deletes preserve the complete history while hiding "deleted" records from normal views.
**Implementation:** Enforced at the application layer. RLS policies do not filter on `deleted_at` — that is the responsibility of queries/views, allowing authorised users to view deleted records if needed for audit purposes.

### SD-011: Votes immutable after casting
**Decision:** `votes` has RLS policies for SELECT and INSERT only. No UPDATE or DELETE policies exist. Once a vote is cast, it cannot be changed or removed.
**Rationale:** Board votes are legal records. The result of a vote on a budget approval or CEO remuneration has legal and regulatory significance. Immutability ensures the integrity of the voting record.
**Implementation:** The `votes` INSERT policy verifies the voter's own `org_membership_id`, preventing one member from voting on behalf of another. The SELECT policy allows all org members to see vote results (visibility timing controlled at application level via `voting_results_visibility` setting).

---

### SD-012: Magic link authentication — no passwords stored
**Decision:** Authentication uses Supabase Auth magic links (email OTP) exclusively. No password field exists in the login UI. No password hashes are stored in the database.
**Rationale:** Eliminates credential theft risk entirely. No passwords means no password database to breach, no weak passwords to exploit, no credential stuffing attacks. Magic links are time-limited and single-use.
**Implementation:** `src/lib/auth.ts` exposes `signInWithMagicLink()` which calls `supabase.auth.signInWithOtp()`. The login page at `src/app/login/page.tsx` collects only an email address. The magic link redirects to `/auth/callback` which exchanges the code for a session.

### SD-013: Session cookies — httpOnly, secure, sameSite=lax
**Decision:** Session tokens are stored in httpOnly cookies with secure and sameSite=lax attributes. Not accessible to client-side JavaScript.
**Rationale:** httpOnly prevents XSS attacks from stealing session tokens. Secure ensures cookies are only sent over HTTPS. SameSite=lax prevents CSRF while allowing normal navigation flows. This is handled automatically by `@supabase/ssr`'s cookie management.
**Implementation:** `src/middleware.ts` uses `createServerClient` from `@supabase/ssr` which manages cookie get/set operations with secure defaults. The middleware refreshes the session on every request to keep cookies in sync.

### SD-014: Auth middleware bypassed when NEXT_PUBLIC_DATA_SOURCE=mock
**Decision:** When `NEXT_PUBLIC_DATA_SOURCE` is not set to `supabase`, the auth middleware returns `NextResponse.next()` immediately, allowing unauthenticated access to all routes.
**Rationale:** Demo mode (Tier 1) uses synthetic data and a client-side role switcher. Requiring authentication for demos would add friction without security value — there is no real data to protect. The demo is clearly labelled and contains only Coastal Health Foundation mock data.
**Risk:** If `NEXT_PUBLIC_DATA_SOURCE` is accidentally left as `mock` in production, auth is bypassed.
**Mitigation:** Vercel environment variables are set per-environment. Production deployment checklist includes verifying `NEXT_PUBLIC_DATA_SOURCE=supabase`.

### SD-015: Document storage via Supabase Storage with signed URLs
**Decision:** Board documents are stored in a private Supabase Storage bucket (`documents`). Access is via signed URLs with 1-hour expiry. No public document URLs are generated in application code.
**Rationale:** Board documents are highly confidential (financial reports, CEO evaluations, legal opinions). Signed URLs ensure that document access requires active authentication and that leaked URLs expire quickly. The 1-hour window balances usability (long enough to read a document) with security (short enough to limit exposure from a leaked link).
**Implementation:** `src/lib/storage.ts` provides `uploadDocument()`, `downloadDocument()` (signed URL), and `deleteDocument()`. The `getDocumentPublicUrl()` utility exists but is not used in standard flows — it is available only for explicitly public assets if ever needed.

---

## Phase 2: Backend (Tier 2) — Remaining Planned Entries

- SD-016: Document text sent only to Anthropic API (no third-party training)
- SD-017: Data retention policies per entity type
