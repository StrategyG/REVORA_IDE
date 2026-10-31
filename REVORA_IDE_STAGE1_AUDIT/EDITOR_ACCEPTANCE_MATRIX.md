# REVORA IDE — Acceptance Matrix

**Status:** Proposed tests. None were executed in Stage 1 because the repository contains no application code or test harness.

| ID | Area | Acceptance test | Expected result | Evidence required |
|---|---|---|---|---|
| AC-001 | Bootstrap | Clean checkout installs from lockfile and builds | Reproducible successful build | CI log, commit SHA, toolchain versions |
| AC-002 | Authentication | Unauthenticated request to protected API | Denied consistently | API test report |
| AC-003 | Authorization | User A requests User B project/workspace/file | Denied without data leakage | Negative integration tests |
| AC-004 | Workspace isolation | Attempt cross-workspace file access | Denied at server boundary | Security test evidence |
| AC-005 | Path safety | `..`, encoded traversal, absolute path, symlink escape attempts | Rejected/canonicalized safely | Fuzz/property tests |
| AC-006 | File persistence | Save file, restart app/worker, reopen | Exact content and digest preserved | Integration test + DB/blob evidence |
| AC-007 | Concurrency | Two clients save against same base version | Stale writer receives conflict; no silent overwrite | Race test |
| AC-008 | Revision lineage | Create revisions and restore older revision | Immutable parent chain and correct restore | DB-level integration test |
| AC-009 | Recovery | Interrupt browser/network during edit | Recover buffer/checkpoint; no silent loss | E2E test and recovery log |
| AC-010 | AI context | Ask about project file at revision R | Context is authorized and pinned to R | Trace with file/revision provenance |
| AC-011 | AI patch | Generate multi-file patch | Structured, validated proposal only | Schema validation + patch artifact |
| AC-012 | Patch conflict | Apply patch when workspace head changed | Reject or require explicit rebase | Concurrency integration test |
| AC-013 | Approval | Apply sensitive patch without approval | Denied; approval bound to digest | Audit record + negative test |
| AC-014 | Secrets | Scan prompts, browser bundle, logs, artifacts, sandbox env | No credentials leaked | Secret scanner and manual review |
| AC-015 | Sandbox | Execute untrusted test command | Cannot access host, sibling project, secrets, metadata service | Sandbox isolation test report |
| AC-016 | Egress | Sandbox attempts unapproved network access | Denied and logged | Network policy test |
| AC-017 | Build | Build pinned revision | Result references exact revision/toolchain | Build record and artifact digest |
| AC-018 | Test | Run test against build/revision | Result references exact target | TestRun record |
| AC-019 | Preview | Open preview for artifact | Scoped, expiring URL; no host filesystem access | E2E/security test |
| AC-020 | Agent lifecycle | Start, cancel, retry task | Durable state and idempotent behavior | Worker/queue integration tests |
| AC-021 | Responsive | Desktop/tablet/Android portrait/landscape flows | No critical overflow; keyboard/touch/focus usable | Device/browser test evidence |
| AC-022 | CI security | PR workflow runs lint, typecheck, tests, dependency/security scans | Required checks pass | Actions run URL and logs |
| AC-023 | Deployment | Staging deploy with approval gate | Only approved artifact/revision deployed | Environment approval and deployment record |
| AC-024 | Rollback | Roll back failed release | Previous known-good artifact restored | Incident drill log |
| AC-025 | Audit | Sensitive actions create attributable records | Actor, action, target digest, time, outcome recorded | Audit query and test |

## Release rule

No feature is production-ready solely because it compiles. Each acceptance item must have an owner, automated or documented test, evidence link, and release status. Security-critical tests AC-002 through AC-016 must pass before enabling multi-user access, AI patch application, terminal, or build execution.
