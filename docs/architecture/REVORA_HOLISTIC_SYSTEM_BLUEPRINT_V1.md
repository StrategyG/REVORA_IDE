# REVORA IDE — Holistic System Architecture & Upgrade Blueprint

**Version:** 1.0  
**Date:** 2026-11-01  
**Status:** Proposed target architecture; implementation and production verification pending  
**Baseline examined:** `feat/production-foundation-v1` at `aba136ee93e67ebfd61f02dc79d071c7e37925c6`  
**Scope:** The complete REVORA IDE system, not an individual development stage.

> This document is an architecture and delivery baseline. It does not certify the current repository or service as production-ready. All statements about existing implementation are limited to the inspected repository snapshot.

---

## 1. Executive assessment

REVORA IDE currently has a browser-local editor foundation, not a complete engineering workspace. The repository contains a Next.js App Router shell, React, CodeMirror 6, local-browser draft storage, workspace JSON export, client-side path checks, liveness/readiness endpoints, a non-root Dockerfile, basic tests, CI workflow, and initial architecture/security/release documents.

The following product-critical capabilities are not implemented in the inspected branch: identity and server authorization, durable workspace persistence, immutable revision service, AI provider gateway, repository context engine, structured patch workflow, human approval service, isolated execution, durable build/test jobs, artifact/preview gateway, production observability, verified backup/restore, staging, and deployment controls.

The default branch `main` contains only a bootstrap README at the audited snapshot. The runnable foundation is on `feat/production-foundation-v1`; PR #3 is a draft targeting `docs/stage0-repository-audit-v42`. All four listed branches were reported unprotected by GitHub at inspection time. Therefore source governance and promotion topology are release blockers alongside missing application capabilities.

**Decision: MODIFY.** Retain the current editor foundation where sound, but rebuild the missing platform capabilities around explicit domain boundaries, durable state, immutable revisions, least-privilege authorization, controlled AI changes, and isolated execution. Do not label the product production-ready until the evidence gates in the companion execution plan pass at one exact release SHA.

## 2. Product boundary and operating principles

### 2.1 Product definition

REVORA IDE is an **AI Engineering Workspace** that enables a user to:

1. Create or import a software project.
2. Browse and edit project files in a persistent workspace.
3. Ask AI to explain, generate, refactor, and diagnose code using permission-filtered project context.
4. Review proposed file changes as structured diffs.
5. Approve, reject, or request revision of those changes.
6. Run approved builds and tests in isolated environments.
7. Inspect logs, diagnostics, artifacts, and previews.
8. Synchronize approved changes with Git hosting.
9. Recover prior revisions and audit sensitive actions.

The AI is an engineering assistant operating under platform policy. It is not an unrestricted administrator, shell user, or source-of-truth authority.

### 2.2 Non-negotiable principles

- **Evidence before claims:** distinguish IMPLEMENTED, PASS, FAIL, BLOCKED, NOT RUN, and NOT VERIFIED.
- **Deny by default:** access, tools, network egress, runtime permissions, and provider data sharing begin disabled.
- **Human approval for consequential changes:** apply patches, destructive actions, credential access, external side effects, and deployment require explicit approval.
- **Immutable provenance:** every patch, test, build, artifact, and approval points to a specific revision/configuration digest.
- **No execution in the web process:** repository code and model-generated code never run inside the Next.js/API process.
- **Least privilege and tenant isolation:** authorization is checked server-side at every object boundary.
- **Idempotent and recoverable workflows:** retries must not duplicate mutations; jobs and changes must support cancellation and recovery.
- **Vendor adapters, stable internal contracts:** provider-specific APIs stay behind interfaces.
- **Modular monolith before microservices:** split only components that require an independent security, scaling, or lifecycle boundary.
- **Android-aware UX:** desktop remains the full engineering surface; Android web clients must support meaningful browsing, editing, review, and approvals without assuming a hardware keyboard.

## 3. Holistic target architecture

### 3.1 Logical system

