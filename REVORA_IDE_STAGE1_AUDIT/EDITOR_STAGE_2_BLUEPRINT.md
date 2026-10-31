# REVORA IDE — Stage 2 Technical Blueprint

## Entry condition

Stage 1 is **BLOCKED** because the remote repository is empty. Stage 2 architecture decisions can be drafted, but implementation should not begin until the intended codebase is present or the user explicitly authorizes bootstrapping a new codebase in a separate stage.

## Stage 2 objectives

1. Confirm the product boundary and user roles.
2. Select language/framework/runtime and supported browsers/devices.
3. Choose source-of-truth model for workspace content (Git-backed working tree or blob/revision-native).
4. Define entity schema, revision semantics, authorization, file path policy, and concurrency behavior.
5. Define API contracts and event schemas.
6. Define AI gateway, context provenance, patch schema, review and application protocol.
7. Define isolated execution model and security threat model.
8. Define build/test/artifact/preview lifecycle.
9. Define hosting, database, storage, queue, secrets, observability, backup, and rollback topology.
10. Convert acceptance matrix into executable test plan and CI gates.

## Recommended baseline architecture

Use a modular monolith for project/workspace/file/revision/AI/task/approval APIs and a separate worker control plane for long-running tasks. Execute user and agent code only in isolated ephemeral sandboxes. Use relational metadata, immutable blob storage, durable queue, and an authenticated preview gateway. Avoid microservices unless independently deployable scaling or security boundaries justify them.

## Design work packages

### WP-2.1 — Product and trust boundaries
- Define single-user vs multi-tenant product model.
- Define organization/project/workspace roles and ownership.
- Define actions that require explicit human approval.
- Define external AI provider data-sharing policy.

### WP-2.2 — Stack and runtime decision
- Compare frontend framework, code editor library, backend framework, database, object storage, queue, runtime isolation, and hosting.
- Record versions, maintenance status, licenses, browser support, mobile limitations, and operational cost.
- Select lockfile and reproducible development environment strategy.

### WP-2.3 — Data and revision contracts
- Define schemas for Project, Workspace, Branch, Revision, File, EditorSession, Patch, Task, AgentRun, Build, TestRun, Artifact, Environment, Approval, AuditEvent.
- Define immutable revision manifest and content digest.
- Define atomic save/apply and stale-write conflict behavior.
- Define recovery checkpoints and backup retention.

### WP-2.4 — API and event contracts
- Publish OpenAPI or equivalent typed contracts.
- Define versioning, error envelope, idempotency, pagination, rate limits, and correlation IDs.
- Define task lifecycle events and reconnect/replay semantics.

### WP-2.5 — AI and patch protocol
- Define provider registry and model capability metadata.
- Define project context retrieval and provenance manifest.
- Define structured patch schema and validation rules.
- Define approval, apply, conflict, rollback, retry, cancellation, and audit behavior.

### WP-2.6 — Runtime security
- Threat-model terminal, build scripts, dependency installation, agent tools, previews, and model prompt injection.
- Select sandbox technology and enforce filesystem, process, network, CPU, memory, disk, and time limits.
- Define secret management and egress controls.
- Define security test and incident response plans.

### WP-2.7 — UX and responsive behavior
- Produce interaction flows and screen layouts for desktop, tablet, Android portrait, and landscape.
- Define keyboard/touch behavior, virtual keyboard strategy, focus management, autosave state, offline/reconnect, and recovery.

### WP-2.8 — Delivery and operations
- Define PR CI gates, staging workflow, production environment protections, artifact promotion, rollback, migrations strategy, observability, backup/restore, and SLOs.
- Production deployment must require explicit protected-environment approval until safe automation is proven.

## Stage 2 deliverables

- Architecture Decision Records (ADRs) for stack, data source of truth, revisions, runtime isolation, AI provider governance, and deployment.
- Component/service boundary diagram.
- Entity relationship diagram and migration plan.
- OpenAPI/type contract and event catalog.
- Threat model and sandbox policy.
- UX interaction spec and responsive acceptance plan.
- CI/CD and environment topology.
- Test strategy mapped to `EDITOR_ACCEPTANCE_MATRIX.md`.
- Dependency graph and phased implementation plan.

## Stage 2 exit criteria

- No unresolved P0 architecture ambiguity.
- Every entity and critical API has an owner and contract.
- Revision, concurrency, recovery, authorization, and patch application semantics are explicit.
- Untrusted code execution boundary is designed and threat-modeled.
- AI data-sharing and credential policies are approved.
- Acceptance tests are mapped to implementation tasks.
- The target source repository and active branch/commit are verified.
