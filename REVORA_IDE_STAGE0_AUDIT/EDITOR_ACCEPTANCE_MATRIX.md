# REVORA IDE — Stage 0 and Product Acceptance Matrix

**Audit baseline date:** 2026-10-31  
**Target repository:** StrategyG/REVORA_IDE  
**Purpose:** Separate verified repository-audit evidence from future application tests.

## 1. Required status vocabulary

| State | Meaning |
|---|---|
| PASS | Verified by actual execution or evidence |
| FAIL | Executed and failed |
| BLOCKED | Cannot proceed because a dependency, permission, or prerequisite is missing |
| NOT RUN | Test has not been executed |
| NOT VERIFIED | Implementation exists or may exist externally, but evidence is insufficient |
| NEEDS REVIEW | Requires a human decision or review |

Do not use a visual mockup, generated response, documentation assertion, or unexecuted test as evidence of a working feature.

## 2. Stage 0 repository-audit acceptance

| ID | Acceptance criterion | Status | Evidence |
|---|---|---|---|
| S0-01 | Repository metadata and default branch inspected | PASS | GitHub metadata: StrategyG/REVORA_IDE, default branch main, public, not archived |
| S0-02 | Current remote branches and branch relationship inspected | PASS | main and docs/stage1-editor-audit; documentation branch is 13 commits ahead and 0 behind main |
| S0-03 | Default-branch structure inspected | PASS | main contains README.md only |
| S0-04 | Additional documentation-branch structure inspected | PASS | 13 Markdown files under REVORA_IDE_STAGE1_AUDIT; no application source added |
| S0-05 | Framework, runtime, dependencies, and editor implementation identified | PASS | None found in the inspected remote repository; no stack is inferred |
| S0-06 | Existing editor capabilities mapped | PASS | No executable editor capabilities evidenced; capability inventory recorded in EDITOR_AUDIT.md |
| S0-07 | Missing capabilities and dependencies recorded | PASS | EDITOR_IMPLEMENTATION_GAP.md |
| S0-08 | Implementation sequence justified | PASS | Dependency-ordered staged delivery in EDITOR_AUDIT.md and EDITOR_IMPLEMENTATION_GAP.md |
| S0-09 | Existing audit inconsistencies identified | PASS | Historical empty-repository statements and duplicate acceptance matrix recorded |
| S0-10 | No unexplained destructive changes made | PASS | Main and existing audit branch untouched; Stage 0 reports added on a new branch |

**Stage 0 gate: PASS for the accessible remote repository scope.** Local working trees and external systems remain NOT VERIFIED.

## 3. Product implementation acceptance matrix

All application tests below are future acceptance requirements. They have not been executed because the inspected repository contains no application source or test harness.

| ID | Area | Acceptance test | Current status | Evidence required for PASS |
|---|---|---|---|---|
| AC-001 | Application bootstrap | Clean checkout installs from lockfile, builds, and starts | BLOCKED | Reproducible build log, toolchain versions, commit SHA |
| AC-002 | Authentication | Unauthenticated access to protected APIs is denied | BLOCKED | API negative tests and session evidence |
| AC-003 | Authorization | User A cannot read or mutate User B's project/workspace/files | BLOCKED | Cross-project object-authorization tests |
| AC-004 | Workspace integrity | File operations cannot escape workspace boundaries | BLOCKED | Workspace isolation and path-normalization tests |
| AC-005 | File explorer | Real server-backed tree and create/rename/move/delete operations work | BLOCKED | Integration tests against persistent storage |
| AC-006 | Source editor | Multiple real files can be edited with dirty/read-only/undo states | BLOCKED | Component and E2E evidence |
| AC-007 | Persistence | Save survives browser refresh and server/worker restart | BLOCKED | Exact content/checksum readback |
| AC-008 | Concurrency | Two sessions modifying the same base revision cannot silently overwrite | BLOCKED | Race test and conflict evidence |
| AC-009 | Revision history | Revisions are immutable and parent lineage is queryable | BLOCKED | Database/API lineage tests |
| AC-010 | Recovery | Browser/network interruption preserves recoverable drafts | BLOCKED | Recovery E2E traces and restored content |
| AC-011 | AI context | Context is authorized, minimal, and pinned to a revision | BLOCKED | Provider trace with project/workspace/revision provenance |
| AC-012 | AI patch | AI output is a schema-valid patch proposal, not an unreviewed write | BLOCKED | Schema validation and patch artifact |
| AC-013 | Patch conflict | Stale patch base is rejected or explicitly reconciled | BLOCKED | Integration test with changed workspace head |
| AC-014 | Patch approval | Protected apply requires backend-verified approval bound to the exact patch | BLOCKED | Negative authorization test and audit record |
| AC-015 | Patch provenance | Applied patch creates a traceable revision and can be reverted safely | BLOCKED | Revision history, actor, digest, and restore test |
| AC-016 | Terminal isolation | Commands run only in an isolated runtime with resource limits | BLOCKED | Sandbox isolation and resource-limit tests |
| AC-017 | Build | Build result identifies exact source revision and configuration | BLOCKED | Build record, logs, and artifact digest |
| AC-018 | Tests | Test result identifies exact source/build and failed tests | BLOCKED | Test run record and raw result details |
| AC-019 | Preview | Preview serves the artifact built from the identified revision | BLOCKED | Artifact digest, source revision, scoped URL, runtime evidence |
| AC-020 | Agent activity | Task states, cancellation, retry, and checkpoints are durable | BLOCKED | Worker/queue integration and reconnect tests |
| AC-021 | Approval | Critical action approval is scoped, expiring, and audited | BLOCKED | Approval lifecycle tests and decision history |
| AC-022 | Secrets | Provider/agent credentials are absent from browser bundles, prompts, logs, and sandbox | BLOCKED | Secret scan, redaction tests, configuration review |
| AC-023 | Prompt injection/tool safety | Repository content cannot override system policy or grant tool authority | BLOCKED | Adversarial context/tool authorization tests |
| AC-024 | Dependency/security | Dependency and build supply-chain controls run in CI | BLOCKED | Workflow run, lockfile, scanner reports |
| AC-025 | Desktop responsive | Panels resize/collapse without state loss or overflow | BLOCKED | Browser viewport test and interaction record |
| AC-026 | Tablet responsive | Drawer/panel interactions preserve editor state | BLOCKED | Tablet viewport or device evidence |
| AC-027 | Android portrait | File, editor, AI, patch, save, and workbench flows are usable | BLOCKED | Real device/viewport E2E evidence |
| AC-028 | Android landscape | Keyboard, panels, focus, scroll, and toolbar remain usable | BLOCKED | Device/viewport E2E evidence |
| AC-029 | Accessibility | Keyboard navigation, focus restoration, labels, and contrast meet requirements | NOT RUN | Automated accessibility report and manual assistive-technology review |
| AC-030 | CI status | Required lint, typecheck, test, build, and security checks pass | BLOCKED | GitHub Actions run URLs and logs |
| AC-031 | Recovery/operations | Worker interruption and browser reconnection recover or explicitly fail | BLOCKED | Fault-injection run and correlated task logs |
| AC-032 | Production rollback | Previous known-good artifact can be restored | BLOCKED | Staging rollback drill and deployment record |