```text
Browser / Android Client
  ├── Workbench UI: Explorer, CodeMirror, Tabs, Search, Diagnostics
  ├── AI Panel: Chat, Context Sources, Plan, Patch Review
  ├── Run Center: Tasks, Logs, Tests, Builds, Artifacts
  └── Git/Project Views
             │ HTTPS / authenticated event stream
             ▼
Application Control Plane (modular monolith)
  ├── Identity & Session Adapter
  ├── Authorization / Tenant Policy
  ├── Project & Workspace Domain
  ├── File & Revision Domain
  ├── AI Gateway & Provider Registry
  ├── Context Retrieval Domain
  ├── Patch & Approval Domain
  ├── Task / Agent Orchestration Domain
  ├── Build / Test / Artifact Domain
  └── Audit & Usage Domain
       │                 │                    │
       ▼                 ▼                    ▼
PostgreSQL         Object Storage        Durable Job Queue
(metadata,         (content-addressed    (outbox-driven tasks,
authorization,     file blobs, snapshots, retries, cancellation,
revisions, audit)  artifacts, logs)      event delivery)
       │                 │                    │
       └─────────────────┴────────────────────┘
                         │
                 Isolated Worker Control Plane
                    ├── Indexing Worker
                    ├── AI/Agent Worker
                    ├── Build/Test Worker
                    └── Artifact Publisher
                              │
                              ▼
                    Ephemeral Execution Sandbox
                    ├── per-job isolation
                    ├── non-root / quotas
                    ├── no production secrets
                    └── default-deny network egress
                              │
                              ▼
                    Artifact & Preview Gateway
                              │
                              ▼
                    Git Provider Adapter / CI
```

### 3.2 Deployment shape

Start with:
- One web application/control-plane deployment.
- One separately deployed worker service with queue consumers.
- A managed relational database.
- Object storage for immutable content and artifacts.
- A durable queue/outbox mechanism.
- A separately managed sandbox execution service.
- A preview gateway isolated from the application origin.

Do not begin with many independently deployed microservices. The domain modules should have explicit interfaces and ownership, while sharing the same application deployment until real throughput or isolation requirements justify a split. The worker and sandbox are separate from the outset because untrusted execution requires a hard security boundary.

### 3.3 Component responsibilities

| Component | Owns | Must not do |
|---|---|---|
| Web client | Editor UX, local interaction state, review display | Authorize access, hold provider secrets, execute untrusted code |
| API/control plane | Authentication, authorization, domain transactions, policy enforcement | Run user repository code or model shell output |
| PostgreSQL | Relational metadata, ownership, revision pointers, job states, audit metadata | Store large binary artifacts as unbounded rows |
| Object storage | Immutable file blobs, revision manifests, artifacts | Decide user authorization without API checks |
| Queue/outbox | Durable asynchronous work and event delivery | Become the source of truth for project content |
| AI gateway | Provider policy, model routing, quota, streaming, redaction | Apply patches directly or bypass approval |
| Context engine | Permission-filtered, revision-pinned retrieval | Treat repository instructions as trusted system policy |
| Agent orchestrator | State machine, allowed tools, run budget, cancellation | Grant the model unrestricted shell/network access |
| Patch service | Validate, compare, approve, atomically apply, audit | Apply against a changed base revision silently |
| Sandbox | Run one bounded task in isolation | Access host filesystem, production credentials, sibling workspaces |
| Preview gateway | Serve immutable output using scoped expiring access | Expose arbitrary workspace paths or a shared privileged origin |
| Git adapter | Import/export, branch/commit/PR synchronization | Override the internal revision history without reconciliation |

## 4. Domain architecture

### 4.1 Identity, tenancy, and authorization

Required roles: platform operator, organization owner/admin, project owner, project editor, project viewer, and service worker identity. The initial single-user pilot may expose fewer UI roles, but the backend authorization model must not rely on hiding UI controls.

Requirements:
- Identity provider integration and secure server-validated sessions.
- Project membership and workspace-level access checks.
- Object-level authorization for files, revisions, tasks, patches, artifacts, previews, and audit records.
- Session expiry, revocation, secure cookie configuration, CSRF protection where applicable.
- Service-to-service identities separate from human identities.
- Database row-level security where supported, with API authorization as an additional control.
- Cross-user and cross-project denial tests for every resource class.

