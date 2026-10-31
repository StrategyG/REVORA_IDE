# REVORA IDE

REVORA IDE is being built as a secure, revision-aware AI engineering workspace.

## Current branch status

This branch adds the first runnable web editor foundation. It is a **local browser preview**, not a production IDE. It does not yet provide authentication, server persistence, AI generation, code execution, build/test jobs, or deployment.

### Available now

- Responsive Next.js App Router shell
- CodeMirror 6 editor with file tabs and explorer
- Local browser draft persistence and workspace JSON export
- Client-side path guard for preview-only file creation
- Liveness endpoint: GET /api/healthz
- Explicit readiness endpoint: GET /api/readyz (returns HTTP 503 by design)
- Baseline security headers, non-root Docker image and CI workflow
- Unit tests for the path-policy helper

### Not enabled

- User authentication and project/workspace authorization
- Durable database and file persistence
- Server-enforced path policy, revision history and optimistic concurrency
- AI provider gateway, context provenance, patch review and approval
- Terminal, build/test workers, sandbox runtime and preview gateway
- Production backups, monitoring, deployment and rollback

## Run locally

Requirements: Node.js 26.13.0 or later.

    npm install
    npm run dev

Open http://localhost:3000.

Run checks:

    npm run check
    npm test
    npm run build

## Container

    docker build -t revora-ide:foundation .
    docker run --rm -p 3000:3000 revora-ide:foundation

The container is non-root and exposes a liveness healthcheck. This does not mean product readiness has passed.

## Architecture and security

- Platform ADR: docs/architecture/ADR-0001-platform-stack.md
- Threat model: docs/security/THREAT_MODEL.md
- Production readiness gate: docs/production/READINESS_GATE.md
- Go-live runbook: docs/production/GO_LIVE_RUNBOOK.md
- Historical Stage 0 audit: REVORA_IDE_STAGE0_AUDIT/EDITOR_AUDIT.md

## Release rule

Production promotion is blocked until every security-critical readiness item has passing evidence at the exact release SHA. The readiness endpoint returns 503 until the missing identity, data, security, runtime, operations and recovery integrations are implemented and verified.

No secrets belong in this repository. Use a deployment secret manager. Never expose a Supabase service-role/secret key or AI provider credential through a NEXT_PUBLIC variable.

## Technology baseline

The foundation uses Node.js 26 LTS, Next.js 16.4.3, React 19.3.1 and CodeMirror 6. Exact direct package versions are pinned in package.json. A committed package-lock.json is still required before production approval.