## 4. Required end-to-end scenarios

| Scenario | Required workflow | Current status |
|---|---|---|
| E2E-01 | Create project, initialize workspace, open file tree, verify identity | BLOCKED |
| E2E-02 | Edit, save, refresh, reopen, compare exact file content | BLOCKED |
| E2E-03 | Create revision, inspect history, compare, restore as a new revision | BLOCKED |
| E2E-04 | Ask AI about selected code, create structured patch, review, approve, apply | BLOCKED |
| E2E-05 | Two sessions edit overlapping files and resolve a conflict without data loss | BLOCKED |
| E2E-06 | Build and test a pinned revision and verify artifact provenance | BLOCKED |
| E2E-07 | Launch preview for the correct artifact and stop runtime safely | BLOCKED |
| E2E-08 | Disconnect/reconnect browser and interrupt worker; retrieve durable task state | BLOCKED |
| E2E-09 | Verify cross-project denial, secret redaction, command and egress restrictions | BLOCKED |
| E2E-10 | Complete core file/AI/patch/save/task workflow on Android | BLOCKED |

## 5. Test execution record at Stage 0

| Check | Actual result | Status |
|---|---|---|
| GitHub repository metadata read | Returned repository identity, visibility, default branch, permissions | PASS |
| Branch inventory | main and docs/stage1-editor-audit returned | PASS |
| Branch comparison | Documentation branch 13 commits ahead, 0 behind; 13 files added | PASS |
| Main README fetch | Successfully fetched README.md | PASS |
| Existing audit documents fetch | Required audit documents retrieved and inspected | PASS |
| Pull request search | 0 results | PASS |
| Issue search | 0 results | PASS |
| Commit status lookup | Empty status arrays for inspected commits; not treated as passing checks | PASS |
| PR-triggered workflow-run lookup | Empty result for inspected audit commit | PASS |
| package.json / pyproject.toml / workflow code searches | No results on default branch; scope limitation recorded | PASS |
| Application unit/component/integration/E2E tests | No app/test harness to execute | BLOCKED |
| Build/typecheck/lint | No app manifest/toolchain to execute | BLOCKED |
| Browser/device responsive tests | No running frontend | BLOCKED |
| Security/sandbox tests | No implementation/runtime | BLOCKED |
| External service and local working-tree checks | Outside accessible remote repository scope | NOT VERIFIED |

## 6. Release decision rule

- **PRODUCTION READY:** Only after every mandatory product gate passes with traceable evidence and no unresolved critical security/data-integrity issue.
- **CONDITIONALLY READY:** Only when core workflows work and remaining limitations are documented and accepted, with no unresolved critical issue.
- **NOT READY:** When core workflows, persistence, authorization, isolation, or evidence are missing.

The current product decision is **NOT READY**. Stage 0 itself is PASS, but application implementation and production tests are blocked by the absence of application source and supporting services.

No test may be relabeled PASS merely because a document describes the expected behavior.