### 4.2 Project, workspace, and file model

A project is the security and ownership boundary. A workspace is a mutable working context belonging to one project. A file is addressed by a canonical relative path and has a content digest, size, MIME/type classification, and storage reference.

Server path policy must:
- Normalize paths once using a canonical implementation.
- Reject absolute paths, traversal, encoded traversal, control characters, reserved paths, unsupported segments, oversized paths, and ambiguous Unicode/path forms.
- Resolve symlinks safely at the storage/runtime boundary; lexical validation alone is insufficient.
- Enforce file, total workspace, file-count, and upload quotas.
- Reject stale write attempts with a version conflict.
- Never trust a client-side path guard as an authorization or filesystem boundary.

### 4.3 Revision and source-of-truth decision

**Recommended starting model:** relational metadata plus immutable content-addressed blobs and immutable revision manifests. Each revision manifest maps normalized paths to blob digests and records parent lineage, actor, timestamp, and provenance. The workspace head is a mutable pointer to an immutable revision.

Git is integrated as an import/export/synchronization adapter. A Git commit may be mapped to a REVORA revision, but a mutable Git branch pointer must not replace the internal revision/audit model.

This choice must be recorded in a dedicated ADR before migrations are written. Required behavior:
- Save a revision only after all referenced blobs are durably written and verified.
- Use a transaction to publish the revision and advance the workspace head.
- Require `expected_head_revision` for mutations; return HTTP 409 on a stale base.
- Keep parent lineage and content digests immutable.
- Support recovery checkpoints for dirty browser buffers.
- Make rollback a new revision referencing earlier content, not destructive history rewriting.
- Define retention and garbage-collection behavior before deleting blobs.

### 4.4 AI gateway and model governance

The AI gateway is a server-side provider abstraction. It owns:
- Provider/model registry and capability metadata.
- Server-only credentials and secret rotation.
- Model routing by task, cost, context window, latency, and policy.
- Per-user/project/provider budgets and rate limits.
- Request timeout, cancellation, retry, and streaming semantics.
- Prompt/version metadata and provider trace correlation.
- Secret and personal-data redaction.
- Approved data-sharing and retention policy.
- Structured output validation.

Provider adapters are replaceable. Do not couple workspace, patch, or task domain logic directly to any one model SDK. Never expose provider API keys through browser bundles, NEXT_PUBLIC variables, logs, prompts, source control, or sandbox environment variables.

### 4.5 Repository context and code intelligence

Index jobs must be revision-pinned and permission-filtered. The context engine should combine:
- Path/tree metadata and file type detection.
- Language-aware parsing/AST/symbol extraction where supported.
- Exact and lexical search.
- Semantic retrieval only where embeddings and evaluation justify it.
- Import/dependency relationships.
- Relevant test/config/build files.
- Context provenance (revision, path, digest, line/range, retrieval method).

The first release should prioritize reliable exact search, symbol-aware retrieval for supported languages, and provenance. Do not claim semantic retrieval quality without a labeled test set. Exclude secrets, generated/vendor folders, binaries, oversized files, and policy-denied paths.

Repository content, comments, README instructions, logs, issue text, and retrieved documents are untrusted data. They cannot override system policy, developer policy, access control, or tool allowlists.

### 4.6 Patch and approval lifecycle

Required state machine:

```text
DRAFT → VALIDATING → READY_FOR_REVIEW → APPROVED
                         │                  │
                         ▼                  ▼
                      REJECTED            APPLYING
                                            │
                                    ┌───────┴────────┐
                                    ▼                ▼
                                 APPLIED           CONFLICT
                                    │
                                    ▼
                               VERIFIED
```

A patch must bind to:
- Project/workspace ID and base revision.
- Per-file path and diff.
- Model/provider and prompt version where AI-generated.
- Context provenance and task/run identifier.
- Validation results and risk summary.
- Approval actor, scope, target digest, expiry, and decision.

