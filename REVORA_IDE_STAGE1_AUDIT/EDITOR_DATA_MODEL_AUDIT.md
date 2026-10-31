# REVORA IDE — Data Model Audit

## Current state

No database, schema, migration, ORM model, or persistence code is present in the inspected repository. All entities below are target requirements, not existing tables or models.

## Required entity inventory

| Entity | Current evidence | Proposed responsibility / relationships |
|---|---|---|
| Project | Not found | Tenant/owner boundary; parent of workspaces |
| Workspace | Not found | Project-scoped working context; references branch and active revision |
| Branch | Not found | Source-control pointer; must not replace immutable revision history |
| Revision | Not found | Immutable snapshot/commit; parent revision lineage |
| File | Not found | Workspace/path/content-hash metadata and blob reference |
| EditorSession | Not found | User/session state, open tabs, cursor and dirty-buffer metadata |
| Patch | Not found | Proposed change set pinned to base revision and author/agent |
| Task | Not found | Durable user/agent task lifecycle |
| AgentRun | Not found | Model/tool execution trace linked to task and revision |
| Build | Not found | Build attempt pinned to source revision and build configuration |
| TestRun | Not found | Test attempt pinned to build/revision and test suite version |
| Artifact | Not found | Immutable build/test/preview output with digest and retention policy |
| Environment | Not found | Named runtime/deployment target with scoped policy |
| Approval | Not found | Actor, scope, target digest, decision, expiry, and reason |
| AuditEvent | Not found | Append-only security and mutation event trail |

## Proposed integrity constraints

- Every workspace must reference exactly one authorized project.
- Every file must be scoped to one workspace and have a normalized, validated relative path.
- Every revision must be immutable, have a unique content digest, and preserve its parent lineage.
- Concurrent writes must include an expected version/base revision; stale writes return a conflict rather than silently overwriting.
- An AI patch must record the base revision, target files, generated diff, model/provider metadata, and validation state.
- Applying a patch must fail closed if the workspace head differs from the patch base unless an explicit rebase/reconciliation flow succeeds.
- Builds and test runs must reference immutable source revision/configuration; test results must point to the exact build or revision tested.
- Preview must reference an immutable artifact digest, not a mutable workspace directory.
- Approval must bind to an exact action and target digest, expire, and be invalidated if the target changes.
- User buffers and autosave checkpoints must support crash/reconnect recovery without silently discarding edits.

## Suggested file/revision storage approach

Use relational metadata plus immutable content-addressed blobs. A revision manifest maps normalized file paths to blob digests. Store parent revision, author, timestamp, message, and tool/agent provenance. Use database transactions to publish a revision only after all required blobs have been durably stored; orphan blobs can be garbage-collected later under a safe retention policy.

## Unresolved design decisions

- Git-backed working tree versus database/blob-native workspace as the source of truth.
- Branch synchronization and merge semantics.
- Large/binary file strategy and quotas.
- Retention, backup, legal hold, and deletion semantics.
- Collaborative editing model (single-writer optimistic concurrency initially vs CRDT/OT later).
- Whether EditorSession is durable server-side or mostly client-side with periodic recovery checkpoints.
