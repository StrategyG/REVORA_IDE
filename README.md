# REVORA IDE

REVORA IDE is being developed as a secure, revision-aware AI engineering workspace.

> **Current release status: BLOCKED — foundation preview only.** This repository snapshot is not a production IDE. The editor can be previewed locally; identity, durable workspace persistence, AI generation, patch application, code execution, build/test orchestration, preview hosting, and production operations are not implemented.

## Repository baseline

- Default branch `main` is a bootstrap branch and contains only this README at the audited baseline.
- The runnable editor foundation is on `feat/production-foundation-v1`.
- The holistic architecture and production execution plan are being maintained on `feat/holistic-system-upgrade-v1`, based on the foundation branch.
- PR #3 is a draft foundation PR and targets `docs/stage0-repository-audit-v42`. Review the branch/PR promotion topology before merging anything.
- Branch protection was not enabled on the branches inspected in the baseline audit.

The holistic plan branch adds planning documents only; it does not claim that the missing platform services are implemented.

## What exists in the foundation preview

- Next.js App Router and React application shell.
- CodeMirror 6 editor with basic tabs, file explorer, and file search.
- Browser-local draft storage and workspace JSON export.
- Client-side path guard for preview-only file creation.
- `GET /api/healthz` liveness endpoint.
- `GET /api/readyz` returns HTTP 503 by design while required dependencies are absent.
- Baseline HTTP security headers, non-root Docker image, CI workflow.
- Basic Node.js tests for path policy and readiness behavior.

## What is not implemented

- User identity, secure sessions, project membership, and server-side object authorization.
- Database schema/migrations and durable file/workspace storage.
- Immutable revisions, optimistic concurrency, recovery checkpoints, and server-side path enforcement.
- AI provider gateway, model routing, repository context indexing, or AI task orchestration.
- Structured AI patch proposals, diff review, human approval, atomic apply, and rollback.
- Terminal, build/test workers, isolated sandbox, or preview gateway.
- Production-grade audit pipeline, monitoring, alerting, backup/restore, staging, and deployment.

## Architecture and delivery documents

- [Holistic system architecture blueprint](docs/architecture/REVORA_HOLISTIC_SYSTEM_BLUEPRINT_V1.md)
- [Production execution and readiness plan](docs/production/REVORA_PRODUCTION_EXECUTION_PLAN_V1.md)
- [Platform ADR](docs/architecture/ADR-0001-platform-stack.md)
- [Threat model](docs/security/THREAT_MODEL.md)
- [Production readiness gate](docs/production/READINESS_GATE.md)
- [Go-live runbook template](docs/production/GO_LIVE_RUNBOOK.md)
- [Historical Stage 0 audit](REVORA_IDE_STAGE0_AUDIT/EDITOR_AUDIT.md)

## Toolchain status

The foundation branch has now been aligned to the ADR target for direct dependencies and runtime:
- Node.js 26.13.0 is declared in `.nvmrc`, `package.json`, CI, and Docker.
- Next.js 16.4.3 and React/React DOM 19.3.1 are pinned in `package.json`.
- The lockfile is still absent. CI currently uses `npm install` temporarily; this is not a reproducible release installation.
- G0 remains BLOCKED until npm generates and commits a valid `package-lock.json`, CI switches to `npm ci`, and the exact candidate SHA passes clean install, tests, build, and container verification.

The dependency-version alignment is a code change, not evidence that Next.js 16 migration or production compatibility has passed. The current CI run must be inspected before accepting this upgrade.

## Run the local preview

Use Node.js 26.13.0 as pinned in `.nvmrc`. Until the lockfile is committed, dependency installation is still temporary and must not be used as proof of release reproducibility.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Basic checks:

```bash
npm run check
npm test
npm run build
```

These commands verify only the current foundation. They do not prove production readiness.

## Container preview

```bash
docker build -t revora-ide:foundation .
docker run --rm -p 3000:3000 revora-ide:foundation
```

The container runs as a non-root user and has a liveness healthcheck. This is not a sandbox for repository code and does not make the product ready to execute untrusted code.

## Security and release rules

- Never commit credentials, tokens, private keys, or production data.
- Never expose Supabase service-role/secret keys or AI provider credentials in browser bundles or `NEXT_PUBLIC_*` variables.
- Do not enable terminal, build/test execution, agent execution, or preview exposure until the sandbox and related security gates pass.
- AI output must remain a reviewable, revision-pinned patch proposal until server-side approval and atomic apply are verified.
- Production promotion requires passing evidence at one exact release SHA, an immutable artifact digest, staging validation, successful backup/restore and rollback drills, and explicit owner/security approval.
- Keep `main` and production deployment unchanged until the source-of-truth and promotion topology is reviewed and approved.

The `/api/readyz` endpoint intentionally returns HTTP 503 until required identity, data, security, runtime, operations, and recovery integrations have been implemented and verified.