Before applying, verify authorization and that the workspace head still equals the patch base. If not, reject with conflict and require rebase/review. Apply atomically, write a new immutable revision, and append an audit event. A UI-only approval button is not sufficient; approval is a server-side state transition bound to a precise action and digest.

### 4.7 Tasks, agents, and orchestration

Represent agent work as durable tasks with explicit state, timeout, budget, cancellation token, tool policy, and event history. The planner decomposes a user request into typed tasks. Agents use narrow tools, not raw unrestricted shell commands.

Recommended initial roles:
- Planner: task decomposition and acceptance criteria.
- Repository analyst: read-only repository inspection.
- Coding agent: proposes patches only.
- Test agent: runs approved tests in sandbox and reports evidence.
- Reviewer/security agent: reviews diffs and test/security outcomes.

Use one orchestrator state machine and shared typed task contracts. Agent-to-agent messages are data, not privileged instructions. Prevent infinite loops with maximum iterations, time budgets, tool-call budgets, and explicit escalation. An agent must not approve its own high-impact patch or deployment.

### 4.8 Execution, builds, tests, and preview

All code execution must be remote and ephemeral:
- One isolated environment per job or tightly scoped job session.
- Non-root identity, read-only base image, bounded scratch volume.
- No host Docker socket, host paths, cloud metadata endpoint, production DB credentials, or provider credentials.
- Default-deny outbound network, with explicitly governed package mirrors if needed.
- CPU, memory, PID, disk, wall-clock, log, and artifact quotas.
- Dropped Linux capabilities and seccomp/AppArmor or equivalent controls.
- Destroy environment after job; persist only vetted logs and artifacts.
- Build/test references a pinned revision, toolchain digest, and configuration digest.
- Artifacts are immutable and content-addressed.
- Previews use isolated origin, scoped expiring access, and security headers.

Terminal, build scripts, dependency installation, preview, and agent tools are all untrusted-code execution surfaces. They must share a threat model and be tested as such.

## 5. Data and API contracts

### 5.1 Core entities

| Entity | Key fields / invariants |
|---|---|
| User / Identity | External identity subject, status, timestamps |
| Organization | Owner, policy, plan/quotas |
| Membership | Organization/project, role, status |
| Project | Organization/owner boundary, slug, status |
| Workspace | Project, head revision, lifecycle, quota |
| FileBlob | Digest, byte size, object key, verified state |
| Revision | Workspace, parent revision, manifest digest, author, provenance |
| EditorCheckpoint | User/session, workspace, base revision, buffer digest |
| Task | Requester, type, state, idempotency key, budget, cancellation |
| AgentRun | Task, model/prompt versions, tool trace, result |
| Patch | Base revision, file diffs, digest, validation state |
| Approval | Actor, target/action digest, expiry, decision, reason |
| Build / TestRun | Revision, toolchain/config digest, status, results |
| Artifact | Immutable digest, media type, size, storage reference, retention |
| Preview | Artifact digest, audience, expiry, revocation |
| AuditEvent | Actor, action, target, digest, timestamp, correlation ID |

All entities must have stable IDs, ownership scope, timestamps, and explicit lifecycle semantics. Sensitive payloads must not be copied into audit logs.

### 5.2 API contract

Prefer versioned REST plus authenticated server-sent events (or another documented event transport) for long-running task updates. Publish OpenAPI and generated client types before implementing many endpoints.

Logical API groups:
- `/v1/projects`
- `/v1/workspaces`
- `/v1/files`
- `/v1/revisions`
- `/v1/search`
- `/v1/ai`
- `/v1/tasks`
- `/v1/patches`
- `/v1/approvals`
- `/v1/builds`
- `/v1/test-runs`
- `/v1/artifacts`
- `/v1/previews`
- `/v1/audit-events`

