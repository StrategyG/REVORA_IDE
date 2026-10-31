# ADR-0001: REVORA IDE platform baseline

- **Status:** Accepted as the implementation baseline for the foundation branch
- **Date:** 2026-10-31
- **Decision owner:** Project owner
- **Scope:** Web editor foundation; not a production deployment approval

## Context

The remote repository contained audit/design documents but no application source, runtime, package manifest, tests, or deployment configuration. A reproducible first implementation is required without introducing an untrusted code-execution surface.

## Decision

| Layer | Selection | Version / policy | Notes |
|---|---|---|---|
| Runtime | Node.js | 26.13.0 Active LTS | Pin container and CI runtime |
| Web framework | Next.js App Router | 16.4.3 | Server-first routing; avoid unnecessary client-side APIs |
| UI | React | 19.3.1 | Strict mode enabled |
| Code editor | CodeMirror 6 via React wrapper | @uiw/react-codemirror 4.25.12 | Client editor only; no shell execution |
| Data layer target | Supabase PostgreSQL | Managed Postgres + Auth + Storage | Not connected in this branch |
| SSR auth adapter target | @supabase/ssr | 0.12.7 | Server cookie adapter; validate the user on protected requests |
| Supabase JS target | @supabase/supabase-js | 2.118.0 | Publishable key may be used in browser; service-role/secret key never may |
| Input contracts | Zod | 4.6.7 target | Add when API routes are implemented |
| Execution | External ephemeral sandbox adapter | Not selected/deployed | Terminal/build/agent execution stays disabled |

## Rationale

1. Node 26 is the active LTS line at the decision date; avoid an odd-numbered Current/Alpha runtime for production.
2. Next.js App Router provides server and client component boundaries for editor and future authenticated application routes.
3. CodeMirror 6 is a focused editor surface; it is not a terminal, runtime, compiler, or sandbox.
4. Supabase is selected as the target for managed Postgres, identity, and object storage, but no existing Supabase project is assumed to belong to REVORA IDE.
5. A managed sandbox must be separately selected, configured and verified. The app API must never execute generated code directly in its process.

## Required implementation constraints

- Exact direct dependency versions; a committed package-lock.json is a release blocker until generated and verified.
- Server-only integration secrets; no service-role key in client bundles or NEXT_PUBLIC variables.
- RLS enabled on every exposed user-data table. Policies must enforce ownership/project membership, not merely authenticated role.
- Every file mutation must carry an expected version/base revision. Stale writes return 409 Conflict.
- AI output is a structured patch proposal pinned to a revision; no direct workspace writes.
- Execution is disabled until the sandbox threat model and escape/egress tests pass.
- Preview must serve immutable, revision-pinned artifacts with scoped expiry.
- All sensitive actions create attributable audit records.

## Consequences

The current branch ships a local editor foundation only. It deliberately does not claim server persistence, authentication, AI integration, terminal, build, collaboration, or deployment readiness.

## References checked on 2026-10-31

- Node.js release schedule: https://github.com/nodejs/Release
- Next.js App Router docs: https://nextjs.org/docs/app
- CodeMirror React wrapper: https://www.npmjs.com/package/@uiw/react-codemirror
- Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side
- Supabase SSR releases: https://github.com/supabase/ssr/releases
