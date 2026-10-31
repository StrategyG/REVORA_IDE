# REVORA IDE — Repository and Target Architecture Map

**Evidence snapshot:** 2026-10-31  
**Observed audit-branch commit:** `56fcb4ab87afc721584d3a8791ef906f47a820ac`  
**Observed tree SHA:** `f12a9e07115158c2dce9c61d214a2607a02a4c59`  
**Scope:** Remote repository structure and proposed target boundaries  
**Important:** Only the observed repository maps below are factual. The target architecture is a proposal and is not implemented in REVORA IDE.

## 1. Current repository map — observed

### 1.1 Default branch: `main`

At the pinned main commit, the complete recursive tree contains one file:

```text
StrategyG/REVORA_IDE/
└── README.md
```

Main commit: `b309733779d9bfc2133e9bdacca5899699a9b84e`.

### 1.2 Stage 0 audit branch: `docs/stage0-repository-audit-v42`

At the observed tree SHA, the complete recursive tree contains 22 Markdown blobs and reports `truncated=false`:

```text
StrategyG/REVORA_IDE/
├── README.md
├── REVORA_IDE_STAGE0_AUDIT/
│   ├── EDITOR_ACCEPTANCE_MATRIX.md
│   ├── EDITOR_ARCHITECTURE_MAP.md
│   ├── EDITOR_AUDIT.md
│   ├── EDITOR_IMPLEMENTATION_GAP.md
│   ├── README.md
│   ├── STAGE0_COMPLETION_REPORT.md
│   ├── STAGE0_EVIDENCE_LEDGER.md
│   └── STAGE0_EXECUTION_PROTOCOL.md
└── REVORA_IDE_STAGE1_AUDIT/
    ├── EDITOR_ACCEPTANCE_MATRIX.md
    ├── EDITOR_ACCEPTANCE_MATRIX_UPLOAD.md
    ├── EDITOR_AI_INTEGRATION_AUDIT.md
    ├── EDITOR_API_AUDIT.md
    ├── EDITOR_ARCHITECTURE_MAP.md
    ├── EDITOR_AUDIT.md
    ├── EDITOR_DATA_MODEL_AUDIT.md
    ├── EDITOR_IMPLEMENTATION_GAP.md
    ├── EDITOR_REPOSITORY_MAP.md
    ├── EDITOR_RESPONSIVE_AUDIT.md
    ├── EDITOR_SECURITY_AUDIT.md
    ├── EDITOR_STAGE_2_BLUEPRINT.md
    └── README.md
```

This tree consists of:
- one root README;
- eight files in the authoritative Stage 0 package;
- 13 earlier discovery/design documents retained as historical material.

No executable application source, package/runtime manifest, lockfile, schema/migration, test harness, workflow definition, infrastructure manifest, or deployment definition appears in this complete tree.

### 1.3 Earlier documentation branch: `docs/stage1-editor-audit`

This branch is the parent discovery/design baseline, not the current Stage 1 architecture workstream. It contains the earlier `REVORA_IDE_STAGE1_AUDIT/` Markdown material. The two acceptance-matrix files have identical content. Its relationship to main and the Stage 0 branch is recorded in the evidence ledger.

The directory name `REVORA_IDE_STAGE1_AUDIT/` must not be interpreted as proof that current Stage 1 data contracts or architecture have been accepted.

## 2. Current technical architecture — evidence-based status

There is no executable application architecture to map. At the observed repository tree, the following implementation components have no source evidence:

| Component | Current repository evidence |
|---|---|
| Browser application / editor UI | Not found |
| Routing and UI state management | Not found |
| Project/workspace service | Not found |
| File/content service | Not found |
| Revision service | Not found |
| Authentication and authorization | Not found |
| Database and migrations | Not found |
| Blob/object storage | Not found |
| AI provider gateway | Not found |
| Project-context retrieval | Not found |
| Patch validation/application | Not found |
| Durable queue/task manager | Not found |
| Terminal/sandbox runtime | Not found |
| Build/test orchestration | Not found |
| Artifact and preview gateway | Not found |
| Audit/observability | Not found |
| CI/CD and deployment | Not found |

No implementation framework, database product, cloud provider, or editor library can be inferred from the repository.

## 3. Proposed logical target architecture — not implemented

The proposed baseline is a modular application backend for transactional product operations, with separately isolated workers and an execution runtime. This avoids premature microservices while preserving a security boundary around untrusted code.

~~~mermaid
flowchart TB
  Client[Desktop / Tablet / Android Client] --> Shell[Editor Application Shell]
  Shell --> API[Versioned Application API]
  API --> IAM[Identity and Object Authorization]
  API --> Project[Project and Workspace Context]
  API --> Files[File and Revision Service]
  API --> Patch[Patch Review and Apply Service]
  API --> AI[Server-side AI Gateway and Context Builder]
  API --> Approval[Approval and Audit Control]
  Project --> DB[(Transactional Metadata Store)]
  Files --> Blob[(Durable Content / Blob Store)]
  Files --> DB
  Patch --> DB
  AI --> Providers[Approved Model Providers]
  API --> Queue[Durable Task Queue]
  Queue --> Worker[Task / Build / Agent Workers]
  Worker --> Sandbox[Ephemeral Isolated Runtime]
  Sandbox --> Artifact[(Immutable Build Artifacts)]
  Artifact --> Preview[Scoped Preview Gateway]
  Worker --> DB
  Approval --> DB
