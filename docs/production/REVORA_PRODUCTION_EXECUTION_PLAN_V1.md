# REVORA IDE — Holistic Upgrade Execution & Production Readiness Plan

**Version:** 1.0  
**Date:** 2026-11-01  
**Status:** Execution control document; all gates begin BLOCKED or NOT VERIFIED unless evidence is linked  
**Implementation branch:** `feat/holistic-system-upgrade-v1`  
**Architecture baseline:** `docs/architecture/REVORA_HOLISTIC_SYSTEM_BLUEPRINT_V1.md`

## 1. Purpose

This plan converts the holistic architecture into an evidence-driven delivery sequence. It defines what to repair, what to build, what depends on what, how to verify each capability, and what prevents production promotion.

A work item is not complete because code exists. It is complete only when:
1. The implementation is committed to the intended branch.
2. Tests exercise expected and adverse behavior.
3. The relevant CI checks pass at the exact commit.
4. Security, data integrity, and operational consequences are reviewed.
5. Evidence is recorded in this document or a linked release record.

## 2. Status vocabulary

| Status | Meaning |
|---|---|
| PASS | Implemented and verified with reproducible evidence at the candidate SHA |
| FAIL | A verification was run and failed |
| BLOCKED | A required dependency, control, decision, or implementation is absent |
| NOT RUN | A defined test has not been executed |
| NOT VERIFIED | A claim/control has no sufficient evidence |
| PARTIAL | Some bounded capability exists, but does not meet the complete gate |

Do not convert BLOCKED or NOT VERIFIED into PASS based on documentation, a green unrelated CI check, or a UI control.

## 3. Current baseline and release blockers

| Area | Observed baseline | Status | Blocking consequence |
|---|---|---|---|
| Default branch | `main` contains only `README.md` at inspected SHA `b309733779d9bfc2133e9bdacca5899699a9b84e` | BLOCKED | No mature release baseline |
| Implementation branch | Editor foundation exists on `feat/production-foundation-v1` at `aba136ee93e67ebfd61f02dc79d071c7e37925c6` | PARTIAL | Feature branch not promoted |
| PR topology | PR #3 is draft and targets `docs/stage0-repository-audit-v42` | BLOCKED | Promotion chain needs explicit review |
| Branch controls | GitHub listed all four existing branches as unprotected | BLOCKED | No enforced review/check policy |
| Runtime versions | `.nvmrc`, package engine, CI, and Docker now target Node 26.13.0 on the upgrade branch | PARTIAL | Candidate CI passed; lockfile and release-grade installation remain open |
| Framework versions | Upgrade branch now pins Next.js 16.4.3 and React/React DOM 19.3.1 to match ADR-0001 | PARTIAL | Upgrade passed CI; clean-install/lockfile and staging checks remain open |
| Dependency graph | No committed `package-lock.json`; CI uses temporary `npm install` and has not moved to `npm ci` | BLOCKED | Transitive dependency resolution is not reproducible |
| Editor/workspace | CodeMirror editor and browser-local draft storage | PARTIAL | Not a durable multi-session workspace |
| API/backend | Liveness and deliberately blocked readiness endpoints only | BLOCKED | No application domain API |
| Identity/authorization | No implementation | BLOCKED | Cannot safely expose user/project resources |
| Database/storage | No schema, migrations, or durable file persistence | BLOCKED | No reliable source of workspace state |
| Revision/patch lifecycle | No immutable revision or server patch approval service | BLOCKED | AI changes cannot be safely applied |
| AI/context/agents | No provider gateway, retrieval, or agent runtime | BLOCKED | AI assistant is a disabled UI placeholder |
| Execution | No terminal/build/test sandbox or preview gateway | BLOCKED | Untrusted code execution must remain disabled |
| Security | Threat model exists; most controls are pending | PARTIAL | Risks are identified but not mitigated/verified |
| Quality | Basic Node tests for path policy/readiness; no end-to-end product suite | PARTIAL | Product behavior is not adequately covered |
| Operations | Runbook/readiness templates exist; no verified deployment, monitoring, or restore drill | BLOCKED | No production operating evidence |

The branch baseline is intentionally retained for auditability. The feature branch and default branch must not be merged or force-updated merely to make the repository appear complete.

## 4. Dependency graph

```text
G0 Repository + toolchain baseline
             │
             ▼
G1 Identity + authorization + database foundation
             │
             ▼
G2 Durable projects/workspaces/files/revisions
             │
             ├─────────────────────────────┐
             ▼                             ▼
G3 AI gateway + context engine        G7 UX/recovery/accessibility
             │                             │
             ▼                             │
G4 Patch proposal + approval + apply ◄─────┘
             │
             ▼
G5 Isolated runtime + job control plane
             │
             ▼
G6 Build/test/artifact/preview/Git integration
             │
             ▼
G8 Security, reliability, recovery, performance
             │
             ▼
G9 Staging, release approval, production promotion
```

