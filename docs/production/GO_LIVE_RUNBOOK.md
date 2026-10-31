# REVORA IDE go-live runbook

**Status:** Template only; do not execute until the production readiness gate is clear.

## 1. Pre-deployment freeze

- Select a reviewed commit SHA and record its source branch and PR.
- Confirm dependency lockfile, vulnerability report, license report and clean CI.
- Confirm database migration plan and restore point.
- Confirm secrets are set in the deployment secret manager and are absent from source, browser bundles and build logs.
- Confirm the execution sandbox remains disabled unless its separate security gate has passed.

## 2. Staging verification

- Deploy the exact candidate artifact to staging.
- Verify GET /api/healthz returns 200.
- Verify GET /api/readyz returns 200 only after all configured dependencies pass checks. Current foundation code returns 503 by design.
- Run authentication, authorization, file persistence, revision-conflict, responsive, accessibility and security smoke tests.
- Verify logs are redacted and correlation IDs are present.
- Perform a backup and restore drill.

## 3. Production approval

Require explicit approval from the service owner and security reviewer. Record the candidate SHA, artifact digest, migration identifier, change ticket, approver and rollback target.

## 4. Deployment

- Promote the exact tested artifact; do not rebuild from an unpinned branch.
- Apply backward-compatible migrations using the approved migration runner.
- Run smoke tests and monitor error rate, latency, saturation and security alerts.
- Do not enable AI patch application or execution capabilities through a feature flag until their separate acceptance tests pass.

## 5. Rollback

- Stop promotion and disable affected feature flags.
- Revert to the last known-good immutable artifact.
- Roll back database changes only with a tested rollback/forward-fix plan; never drop or truncate production data as an emergency shortcut.
- Preserve audit logs and incident evidence.
- Record root cause and regression tests before retry.

## 6. Post-deployment

- Confirm backup completion and alert delivery.
- Verify no unexpected network egress or credential exposure.
- Publish release evidence and update the production readiness gate.