Cross-cutting rules:
- Authenticated endpoints by default.
- Object-level authorization at every resource lookup.
- Runtime schema validation and bounded request/response sizes.
- Consistent error envelope and API versioning.
- Idempotency keys for job creation, patch apply, and external side-effect operations.
- ETag or base revision for writes.
- Rate limits and usage quotas.
- Correlation IDs end-to-end.
- Transactional outbox for DB mutation plus asynchronous job publication.
- Event replay/reconnect behavior documented; clients must tolerate duplicate events.

### 5.3 Event contracts

Events should be versioned, attributable, and idempotently consumable. Examples: `workspace.revision.created`, `patch.validation.completed`, `patch.approval.recorded`, `task.started`, `task.progress`, `task.cancelled`, `build.completed`, `artifact.published`. Do not put secrets or full source files into event payloads; use opaque IDs and digest references.

## 6. Security, privacy, and governance

Security is a platform capability, not a later checklist. Required controls:
- Threat model updated for every new trust boundary.
- Authentication, project authorization, object isolation, and service identity.
- Server-side path validation plus symlink-safe storage operations.
- Session protection, CSRF/XSS defenses, CSP, secure headers, CORS policy.
- Server-side secret manager and rotation.
- Secret redaction from AI context, logs, traces, and artifacts.
- Prompt-injection defenses and strict tool allowlists.
- Sandbox isolation and egress policy.
- Dependency pinning, lockfile, vulnerability/license scanning, dependency update review.
- Append-only or tamper-evident audit events.
- Data retention, deletion, export, and provider-sharing policy.
- Security incident response and credential revocation process.

No security claim should be inferred from disabled UI controls. The server and worker must enforce the same policy independently.

## 7. Reliability, operations, and quality attributes

Recommended initial production objectives (to be approved against budget and service ownership):
- Application API availability: 99.5% monthly pilot target; increase only with on-call/operational coverage.
- Core non-AI API latency: p95 under 500 ms under agreed load.
- Durable revision save: acknowledged only after durable blob and metadata commit.
- Initial recovery objectives: RPO ≤ 15 minutes and RTO ≤ 4 hours, subject to provider capabilities and restore drills.
- AI/worker operations: visible state, explicit timeout, cancellation, bounded retries, per-tenant quotas.
- No silent data loss: crash/reconnect and stale-update scenarios covered by automated tests.
- Monitoring: structured redacted logs, metrics, traces, queue age/depth, error budgets, saturation, provider spend, and sandbox lifecycle.

Every SLO needs a measurement definition, owner, alert threshold, and response runbook. These proposed targets are not current measurements.

## 8. UX and client quality

Keep the existing CodeMirror surface but separate it from workspace state and persistence. Upgrade the editor to support:
- Real file tree and project navigation.
- Dirty buffers, autosave/checkpoint recovery, conflict presentation.
- Language extensions, diagnostics, formatting, search/replace, and keyboard commands.
- Multi-file diff/patch review.
- Task and agent progress, cancellation, and logs.
- Responsive desktop/tablet/Android layouts, touch targets, virtual keyboard behavior, focus management, accessible controls, and loading/error/offline states.

Desktop should support full IDE workflows. Android must have a carefully scoped workflow: navigate files, edit, inspect diff, approve/reject, monitor jobs. Avoid promising terminal-grade productivity on mobile before touch/keyboard tests pass.

## 9. Engineering delivery and repository governance

Before production work expands:
1. Establish the authoritative integration branch and release branch policy.
2. Decide the correct dependency baseline and align package manifest, lockfile, CI, Docker, local instructions, and ADR.
3. Require a committed lockfile and use `npm ci`; do not use unpinned `npm install` for CI/release.
4. Align Node version across local development, CI, Docker build, and runtime.
5. Add lint, type-check, unit, integration, E2E, accessibility, security, and container build jobs.
6. Pin third-party GitHub Actions to immutable commit SHAs in the hardened release pipeline.
7. Add branch protection/rulesets, required reviews/checks, and protected deployment environments.
8. Build once, promote the same immutable artifact; do not rebuild from a moving branch.
9. Require migration review, staging smoke tests, backup/restore proof, and rollback test.
10. Keep deployment and production secret access disabled until explicit environment approval.

