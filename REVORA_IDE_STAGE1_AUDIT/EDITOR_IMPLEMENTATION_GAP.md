# REVORA IDE — Implementation Gap Matrix

**Baseline:** remote repository is empty; therefore all product capabilities are currently absent from this repository. Priorities are target delivery priorities, not severity ratings for existing code defects.

| ID | Feature | Current status | Missing requirement | Priority | Dependency |
|---|---|---|---|---|---|
| G-001 | Repository/app foundation | NOT_IMPLEMENTED | Runtime, manifests, lint/typecheck/test/build, docs, CI baseline | P0 | Stack decision |
| G-002 | Authentication | NOT_IMPLEMENTED | Identity, sessions, account lifecycle | P0 | Identity provider decision |
| G-003 | Project authorization | NOT_IMPLEMENTED | Tenant/project RBAC, object-level authorization | P0 | G-002 |
| G-004 | Project/workspace model | NOT_IMPLEMENTED | Ownership, lifecycle, branch/head revision | P0 | G-003, data model |
| G-005 | File persistence | NOT_IMPLEMENTED | Durable content store, atomic writes, quotas | P0 | G-004, storage |
| G-006 | File explorer/editor | NOT_IMPLEMENTED | Real tree, editor model, multi-tab dirty state | P0 | G-005 |
| G-007 | Revision consistency | NOT_IMPLEMENTED | Immutable snapshots, ancestry, optimistic concurrency, recovery | P0 | G-005 |
| G-008 | Credential/security baseline | NOT_IMPLEMENTED | Secret manager, audit, path safety, session protection | P0 | G-002, infrastructure |
| G-009 | AI provider gateway | NOT_IMPLEMENTED | Provider/model routing, budgets, credentials, streaming | P1 | G-008 |
| G-010 | Project context engine | NOT_IMPLEMENTED | Permission-filtered context at pinned revision | P1 | G-004, G-007, G-009 |
| G-011 | Multi-file generation | NOT_IMPLEMENTED | Schema-constrained file proposals and provenance | P1 | G-009, G-010 |
| G-012 | Patch/diff review | NOT_IMPLEMENTED | Base revision, path validation, diff rendering, conflict detection | P1 | G-007, G-011 |
| G-013 | Controlled patch apply | NOT_IMPLEMENTED | Approval, atomic apply, audit event, rollback/recovery | P1 | G-008, G-012 |
| G-014 | Isolated terminal/runtime | NOT_IMPLEMENTED | Ephemeral sandbox, quotas, network and secret isolation | P2 | G-008, runtime infra |
| G-015 | Build/test orchestration | NOT_IMPLEMENTED | Pinned revision, worker queue, logs, results | P2 | G-014, G-007 |
| G-016 | Artifact/preview | NOT_IMPLEMENTED | Immutable artifact, scoped preview gateway | P2 | G-015 |
| G-017 | Agent activity | NOT_IMPLEMENTED | Durable tasks, event stream, cancellation, retries | P2 | G-009, queue |
| G-018 | Human approval | NOT_IMPLEMENTED | Action/digest-bound approval, expiry, audit | P2 | G-008, G-013, G-015 |
| G-019 | Responsive mobile UX | NOT_IMPLEMENTED | Desktop/tablet/Android interaction and recovery | P2 | G-006, UX design |
| G-020 | Collaboration/debugging/multimodal | NOT_IMPLEMENTED | Advanced collaboration, debugger, asset pipeline | P3 | Stable P0–P2 platform |

## Priority rationale

- **P0:** without identity, persistence, revision integrity, and basic editing, the product cannot safely function as an engineering workspace.
- **P1:** AI must consume controlled project context and propose reviewable changes; it must not bypass revision or authorization controls.
- **P2:** execution, builds, preview, and approvals introduce higher-risk infrastructure and need the P0/P1 foundations.
- **P3:** advanced collaboration, debugging, and multimodal features should follow a reliable core rather than increase the initial attack and operational surface.
