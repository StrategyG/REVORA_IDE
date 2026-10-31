# REVORA IDE — Institutional Gap Analysis

**Date:** 2026-11-01  
**Candidate:** `067502dae06bd63c1a5cdfbb1e59bb2695cf7ed2`  
**Priority:** P0 = release prerequisite; P1 = mandatory platform capability; P2 = later hardening/scale.

| Priority | Gap | Current evidence | Required outcome | Gate |
|---|---|---|---|---|
| P0 | Release/source governance | `main` bootstrap-only; nested open PR chain; `main` unprotected | Choose integration branch; reconcile PR bases; protect branch and require checks/review | G0 |
| P0 | Reproducible dependencies | No lockfile; CI uses `npm install` | Generate and commit lockfile; use `npm ci` locally, in CI and Docker; clean-build proof | G0 |
| P0 | Security CI | No SAST/secret/dependency/container scanning in inspected workflow | Add appropriate scanners, pin actions, define severity policy and evidence | G0/G10 |
| P0 | Authentication | No implementation | Secure identity/session lifecycle, expiry, revocation, MFA policy where required | G1 |
| P0 | Authorization | No server-side RBAC or project checks | Deny-by-default policy and cross-project/tenant tests | G1 |
| P0 | Durable workspace | Browser localStorage only | Database/object storage, migrations, quotas, integrity and restore | G2 |
| P0 | Approval governance | Pure digest/expiry helper only | Authenticated human identity, project/revision/patch/policy binding, replay/revocation and transactional apply | G3 |
| P0 | Audit/recovery | No durable audit log or rollback | Append-only attributable events, revision lineage, atomic rollback and restore drills | G3/G9 |
| P1 | AI gateway | Disabled UI placeholder | Server-side provider adapters, routing, quotas, timeout, retries, usage/cost governance | G4 |
| P1 | RAG/repository intelligence | No indexing/retrieval | Incremental parsing/indexing, access control, provenance, injection defenses, labeled evaluation | G5 |
| P1 | Agent governance | No runtime | Bounded agents, tool allowlists, budgets, cancellation, idempotency and human gates | G6 |
| P0 | Secure execution | No isolated worker/sandbox | Per-task isolation, quotas, filesystem and network restrictions, no host secrets | G7 |
| P1 | Complete IDE integration | UI preview only | Real API-backed file, AI, diff, approval, jobs, logs, artifacts and history | G8 |
| P1 | Reliability/observability | Liveness only; no operational evidence | Structured redacted logs, metrics, traces, alerts, SLOs, backups and restore | G9 |
| P1 | Security assurance | Threat model documentation only | Threat model review, SAST/DAST, API auth tests, container/dependency scans, remediation | G10 |
| P2 | Performance/scalability | No measured baseline | Load tests, bounded concurrency, backpressure, capacity/cost budgets | G11 |
| P0 | Release assurance | No staging/deploy/rollback proof | Environment separation, immutable artifacts, staged smoke tests, rollback and owner approval | G12 |

## Recommended delivery sequence

1. G0: settle source-of-truth branch topology, branch governance, lockfile, `npm ci`, deterministic CI, security scans.
2. G1: implement identity and server-side project authorization before any shared project data is exposed.
3. G2: implement durable project/workspace/file/revision storage with transactions and restore.
4. G3: integrate authenticated approval, patch application, audit and rollback.
5. G4/G5: build provider gateway and repository intelligence with provenance and evaluation.
6. G6: implement bounded agent workflow only after permissions and patch governance are enforced.
7. G7: build a separately isolated execution plane; do not use the web container as a sandbox.
8. G8/G9/G10: wire the UI end-to-end, add operations and complete security assurance.
9. G11/G12: measure capacity and complete staging/release/rollback validation.

## G0 immediate work

- Select authoritative integration branch and document PR promotion order.
- Enable branch protection/rulesets only after owner approval; do not mutate repository settings autonomously.
- Generate lockfile with the repository's actual Node/npm toolchain; do not hand-author or fabricate lockfile data.
- Switch CI and Docker installs to `npm ci` only after lockfile is validated.
- Add secret/dependency/SAST/container scans with explicit severity thresholds.
- Run clean install, syntax, tests, build and image build on the exact candidate SHA.
- Record test counts and scanner reports; missing logs/counts remain NOT VERIFIED.