~~~

Every box in the diagram is a proposal, not a verified deployed component.

## 4. Component ownership boundaries

### Frontend

- Application shell and responsive layout.
- Project, workspace, branch, and revision context display.
- File explorer, tab manager, editor buffer, and dirty-state UI.
- Diff/patch review and user approval controls.
- AI assistant panel and context provenance display.
- Workbench tabs for problems, terminal, output, debug, tests, logs, and agent activity.
- Save, recovery, permission, and error indicators.

The frontend is not an authority for access control, revision integrity, patch authorization, or command execution.

### Transactional application backend

- Project and workspace ownership.
- Object-level authorization.
- File metadata and durable content references.
- Draft and revision state transitions.
- Branch/revision lineage and optimistic concurrency.
- Patch validation and approved application.
- Approval decisions and append-only audit records.
- Task submission and status retrieval.

The backend must validate every project/workspace/file/task/artifact reference. Client-supplied identifiers are not proof of authorization.

### AI gateway and context boundary

- Provider/model registry and capability metadata.
- Server-side credential access.
- Per-user/project quotas and provider policy.
- Revision-pinned, permission-filtered context selection.
- Structured output and patch schema validation.
- Streaming, cancellation, retry, and usage trace.
- Explicit distinction between explanation, suggestion, proposed patch, and verified result.

Model output is untrusted input. It must not independently authorize a write, command, network request, or external action.

### Worker and execution boundary

- Durable task dispatch, leases, retry, timeout, and cancellation.
- Build/test orchestration against an immutable source revision.
- Ephemeral runtime with resource limits and deny-by-default network access.
- No production secrets, host mounts, metadata-service access, or host Docker socket.
- Vetted logs and artifacts returned through controlled interfaces.

The application API process must never execute arbitrary user or agent commands directly on its host.

### Persistence and provenance

- Transactional metadata for projects, workspaces, branches, revisions, tasks, approvals, and artifacts.
- Durable file-content storage with checksum/digest verification.
- Immutable revision manifests and parent lineage.
- Artifact digests tied to source revision and build configuration.
- Audit records for sensitive actions and state transitions.

Whether the source of truth should be a Git-backed working tree or a database/blob-native revision store is a Stage 1 decision and remains NEEDS REVIEW.

## 5. Required identity chain

The central invariant should be enforced across every module:

**One Project → One Workspace → Versioned Files → Verified Build → Traceable Artifact.**

Every relevant operation must carry, validate, and record the identity chain:

- Project ID and authorized owner/tenant.
- Workspace ID.
- Branch ID where applicable.
- Base or immutable revision ID.
- File path and content digest for file operations.
- Patch ID and base revision for proposed changes.
- Build/test task ID and source revision.
- Artifact ID/digest and source revision for preview.
- Actor/agent identity and approval record for protected actions.

A file shown in the editor, sent to the AI model, included in a patch, used by a build, and opened in preview must resolve to the same project/workspace/revision lineage.

## 6. Suggested module decomposition

Do not create one microservice per module by default. A modular monolith can host transactional domains initially, while worker and sandbox processes remain separately isolated.

| Module | Primary responsibility | Trust level |
|---|---|---|
| Project Context Manager | Resolve project/workspace/branch/revision | Trusted backend |
| Workspace/File Service | Tree, file metadata, content read/write | Trusted backend |
| Revision Manager | Immutable history, ancestry, conflict checks | Trusted backend |
| Editor Session Manager | Tabs, user buffers, recovery checkpoints | Mixed; validate client data |
| Patch Integration Engine | Validate, review, apply, revert | Trusted backend |
| AI Assistant Interface | Provider requests and context assembly | External output untrusted |
| Terminal/Runtime Adapter | Control isolated jobs | High-risk boundary |
| Build/Test Service | Queue and execute pinned tasks | Worker boundary |
| Preview Gateway | Expose specific vetted artifacts | Isolated access boundary |
| Approval/Audit Service | Authorize and record sensitive operations | Trusted backend |

## 7. Decisions deliberately not made in Stage 0

These are Stage 1 architecture decisions, not facts discoverable from a documentation-only repository baseline:

- Frontend and backend frameworks and versions.
- Code editor library and license.
- Git-backed versus blob-native workspace source of truth.
- Database and object storage products.
- Identity provider and tenant model.
- Queue and worker technology.
- Runtime isolation technology and allowed network egress.
- AI provider/model routing and data-retention policy.
- Deployment platform, region, backup, and recovery objectives.
- Realtime event transport and collaborative-editing strategy.

Do not install dependencies or create application directories until the relevant decisions have been recorded and justified.

## 8. Audit procedure references

- [Stage 0 execution protocol](STAGE0_EXECUTION_PROTOCOL.md)
- [Stage 0 evidence ledger](STAGE0_EVIDENCE_LEDGER.md)
- [Repository audit](EDITOR_AUDIT.md)
- [Acceptance matrix](EDITOR_ACCEPTANCE_MATRIX.md)

The repository map is descriptive. The proposed target architecture is advisory and must be validated and approved during Stage 1.
