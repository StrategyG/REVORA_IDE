# REVORA IDE — Architecture Audit

**Candidate:** `067502dae06bd63c1a5cdfbb1e59bb2695cf7ed2`  
**Date:** 2026-11-01  
**Decision:** MODIFY

## Observed architecture

The current candidate is a small Next.js modular application foundation. The UI is a browser-side CodeMirror workspace. Server routes expose liveness and deliberately blocked readiness. Domain helpers implement pure workspace and patch contracts. There is no deployed service topology or persistent application backend in the inspected source tree.

## Domain assessment

| Domain | Observed state | Classification |
|---|---|---|
| IDE presentation | Editor shell, tabs, explorer, search, browser drafts/export | PARTIALLY IMPLEMENTED |
| Identity/control plane | No authentication, sessions, RBAC, project membership or server authorization | NOT IMPLEMENTED |
| AI intelligence | Disabled assistant placeholder; no provider gateway, RAG or evaluation | PLACEHOLDER |
| Agent orchestration | No task planner, scheduler, agent identities or bounded tools | NOT IMPLEMENTED |
| Workspace data plane | In-memory manifest/patch contracts; browser localStorage only | PARTIALLY IMPLEMENTED |
| Execution plane | No terminal, isolated workers, build/test service or preview runtime | NOT IMPLEMENTED |
| Operations plane | Liveness endpoint and runbook/threat-model documents; no telemetry/backup evidence | PARTIALLY IMPLEMENTED |

## Architectural strengths

1. Modular-monolith direction is appropriate for the current scale; microservices are not justified yet.
2. The UI explicitly labels browser-local persistence and disables AI/execution features rather than presenting fake capabilities.
3. Readiness fails closed with HTTP 503.
4. Patch proposals are bounded and revision-pinned at the domain-contract level.
5. Workspace manifests use deterministic ordering and per-file SHA-256.
6. CI uses least-privilege `contents: read`, immutable action references, concurrency cancellation, and job timeout.
7. Architecture documentation distinguishes proposed services from implemented code.

## Architectural gaps

1. No identity or authorization boundary exists. No project-scoped resource can safely be exposed to multiple users.
2. No durable database/object-storage boundary exists; browser localStorage is not a shared or recoverable source of truth.
3. Patch/approval helpers are not composed into an API/service transaction. No authenticated approver, approval revocation/replay prevention, or durable event record exists.
4. AI and RAG planes are design-only. No provenance-preserving retrieval or evaluation dataset exists.
5. No worker control plane or isolation boundary exists. The Docker application container is not a sandbox for untrusted repository code.
6. There is no end-to-end workflow joining identity, project retrieval, AI proposal, approval, persistence, isolated execution, audit, and recovery.
7. Source governance is weak: `main` is bootstrap-only and reported unprotected; PRs form a nested promotion chain requiring explicit reconciliation.
8. Dependency resolution is not reproducible without a committed lockfile and `npm ci`.

## Target recommendation

Retain a modular monolith for identity, project/workspace APIs, patch/approval, AI gateway, audit, and task control until measured load or security lifecycle requires separation. Keep execution workers as an independently isolated boundary from the web application. Use durable PostgreSQL metadata, object storage for large immutable content/artifacts, and a queue/outbox only when asynchronous workload requires it.

## Architecture decision

Do not build AI agents or code execution ahead of identity, durable workspace state, patch approval, and isolation. The dependency order must be: G0 source/toolchain governance; G1 identity and authorization; G2 persistence; G3 patch/approval/audit; then AI/RAG and agent execution; then isolated runtime and complete IDE integration.