The current repository reports all four branches unprotected. The current `main` branch contains only README, while the foundation implementation lives on a feature branch and PR #3 is draft. No promotion to `main` should occur until the repository topology is deliberately reconciled.

## 10. Architecture decisions still requiring explicit records

Create and review separate ADRs for:
- ADR-0002: authoritative branch and promotion topology.
- ADR-0003: workspace source of truth and revision storage.
- ADR-0004: Supabase/identity/database/storage integration boundary.
- ADR-0005: queue, worker, outbox, and event transport.
- ADR-0006: AI provider policy, data retention, and model routing.
- ADR-0007: sandbox technology, isolation profile, and network egress.
- ADR-0008: Git import/export and conflict semantics.
- ADR-0009: observability, SLO, backup, and recovery objectives.
- ADR-0010: mobile support matrix and accessibility bar.

Each ADR must include alternatives, trade-offs, migration impact, security impact, cost impact, rollback strategy, decision owner, and status. A technology named as a target in an earlier ADR is not evidence that it is connected or operating.

## 11. Definition of production-ready

REVORA IDE may be called production-ready only when:
- A protected, reviewed release SHA is the source of the deployed artifact.
- Clean dependency installation and reproducible build pass from that SHA.
- Authentication, authorization, tenant isolation, and session controls are tested.
- Workspace persistence, revisions, conflicts, checkpoint recovery, and restore pass.
- AI requests are governed, redacted, quota-limited, cancellable, and traceable.
- AI patches are schema-validated, revision-pinned, approved, atomic, and reversible.
- Runtime, build, and preview systems pass isolation and egress tests.
- E2E, security, accessibility, responsive, load, and regression tests meet agreed thresholds.
- Backup/restore and rollback drills have timestamped evidence.
- Monitoring, alerting, incident response, support owner, and operational runbooks exist.
- Every critical gate has a PASS result and evidence URL/commit/artifact reference.

A green build, successful unit tests, a working UI, or a 200 health endpoint alone is insufficient.

---

## 12. Baseline finding summary

| Area | Current evidence | Required direction |
|---|---|---|
| Editor UI | Implemented foundation preview | Keep and modularize |
| Workspace | Browser localStorage only | Durable server workspace and recovery |
| Branch/release governance | Main is README-only; feature branch holds code; PR #3 is draft; branches unprotected | Establish guarded release topology |
| Dependencies | Upgrade branch aligns Node 26.13.0, Next.js 16.4.3 and React 19.3.1; lockfile is still absent and CI still uses npm install | Complete lockfile, npm ci, scanning, and protected branch policy |
| Backend/API | Health/readiness only | Versioned domain API and auth middleware |
| Identity/authorization | Not implemented | Identity + tenant/object-level policy |
| Database/storage | Not implemented | Metadata DB + immutable blob storage |
| Revision/patch | Not implemented | Immutable revision + approval-bound patch lifecycle |
| AI/context/agents | Not implemented | Gateway + provenance retrieval + bounded orchestration |
| Execution/build/preview | Not implemented | Isolated workers/sandbox and immutable artifacts |
| Security | Threat model documented; controls pending | Implement and test every boundary |
| Operations | Runbook/readiness template only | Observability, SLOs, recovery and staging evidence |

**Final status at this baseline: BLOCKED — foundation preview, not production-ready.**

### Verified implementation progress — 2026-11-01

On `feat/holistic-system-upgrade-v1`, the toolchain was aligned with ADR-0001 (Node.js 26.13.0, Next.js 16.4.3, React/React DOM 19.3.1), CI action versions were pinned to immutable SHAs, and a Docker image build was added to CI. Push run [41240390138](https://github.com/StrategyG/REVORA_IDE/actions/runs/41240390138) and PR run [41240394347](https://github.com/StrategyG/REVORA_IDE/actions/runs/41240394347) both passed at commit `0f0473dadff40a5367b4cd3eb0051bbacbfddb57`.

This progress does not close G0: a generated and committed package lockfile, `npm ci`, branch protection, security scanning, and full release governance remain open. All product platform services listed above remain unimplemented.
