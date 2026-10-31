# REVORA IDE initial threat model

**Status:** Baseline threat model; implementation verification pending  
**Date:** 2026-10-31

## Assets

- User source code and project files
- Account/session identifiers and project membership
- AI provider credentials and prompt/context content
- Revision history, patch proposals and approval decisions
- Build artifacts, logs and preview tokens
- Deployment credentials and audit records

## Trust boundaries

1. Browser/client to application server.
2. Application server to identity provider and database.
3. Application server to AI model provider.
4. Application control plane to isolated execution sandbox.
5. Build artifact store to preview gateway.
6. CI system to source repository and deployment environment.

## Threats and mandatory controls

| Threat | Required controls | Current status |
|---|---|---|
| BOLA/IDOR across projects | Server-side object authorization on every read/write; RLS ownership policies; cross-project denial tests | BLOCKED |
| Session theft/CSRF | Secure HttpOnly cookies where applicable, SameSite policy, CSRF protection for state-changing requests, revocation | BLOCKED |
| Path traversal/symlink escape | Canonical relative-path policy; reject traversal and symlink escape; server tests | Client helper only; server enforcement absent |
| Lost updates | ETag/base revision, optimistic concurrency, conflict response, immutable history | BLOCKED |
| Prompt injection via repository files | Treat all project content as untrusted data; tool allowlist; schema-validated output | BLOCKED |
| Secret exfiltration | Server-side secret manager, redaction, no keys in browser/prompts/logs/sandboxes | BLOCKED |
| Arbitrary code execution | Ephemeral isolated sandbox, non-root, no host mounts, no metadata access, bounded CPU/memory/PIDs/disk/time | BLOCKED; execution disabled |
| Network egress abuse | Default-deny egress with controlled proxy/allowlist | BLOCKED; execution disabled |
| Malicious dependency/build hook | Lockfile, dependency review, provenance and isolated build worker | BLOCKED |
| Artifact/preview leakage | Immutable digest, scoped expiring token, origin isolation and access checks | BLOCKED |
| Audit tampering | Append-only event model and restricted database permissions | BLOCKED |
| Resource exhaustion | Per-user/project rate limits, request/file limits, worker quotas and timeouts | BLOCKED |

## Security posture rules

- Do not execute model output, shell strings, package lifecycle scripts or repository code in the web process.
- Do not expose Supabase service-role keys or AI provider keys to client code.
- Never use user-editable profile metadata as an authorization source.
- Use explicit project/workspace authorization on top of authentication.
- A user-facing UI disablement is not a server-side security control.
- Treat healthz as process liveness only. Readyz must remain blocked until all required production dependencies have been verified.
- Report unknown vulnerability count as NOT VERIFIED, never as zero.

## Release-blocking security tests

1. Unauthenticated request denial.
2. Cross-user and cross-project read/write denial.
3. Path traversal, encoded traversal and symlink escape rejection.
4. Stale write conflict and patch base-revision enforcement.
5. Prompt/tool injection resistance and secret redaction.
6. Sandbox escape, host isolation, metadata denial and network-egress denial.
7. Artifact/preview authorization and token expiry.
8. Backup restore and audit-event integrity.
