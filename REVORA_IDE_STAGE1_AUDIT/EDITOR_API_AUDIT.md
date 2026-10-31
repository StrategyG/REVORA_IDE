# REVORA IDE — API Audit

## Current state

No API routes, OpenAPI specification, GraphQL schema, RPC definitions, controllers, request/response models, middleware, or integration tests are available in the inspected repository. Therefore no existing endpoint can be listed or declared functional.

## Proposed API contract inventory (not implemented)

| Domain | Candidate contract | Required behavior |
|---|---|---|
| Projects | `GET/POST /v1/projects`, `GET/PATCH /v1/projects/{id}` | Enforce owner/tenant authorization |
| Workspaces | `GET/POST /v1/projects/{id}/workspaces` | Validate project membership and lifecycle |
| Files | `GET/PUT /v1/workspaces/{id}/files/{path}`, `DELETE` | Normalize path, validate scope, use ETag/base revision |
| Tree/search | `GET /v1/workspaces/{id}/tree`, `GET /search` | Respect workspace scope and ignore forbidden paths |
| Revisions | `GET/POST /v1/workspaces/{id}/revisions` | Immutable snapshots and parent lineage |
| Patches | `POST /v1/patches`, `GET /v1/patches/{id}`, `POST /review`, `POST /apply` | Validate base revision; human review for sensitive actions |
| AI | `POST /v1/ai/completions`, `POST /v1/ai/tasks` | Server-side credentials, quotas, streaming, cancellation |
| Tasks/agents | `GET/POST /v1/tasks`, `GET /v1/agent-runs/{id}` | Durable state, idempotency, correlated events |
| Runtime | `POST /v1/runtimes`, `POST /exec` | Sandbox-only execution, quotas, strict authorization |
| Build/test | `POST /v1/builds`, `POST /v1/test-runs` | Pin revision and toolchain; durable logs/results |
| Artifacts/preview | `GET /v1/artifacts/{id}`, `POST /v1/previews` | Immutable digest and scoped expiring preview URL |
| Approvals | `POST /v1/approvals`, `POST /v1/approvals/{id}/decision` | Bind approval to exact action and digest |
| Audit | `GET /v1/audit-events` | Permission-filtered, append-only event records |

These names are illustrative contracts for Stage 2, not claims of deployed endpoints. Stage 2 must settle REST versus another API style and publish OpenAPI/typed schemas.

## Required cross-cutting controls

- Authentication on all non-public endpoints.
- Object-level authorization at every project/workspace/file/task/artifact lookup; never trust client-supplied IDs alone.
- Schema validation, bounded payload sizes, normalized path handling, and safe error responses.
- API versioning and consistent error envelope.
- Idempotency keys for job creation, patch application, and deploy-like operations.
- Optimistic concurrency for file/revision writes.
- Transactions for metadata transitions; outbox pattern for queue publication where needed.
- Rate limits and quotas by user, project, model, and runtime.
- Correlation IDs across API, queue, worker, model, and runtime events.
- Audit records for approvals, file mutations, execution, credential access, and permission changes.
- Realtime events delivered through authenticated channels; reconnect and event replay semantics defined.