No agent may run repository code before G5 has passed. AI patch application must not be enabled before G4 passes. Production promotion is blocked until G0–G9 have evidence.

## 5. Execution gates

### G0 — Source governance and reproducible toolchain

**Priority:** P0  
**Current status:** PARTIAL — runtime/framework alignment committed; lockfile and branch governance remain BLOCKED

Work:
- Decide and document the authoritative integration branch and the PR promotion chain.
- Review the foundation branch and its history; reconcile PR #3 base/target before merging anything.
- Enable branch protection/rulesets for the chosen protected branch: pull request review, required CI, block force push/deletion, and stale approval handling.
- Select one Node runtime and align local, CI, Docker build, and production runtime.
- Align package manifest with ADR; create and commit the lockfile.
- Replace CI/release `npm install` with `npm ci`.
- Add lint, type-check, unit, integration, build, container, dependency, license, and secret checks.
- Pin critical GitHub Actions to reviewed immutable commit SHAs in the hardened pipeline.
- Add a repository contribution guide and CODEOWNERS/review ownership if multiple contributors are expected.

Version baseline to validate before pinning:
- Node.js 26.13.0 entered Active LTS on 2026-10-28.
- The current architecture ADR already targets Next.js 16.4.3 and React 19.3.1.
- The package manifest must be updated only together with a generated lockfile and successful clean-install/build tests.

Acceptance:
- A clean runner installs exactly from the committed lockfile.
- CI, Docker build, and local instructions use the same compatible runtime.
- Build output and dependency tree are reproducible for the candidate commit.
- A required-check policy prevents direct unreviewed promotion.
- A candidate SHA can be traced to its PR and immutable artifact digest.

### G1 — Identity, database, and authorization foundation

**Priority:** P0  
**Current status:** BLOCKED  
**Dependencies:** G0, approved identity/database ADRs

Work:
- Implement identity provider integration and server-side session validation.
- Implement user, organization (if multi-tenant), membership, project, and role policies.
- Define service identities for workers.
- Add database schema and versioned migrations.
- Enforce object-level authorization at every API resource lookup.
- Configure row-level security where the selected database platform supports it.
- Add secure cookie/session expiry/revocation and CSRF protections as applicable.
- Define development/staging/production database separation.

Acceptance tests:
- Unauthenticated requests are denied.
- User A cannot read or mutate User B's projects, workspaces, revisions, tasks, patches, artifacts, or audit events.
- Role matrix is tested for owner/admin/editor/viewer.
- Revoked and expired sessions stop working.
- Direct API requests cannot bypass UI-level access restrictions.
- Migration from an empty database and upgrade from the previous schema both pass.

### G2 — Durable workspace, file and revision system

**Priority:** P0  
**Current status:** BLOCKED  
**Dependencies:** G1, data-source-of-truth ADR, object storage

Work:
- Implement project/workspace/file services.
- Add canonical server-side path validation and storage-safe resolution.
- Implement content-addressed blob storage and immutable revision manifests.
- Define a workspace head pointer and parent-revision lineage.
- Add optimistic concurrency using expected revision/ETag.
- Add browser recovery checkpoints and autosave state.
- Add workspace and file quotas, binary file policy, retention, and garbage collection.
- Implement export/import and revision restore.
- Keep browser local storage as a bounded offline/recovery cache only, not the authoritative store.

Acceptance tests:
- Save, reload, open on another session/device, and recover after simulated crash.
- Simultaneous stale writes produce conflict (HTTP 409) rather than lost update.
- Path traversal, encoded traversal, reserved paths, symlink escape, malformed paths, and quota bypass are rejected.
- Blob digest is verified before a revision is committed.
- Revision immutability and lineage cannot be overwritten by normal application requests.
- Restore creates a new revision and preserves audit lineage.
- Unauthorized cross-project file access is denied.

### G3 — AI gateway and repository context engine

**Priority:** P1  
**Current status:** BLOCKED  
**Dependencies:** G1, G2, provider governance and data-sharing ADRs

Work:
- Implement server-side provider adapter and model registry.
- Add capability metadata for streaming, structured output, tool calls, and context size.
- Add secret management, rotation, request redaction, quota, timeout, cancellation, and cost tracking.
- Implement revision-pinned repository indexing and permission-filtered retrieval.
- Implement exact/lexical search first; add AST/symbol retrieval for selected languages.
- Add semantic retrieval only after dataset and evaluation are available.
- Store provenance for every returned context item.
- Define a provider allowlist and source-code retention/data-sharing policy.
- Add prompt/version tracking and structured response schema.

