# REVORA IDE production readiness gate

**Current decision: BLOCKED — foundation preview only**  
**Evaluation date:** 2026-11-01

A repository is not production-ready because it has documentation, a successful local build, or a green CI badge. Every row below requires verifiable evidence at the candidate release SHA.

| Gate | Required evidence | Current status |
|---|---|---|
| Source baseline | Reviewed PR, protected main, branch/ruleset policy and signed release SHA | BLOCKED |
| Dependency integrity | Exact package pins, committed lockfile, clean npm ci, license and vulnerability review | BLOCKED — no lockfile yet |
| Build reproducibility | Clean build from pinned commit and container digest | NOT RUN |
| Authentication | Verified SSR session, sign-in/out, expiry and revocation behavior | BLOCKED |
| Authorization | Server checks and RLS tests for cross-user/project denial | BLOCKED |
| Data integrity | PostgreSQL migrations, backup policy, transactional saves and optimistic concurrency | BLOCKED |
| File storage | Durable storage, quotas, checksums, restore and retention tests | BLOCKED |
| Revision history | Immutable revision manifests, parent lineage, atomic restore | PARTIAL — deterministic content manifest and revision conflict contract exist; no durable revision service or restore |
| AI gateway | Server-side credentials, approved provider policy, quotas, cancellation and traces | BLOCKED |
| Patch lifecycle | Schema validation, path policy, base revision, diff review, approval, atomic apply and rollback | PARTIAL — pure proposal/digest/approval contract and in-memory candidate apply tested; no authenticated server approval, DB transaction, audit log, or durable rollback |
| Runtime isolation | Independent sandbox, non-root, no host secrets/mounts, resource and egress limits | BLOCKED — execution disabled |
| Build/test service | Durable job queue, pinned source/toolchain, logs and artifact digest | BLOCKED |
| Preview gateway | Scoped/expiring access to immutable artifacts | BLOCKED |
| Web security | CSP review, CSRF/XSS tests, rate limits, security headers and dependency scanning | PARTIAL |
| Observability | Structured redacted logs, metrics, traces, alerts and SLOs | BLOCKED |
| Recovery | Database/object backup and successful restore drill | BLOCKED |
| Deployment | Staging validation, protected environment approval, rollback and smoke tests | BLOCKED |
| Responsive/accessibility | Real browser tests for desktop, tablet, Android portrait/landscape, keyboard and screen reader | BLOCKED |
| Operational ownership | Incident response, support owner, on-call path and change management | BLOCKED |

## Automated release rule

The application must not be promoted to production while any security-critical row is BLOCKED, NOT RUN, or NOT VERIFIED. The current readyz endpoint deliberately returns HTTP 503.

## Scope of the foundation preview

Implemented in this branch:
- Next.js application shell
- CodeMirror editor
- Browser-only local draft storage and workspace JSON export
- Client-side relative-path guard
- Health and explicit not-ready endpoints
- Baseline HTTP security headers
- Docker non-root runtime definition (if configured)
- Unit tests for the client path policy

Not implemented:
- Authentication, server-side authorization, database or durable file storage
- Durable server-enforced path policy, database revision concurrency, and persistent revision history (domain helpers only exist)
- AI gateway, authenticated patch approval, server-side transactional patch application, audit workflow, and durable rollback
- Terminal, build/test orchestration, sandbox or preview runtime
- Production CI lockfile, deployment, backups, monitoring or restore drill

The UI is a foundation preview, not a production IDE.


## Verified domain-layer upgrade — 2026-11-01

The upgrade branch now contains and tests:
- Deterministic workspace manifests with per-file SHA-256 digests, total byte accounting, quotas, and manifest verification.
- Revision-base comparison to reject stale writes.
- Patch proposal schema validation with bounded operation count and content size.
- Path policy rejects traversal, internal metadata folders, Windows separators, control bytes, and prototype-pollution segments.
- Patch digest calculation and approval verification bound to the exact patch digest and expiry.
- In-memory patch candidate generation that validates all operation preconditions before producing a new workspace object; it does not mutate the input workspace.

These are pure Node.js domain contracts. They do **not** authenticate the approver, persist revisions, provide a database transaction, create an audit record, expose an API, or implement durable rollback. The release gates remain PARTIAL/BLOCKED until those server-side services are built and tested.
