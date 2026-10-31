# REVORA IDE — Security Audit

**Candidate:** `067502dae06bd63c1a5cdfbb1e59bb2695cf7ed2`  
**Date:** 2026-11-01  
**Security decision:** BLOCKED for production.

## Verified controls

- Client-side file path validation exists for the local preview.
- Server-side domain path policy rejects traversal, absolute/drive paths, backslashes, control NUL, internal metadata directories, and prototype-pollution segments.
- Patch proposals validate schema, operation count, unique paths, content size, and base revision format.
- Approval-record verification checks a supplied approver string, exact patch digest, and expiry.
- Workspace manifests verify per-file SHA-256, total bytes, and deterministic manifest digest.
- Readiness endpoint returns HTTP 503 while required dependencies are absent.
- Docker runtime uses a non-root `node` user.
- CI workflow has `contents: read` permission and pinned action SHAs.

These are bounded controls; they do not establish application-wide security.

## Critical missing controls

| Control | Status | Release impact |
|---|---|---|
| Authentication/session lifecycle | NOT IMPLEMENTED | BLOCKER |
| Server-side RBAC and object authorization | NOT IMPLEMENTED | BLOCKER |
| Tenant/project isolation | NOT IMPLEMENTED | BLOCKER |
| Durable approval identity and authorization | NOT IMPLEMENTED | BLOCKER |
| Transactional persistence and audit immutability | NOT IMPLEMENTED | BLOCKER |
| Secret manager and credential isolation | NOT VERIFIED / NOT IMPLEMENTED | BLOCKER |
| Isolated execution and default-deny egress | NOT IMPLEMENTED | BLOCKER |
| Dependency vulnerability and secret scanning in CI | NOT IMPLEMENTED in inspected workflow | BLOCKER |
| Container vulnerability scanning / SBOM | NOT IMPLEMENTED in inspected workflow | BLOCKER |
| DAST/API authorization regression tests | NOT IMPLEMENTED | BLOCKER |
| Backup/restore and incident response validation | NOT VERIFIED | BLOCKER |

## Important implementation limitation

The `verifyPatchApproval` helper does not authenticate the actor. The supplied `approvedBy` value is only a string in a caller-provided object. It must never be treated as proof of identity or authorization. The in-memory patch helper is not a database transaction and does not persist an audit record or rollback point.

## Threats requiring explicit tests

- Authentication bypass, session theft, CSRF and privilege escalation.
- BOLA/IDOR and cross-project/tenant reads or writes.
- Prompt injection in source files, issue text, docs and retrieved context.
- Agent tool abuse and privilege escalation.
- Arbitrary code execution, sandbox escape, metadata-service access and network egress.
- Secret leakage through browser bundles, logs, prompts, environment variables or artifacts.
- SSRF, path traversal, symlink escape, malicious uploads and dependency lifecycle scripts.
- Audit tampering, replayed approvals, stale revision writes and partial application.
- Denial of service through file size, token, queue, concurrency and runtime exhaustion.

## Required security posture

Default deny. Enforce authorization on every server-side object operation. Treat repository and retrieved content as untrusted data, never as system instructions. Never execute repository/model-generated code in the Next.js process. Do not place production secrets in development/test or worker environments. Critical/high findings block release unless a named risk owner approves a documented exception; exceptions do not convert a failed technical control into PASS.

## Limitation

This is a source-level audit of the inspected GitHub candidate. No live penetration test, dependency scan, container scan, DAST, sandbox assessment, or production environment assessment was executed. Vulnerability count is NOT VERIFIED, not zero.