Acceptance tests:
- Provider credentials never appear in browser bundle, logs, traces, prompts, or sandbox.
- Every retrieved source reference maps to a file/range/digest in the authorized base revision.
- Cross-project retrieval is impossible.
- Prompt injection in README, source comments, logs, and retrieved documents cannot expand tool permissions or override system policy.
- Timeouts, retries, cancellations, rate limits, and provider failures return controlled outcomes.
- Budget limits stop or constrain excessive model usage.
- Evaluation records retrieval relevance, provenance correctness, groundedness, and abstention performance.

### G4 — Patch proposal, validation, approval, and atomic apply

**Priority:** P1  
**Current status:** BLOCKED  
**Dependencies:** G2, G3

Work:
- Define a strict schema for patch proposals.
- Validate path, file size, diff syntax, base revision, and allowed file type.
- Render per-file diff and risk summary.
- Add approve/reject/request-changes states.
- Bind approval to the exact patch digest, target workspace, base revision, and action.
- Re-check permissions and base revision at apply time.
- Apply atomically and record an immutable new revision.
- Add rollback/recovery and complete audit trail.
- Reject stale patches; never silently rebase.

Acceptance tests:
- Invalid schemas, unsupported paths, malformed diffs, and oversized patches are rejected.
- Approval cannot be reused for a different patch digest or expired action.
- Agent/user cannot apply a patch without proper permission.
- Changed workspace head causes a conflict.
- A partially applied multi-file patch cannot leave an inconsistent workspace.
- Rollback preserves immutable history and audit evidence.
- Human approval is required for high-risk changes.

### G5 — Isolated sandbox and durable task workers

**Priority:** P0 for any execution feature  
**Current status:** BLOCKED; all execution remains disabled  
**Dependencies:** G0–G2, security/sandbox ADR, worker infrastructure

Work:
- Select a sandbox provider/technology using a threat-model comparison.
- Create an isolated environment per job with non-root user, read-only base, bounded writable volume, dropped capabilities, seccomp/AppArmor or equivalent.
- Block host mounts, Docker socket, cloud metadata access, production DB access, provider credentials, and sibling workspace access.
- Default-deny egress; provide controlled package mirror/proxy only where needed.
- Enforce CPU, memory, PID, disk, wall-clock, log, and artifact quotas.
- Add durable task state, cancellation, retry policy, idempotency, lease/heartbeat, and worker recovery.
- Destroy runtime after each job and persist only vetted outputs.
- Test sandbox isolation independently from application UI.

Acceptance tests:
- Escape attempts cannot access host or another workspace.
- Metadata endpoints and forbidden egress are unreachable.
- Secret canaries do not appear in runtime environment, output, or artifacts.
- CPU/memory/PID/disk/time quotas terminate runaway jobs.
- Cancellation reaches worker and runtime.
- Worker crash/restart does not duplicate patch application or corrupt job state.
- No production secrets are mounted into build/test environments.

### G6 — Build/test, artifacts, preview, and Git integration

**Priority:** P2  
**Current status:** BLOCKED  
**Dependencies:** G2, G5

Work:
- Implement build and test job contracts against pinned source revision and toolchain.
- Add logs, structured test results, artifact manifests, and digest verification.
- Store artifacts immutably with retention and access policies.
- Implement isolated preview gateway with scoped expiring tokens and origin isolation.
- Implement Git import/export, branch/commit/PR operations through least-privilege provider tokens.
- Handle Git conflicts through explicit user-visible reconciliation.
- Add CI status linking back to exact REVORA task/revision.

Acceptance tests:
- Re-running an identical build can be traced to revision/configuration/toolchain digests.
- A result is never attributed to a newer workspace revision than the one tested.
- Artifact mutation is detected by digest mismatch.
- Unauthorized/expired preview access is denied.
- Git token scope is least-privilege and secrets are never exposed to browser or sandbox.
- Conflict resolution does not silently overwrite remote or local changes.

### G7 — Editor UX, responsiveness, accessibility, and recovery

**Priority:** P1/P2  
**Current status:** PARTIAL for basic desktop shell; broader workflows BLOCKED  
**Dependencies:** G2, G4; integrate progressively

