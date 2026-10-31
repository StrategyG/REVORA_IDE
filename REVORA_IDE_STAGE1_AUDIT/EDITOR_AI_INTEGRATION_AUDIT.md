# REVORA IDE — AI Integration Audit

## Current state

No provider gateway, model registry, credential manager, agent framework, context retrieval, streaming handler, tool-calling implementation, prompt templates, or AI tests exist in the inspected repository. All AI capabilities are **NOT IMPLEMENTED in this repository** and their runtime behavior is **NOT VERIFIED**.

## Required target capabilities

| Capability | Current status | Stage 2/implementation requirement |
|---|---|---|
| Provider gateway | Not implemented | Single server-side abstraction for providers/models |
| Model registry | Not implemented | Provider/model metadata and allowed capabilities |
| Capability detection | Not implemented | Tool call, streaming, context size, structured output support |
| Credential management | Not implemented | Secret manager; no browser-side API keys |
| Structured output | Not implemented | Schema-validated task and patch payloads |
| Tool calling | Not implemented | Allowlisted, permission-scoped tool registry |
| Streaming | Not implemented | Cancellation and reconnect semantics |
| Code generation | Not implemented | Generate proposal files/diffs, not direct writes |
| Project context | Not implemented | Permission-filtered retrieval at pinned revision |
| Agent execution | Not implemented | Durable run state, limits, trace, cancellation, retry |
| Model fallback | Not implemented | Explicit compatibility and data-governance rules |

## Safe AI modification lifecycle

1. Resolve user, project, workspace, and authorization.
2. Pin context to a specific immutable base revision.
3. Retrieve only authorized, relevant files; label untrusted repository content as data, not instructions.
4. Send minimal context to an approved provider using server-side credentials.
5. Require structured output containing file paths, patch hunks, rationale, and validation plan.
6. Validate schema, path, size, file type, and patch applicability.
7. Run static validation in an isolated environment with no production credentials.
8. Display a per-file diff and risk summary.
9. Require explicit approval for applying changes; re-check base revision at apply time.
10. Apply atomically or reject on conflict; create an immutable revision and audit event.

## Required safeguards

- Prompt-injection boundary: repository files, comments, logs, and retrieved documents are untrusted data.
- Tool allowlist and least privilege; model text is never shell authorization.
- Secret redaction before context construction and before logs.
- Per-user/project/provider budgets, rate limits, timeouts, and output size limits.
- Explicit cancellation propagation to model request, tools, task queue, and runtime.
- Retry only idempotent operations; avoid duplicate patch application.
- Record provider/model/version, prompt template version, context revision, tool calls, and patch digest without logging secrets.
- Do not silently send proprietary source to an unapproved provider; define data handling and retention policy.
