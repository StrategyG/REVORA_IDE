# REVORA IDE — Repository and Target Architecture Map

**Audit date:** 2026-10-31  
**Scope:** Remote repository structure and proposed target boundaries  
**Important:** The target architecture below is a recommendation. It is not an architecture currently implemented in REVORA_IDE.

## 1. Current repository map — observed

### Default branch: main

~~~text
StrategyG/REVORA_IDE/
└── README.md
~~~

The README describes a repository initialization/bootstrap commit and states that application implementation and deployment are not included.

### Existing documentation branch: docs/stage1-editor-audit

~~~text
StrategyG/REVORA_IDE/
├── README.md
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
~~~

The two acceptance-matrix files have identical content. All files in this directory are Markdown documentation. The remote branch comparison showed 13 commits ahead of main and 0 behind.

No frontend, backend, package manifest, lockfile, migration, test, workflow, infrastructure, or deployment file is present in the inspected remote branch trees.

## 2. Current technical architecture — evidence-based status

There is no executable system architecture to map. The following components have no implementation evidence:

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

## 3. Proposed logical target architecture

The recommended baseline is a modular application backend for transactional product operations, paired with separate workers and an isolated execution runtime. This avoids premature microservices while preserving the security boundary around untrusted code.

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

All boxes in this diagram are proposed components, not verified services.

## 4. Component ownership boundaries

### Frontend

- Application shell and responsive layout.
- Project, workspace, branch, and revision context display.
- File explorer, tab manager, editor buffer, and dirty-state UI.
- Diff/patch review and user approval controls.
- AI assistant panel and context provenance display.
- Workbench tabs for problems, terminal, output, debug, tests, logs, and agent activity.
- Save/recovery/permission/error indicators.

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

A file shown in the editor, a file sent to the AI model, a file included in a patch, a file used by a build, and a file opened in preview must resolve to the same project/workspace/revision lineage.

## 6. Suggested module decomposition

Do not create one microservice per module by default. A modular monolith can host the transactional domains initially, while worker and sandbox processes remain separately isolated.

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

These are Stage 1 architecture decisions, not facts discoverable from an empty application baseline:

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