Work:
- Separate editor state from persistence and server APIs.
- Add dirty state, checkpoint recovery, conflict UI, loading/error/offline states.
- Add file tree, language mode selection, formatting, diagnostics, search/replace, and keyboard shortcuts.
- Add diff review and task/agent/run panels.
- Test desktop, tablet, Android portrait and landscape, and physical/virtual keyboards.
- Meet keyboard navigation, visible focus, screen-reader labeling, sufficient contrast, and touch target requirements.
- Avoid hiding important status solely in color or tiny status text.

Acceptance tests:
- A user can edit, navigate, and review diffs without data loss.
- Unsaved buffers and stale server versions are explicitly visible.
- Android workflows can browse, edit, review, approve/reject, and monitor jobs without clipped critical controls.
- Keyboard-only workflows and screen-reader smoke tests pass.
- E2E screenshots and interaction traces are stored for representative viewports.

### G8 — Security hardening, observability, resilience, and recovery

**Priority:** P0 before production  
**Current status:** BLOCKED/PARTIAL  
**Dependencies:** G1–G7

Work:
- Complete threat model and data-flow diagrams for all trust boundaries.
- Run dependency, secret, static, dynamic, API, authorization, and sandbox security tests.
- Implement structured redacted logs, metrics, traces, alerts, queue metrics, provider cost and runtime metrics.
- Define SLOs, error budgets, alert ownership, and incident procedures.
- Configure database and object storage backups.
- Run restore drills; document RPO/RTO and evidence.
- Define retention, deletion, export, and audit integrity policies.
- Load-test API, editor saves, task queue, and worker capacity.
- Define support ownership and operational escalation.

Acceptance tests:
- No unresolved critical/high security findings in agreed release scope.
- Logs and traces contain correlation IDs but no secrets or source content beyond the approved policy.
- Restore from backup completes within approved RTO and respects RPO.
- Alerts fire on error rate, latency, queue backlog, worker failures, storage pressure, and provider spend.
- Incident and rollback runbooks are exercised.
- Load tests demonstrate agreed capacity and graceful degradation.

### G9 — Staging, release, and production promotion

**Priority:** P0 release gate  
**Current status:** BLOCKED  
**Dependencies:** G0–G8 all PASS

Work:
- Freeze one candidate SHA.
- Produce SBOM, dependency/security report, license report, container digest, and release notes.
- Apply reviewed migrations in staging.
- Deploy the same immutable artifact that passed staging; do not rebuild from a moving branch.
- Run E2E, security, responsive, accessibility, smoke, backup/restore, and rollback tests.
- Require service owner and security reviewer approval.
- Use protected deployment environment and audited credentials.
- Canary/limited rollout, monitor SLOs, and roll back automatically or manually based on agreed criteria.

Acceptance:
- All mandatory gates have PASS evidence at the exact release SHA.
- No BLOCKED, FAIL, NOT RUN, or NOT VERIFIED security-critical gate remains.
- Rollback target and restore point are known and tested.
- Ownership/on-call path is active.
- Production readiness is approved by the responsible humans.

## 6. Quality and acceptance framework

| Quality dimension | Required measurement |
|---|---|
| Functional correctness | Unit, integration, and end-to-end tests mapped to user journeys |
| Security | Authentication, object authorization, tenant isolation, path/symlink, secret, prompt/tool injection, sandbox and egress tests |
| Data integrity | Revision immutability, concurrency conflicts, blob digest, crash recovery, backup/restore |
| AI quality | Human-labeled task benchmark, context provenance accuracy, patch correctness, groundedness, abstention |
| Reliability | Availability, p95 latency, queue age, error rate, cancellation and retry correctness |
| Performance | Editor responsiveness, API latency, save latency, indexing throughput, runtime resource usage |
| UX | Desktop/tablet/Android viewports, keyboard, touch, accessibility and recovery |
| Cost control | Provider/model spend per task, worker runtime, storage growth, per-user/project quotas |
| Operations | Monitoring, alert delivery, on-call ownership, incident and rollback drills |

AI quality thresholds should be set after a pilot benchmark with at least 30 human-labeled tasks, then expanded before broad release. Do not fabricate an agent success rate in the absence of measured results. For critical source citations/provenance, the system should target at least 0.95 correctness before enabling answer modes that claim exact code references; the measured dataset and calculation method must be recorded.

## 7. Release policy and feature flags

Feature flags should default OFF for:
- AI external-provider calls before provider policy is approved.
- Patch application before G4 passes.
- Terminal/exec/build/test before G5 passes.
- Preview exposure before G6 security gates pass.
- Autonomous agent loops before bounded orchestration and approval controls pass.
- Production deploy actions until G9 approval.

A flag is not a substitute for server-side authorization. Every sensitive endpoint must enforce policy regardless of UI or flag state.

## 8. Required evidence package per gate

Every completed gate must record:
- Gate ID and implementation PR/commit.
- Candidate SHA and changed-file list.
- CI run URL and named jobs.
- Test command, environment, and result.
- Security review and unresolved risk list.
- Migration/configuration impact.
- Rollback or recovery plan.
- Reviewer/owner and timestamp.

Use machine-readable status where possible; never use unverified screenshots or an undocumented “works on my machine” claim as the only evidence.

## 9. Immediate next actions

1. Review this architecture and execution plan as the authoritative target for the next implementation cycle.
2. Resolve branch topology: establish which of the existing draft PRs and audit branches are archival, active, or superseded. Keep `main` untouched until a reviewed migration plan exists.
3. Complete G0: branch governance, package alignment, lockfile, runtime alignment, and full CI gates.
4. Approve G1/G2 data and identity decisions before any production schema or secret configuration is written.
5. Implement workspace persistence and immutable revisions before adding AI write capability.
6. Implement AI proposal/review/apply flow before exposing autonomous changes.
7. Keep all terminal/build/agent execution disabled until G5 passes.
8. Complete staging/recovery/security evidence before production promotion.



## 11. Verified progress update — 2026-11-01

G0 has partial implementation on `feat/holistic-system-upgrade-v1`:

- `.nvmrc` pins Node.js 26.13.0.
- `package.json` requires Node.js `>=26.13.0 <27` and pins Next.js 16.4.3 plus React/React DOM 19.3.1, matching ADR-0001.
- CI selects Node.js 26.13.0, with concurrency cancellation and a 20-minute job timeout.
- GitHub Actions `checkout` and `setup-node` are pinned to immutable commit SHAs.
- CI verifies dependency installation, syntax, unit tests, Next.js build, and Docker production-image build.
- README accurately documents the implementation and release blockers.

Evidence at upgrade branch head `0f0473dadff40a5367b4cd3eb0051bbacbfddb57`:
- Push CI [41240390138](https://github.com/StrategyG/REVORA_IDE/actions/runs/41240390138) — SUCCESS, including the Docker production-image build.
- PR CI [41240394347](https://github.com/StrategyG/REVORA_IDE/actions/runs/41240394347) — SUCCESS.
- Earlier Next.js 16/React 19.3.1 alignment was validated at commit `d9e4c9655ed996c7b236d31edc17c8497c84f658` by push run 41240262430 and PR run 41240267731.
- Draft PR [#4](https://github.com/StrategyG/REVORA_IDE/pull/4) targets `feat/production-foundation-v1` and remains unmerged.

G0 is **PARTIAL, not PASS**:
- No committed `package-lock.json`; CI still uses `npm install`, not `npm ci`.
- Branch protection/rulesets and required review policies are not enabled.
- Dependency/license/secret scanning, accessibility, E2E, security, load, staging, backup/restore, and rollback gates are not yet configured or proven.
- CI success verifies only the jobs currently present in the workflow. A successful image build is not a sandbox isolation test or production deployment test.

## 12. Current release decision

**BLOCKED — foundation preview only.**

The completed work establishes an architecture/upgrade plan, aligns the toolchain on a review branch, pins CI actions, and validates a Next.js/Docker build. It does not implement identity, authorization, durable workspace data, immutable revisions, AI, patch approval, sandbox execution, production operations, or a deployment. G1–G9 remain open.


## 14. Domain-layer implementation update — 2026-11-01

Implemented on `feat/holistic-system-upgrade-v1`:
- Deterministic workspace manifest generation and verification with per-file SHA-256, byte quotas, stable ordering, and revision digest.
- Stale revision conflict contract.
- Bounded patch proposal validation (schema, operations, path policy, file/aggregate byte limits).
- Patch digest and expiry-bound approval-record verification.
- In-memory candidate patch application with create/update/delete preconditions and no mutation of the input object.
- Prototype-pollution path segment rejection and regression tests.

These modules are deliberately not exposed as an API and do not claim to provide authentication, authorization, persistence, transactional database commit, audit logging, or durable rollback. They are tested domain-layer building blocks for G1/G2/G4; the corresponding production gates remain PARTIAL/BLOCKED.

The current CI workflow executes all `tests/*.test.mjs` and syntax-checks the new domain modules. At commit `73efb3ef1ccc5a0ed563dfdad0933a6f7d991de8`, push run [41241129461](https://github.com/StrategyG/REVORA_IDE/actions/runs/41241129461) and PR run [41241135044](https://github.com/StrategyG/REVORA_IDE/actions/runs/41241135044) both passed syntax checks, unit tests, Next.js build, and Docker image build. These runs do not close the lockfile, authorization, persistence, sandbox, or operations gates.
