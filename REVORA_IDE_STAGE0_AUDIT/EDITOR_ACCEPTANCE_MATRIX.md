# REVORA IDE — Stage 0 and Product Acceptance Matrix

**Audit snapshot:** 2026-10-31  
**Repository:** `StrategyG/REVORA_IDE`  
**Target audit ref:** `docs/stage0-repository-audit-v42`  
**Evidence source:** `STAGE0_EVIDENCE_LEDGER.md`  
**Purpose:** Separate completion of repository discovery from implementation and product acceptance.

## 1. Status vocabulary — mandatory interpretation

| Status | Exact meaning | Permitted use |
|---|---|---|
| PASS | The defined check was executed successfully and its evidence is recorded. | Stage 0 audit checks; product tests only when actually executed and passed |
| FAIL | The check was executed and its acceptance condition was not met, or evidence contradicts a required claim. | Audit or product checks |
| BLOCKED | The check cannot proceed because code, permissions, access, environment, or a prerequisite is missing. | Product checks without an implementation/runtime; inaccessible required checks |
| NOT RUN | The check could have been executed but was not executed. | Test or review not yet performed despite available prerequisites |
| NOT VERIFIED | The relevant state is outside the inspection boundary or evidence is insufficient. | Local clones, external infrastructure, private services |
| NEEDS REVIEW | A human decision or unresolved interpretation is required. | Product/security/architecture decisions |

**Critical distinction:** Stage 0 PASS means repository discovery is complete within the stated remote-repository boundary. It does not mean any feature, build, test, security control, CI pipeline, or deployment has passed.

A mockup, architecture diagram, documentation claim, model response, unexecuted test, or empty CI response is not evidence of working behavior.

## 2. Stage 0 repository-discovery acceptance

| ID | Required check | Result | Evidence / acceptance basis |
|---|---|---|---|
| S0-01 | Repository identity, visibility, archive state, and default branch verified | PASS | E0-01; repository ID 1440851372; public; not archived/disabled; default branch `main` |
| S0-02 | All returned branches and their head SHAs recorded | PASS | E0-02; three branch refs recorded with SHAs |
| S0-03 | Branch protection flag captured without overstating policy coverage | PASS | E0-02; API `protected=false` on all three refs; ruleset coverage is not claimed |
| S0-04 | Default-branch recursive tree fully enumerated | PASS | E0-03; one blob (`README.md`); `truncated=false` |
| S0-05 | Target-branch recursive tree fully enumerated | PASS | E0-04; 20 Markdown blobs; `truncated=false` |
| S0-06 | Base-to-target branch comparison completed | PASS | E0-05; 25 ahead, 0 behind; 20 changed paths |
| S0-07 | Target-to-prior-audit-branch comparison completed | PASS | E0-06; 12 ahead, 0 behind; six Stage 0 additions and six modifications |
| S0-08 | File inventory classified for source, manifests, schemas, tests, CI and deployment | PASS | E0-03/E0-04/E0-10; no executable source or runtime/deployment artefacts in inspected trees |
| S0-09 | Technology/framework/runtime discovery recorded without assumptions | PASS | E0-10; no application stack identified |
| S0-10 | PR and issue endpoint results recorded | PASS | E0-07; empty arrays; this records endpoint results only |
| S0-11 | Workflow runs, commit statuses and check runs inspected | PASS | E0-08/E0-09; zero workflow runs, status entries and check runs; no CI pass claimed |
| S0-12 | Existing capability map separates implementation from documentation | PASS | EDITOR_AUDIT.md Section 5; capabilities classified as absent in inspected tree |
| S0-13 | Security/data-integrity gaps and scope limits recorded | PASS | EDITOR_AUDIT.md Sections 7 and 10; no secure/vulnerable conclusion inferred without code |
| S0-14 | Evidence ledger and execution protocol published | PASS | STAGE0_EVIDENCE_LEDGER.md and STAGE0_EXECUTION_PROTOCOL.md |
| S0-15 | Historical-document conflicts identified and reconciled as historical | PASS | EDITOR_AUDIT.md Section 8; old folder is not treated as current implementation |
| S0-16 | All material claims cross-linked to pinned evidence and terminology reconciled | PASS | Evidence ledger + document readback in final completion report |
| S0-17 | Local working tree and external infrastructure inspected | NOT VERIFIED | Out of remote GitHub repository inspection scope; no assertion is made |
| S0-18 | Application regression/build/security tests executed | BLOCKED | No application source, manifest, test harness, or execution runtime exists in the inspected tree |

**Stage 0 gate: PASS — remote repository discovery scope only.** S0-17 and S0-18 remain explicitly outside or blocked and do not become successful application checks.

## 3. Product implementation acceptance matrix

All checks below are future product acceptance requirements. They have not been executed. Current status is BLOCKED because the inspected repository contains no application code or runtime.

| ID | Area | Required acceptance test | Current status | Evidence required for PASS |
|---|---|---|---|---|
| AC-001 | Bootstrap | Clean checkout installs, builds, and starts from pinned lockfile | BLOCKED | Reproducible build log, toolchain versions, commit SHA |
| AC-002 | Authentication | Unauthenticated access to protected APIs is denied | BLOCKED | API negative tests and session evidence |
| AC-003 | Authorization | User A cannot read or mutate User B's project/workspace/files | BLOCKED | Cross-project object-authorization tests |
| AC-004 | Workspace integrity | File operations cannot escape workspace boundaries | BLOCKED | Traversal, symlink and path-normalization tests |
| AC-005 | File explorer | Real server-backed tree and create/rename/move/delete operations work | BLOCKED | Integration tests against persistent storage |
| AC-006 | Source editor | Multiple real files support edit, dirty/read-only, undo and buffer state | BLOCKED | Component and E2E evidence |
| AC-007 | Persistence | Save survives refresh and worker/server restart | BLOCKED | Exact content and checksum readback |
| AC-008 | Concurrency | Stale concurrent writes cannot silently overwrite newer content | BLOCKED | Race test and conflict evidence |
| AC-009 | Revision history | Revisions are immutable and parent lineage is queryable | BLOCKED | Database/API lineage tests |
| AC-010 | Recovery | Browser/network interruption preserves recoverable drafts | BLOCKED | Recovery E2E trace and restored content |
| AC-011 | AI context | Context is authorized, minimal and pinned to a revision | BLOCKED | Provider trace with project/workspace/revision provenance |
| AC-012 | AI patch | AI output is a schema-valid patch proposal, not an unreviewed write | BLOCKED | Schema validation and patch artifact |
| AC-013 | Patch conflict | Stale patch base is rejected or explicitly reconciled | BLOCKED | Integration test with changed workspace head |
| AC-014 | Patch approval | Protected apply requires backend-verified approval bound to exact patch | BLOCKED | Negative authorization test and audit record |
| AC-015 | Patch provenance | Applied patch creates a traceable revision and can be reverted | BLOCKED | Revision history, actor, digest and restore test |
| AC-016 | Terminal isolation | Commands run only in isolated runtime with resource limits | BLOCKED | Sandbox and resource-limit tests |
| AC-017 | Build | Build result identifies exact source revision and configuration | BLOCKED | Build record, logs and artifact digest |
| AC-018 | Tests | Test result identifies exact source/build and failures | BLOCKED | Test-run record and raw result details |
| AC-019 | Preview | Preview serves artifact built from the identified revision | BLOCKED | Artifact digest, source revision and scoped URL |
| AC-020 | Agent activity | Task states, cancellation, retry and checkpoints are durable | BLOCKED | Worker/queue integration and reconnect tests |
| AC-021 | Approval | Critical action approval is scoped, expiring and audited | BLOCKED | Approval lifecycle tests and decision history |
| AC-022 | Secrets | Credentials are absent from browser bundles, prompts, logs and sandbox | BLOCKED | Secret scan, redaction tests and configuration review |
| AC-023 | Prompt injection/tool safety | Repository content cannot override policy or grant tool authority | BLOCKED | Adversarial context and tool-authorization tests |
| AC-024 | Supply chain | Dependency and build controls run in CI | BLOCKED | Workflow run, lockfile and scanner reports |
| AC-025 | Desktop UX | Panels resize/collapse without state loss or overflow | BLOCKED | Browser viewport and interaction evidence |
| AC-026 | Tablet UX | Drawer/panel interactions preserve editor state | BLOCKED | Tablet viewport or device evidence |
| AC-027 | Android portrait | File/editor/AI/patch/save/workbench flows are usable | BLOCKED | Real-device or viewport E2E evidence |
| AC-028 | Android landscape | Keyboard, panels, focus, scroll and toolbar remain usable | BLOCKED | Device/viewport evidence |
| AC-029 | Accessibility | Keyboard navigation, focus, labels and contrast meet requirements | BLOCKED | Automated report and manual assistive-technology review |
| AC-030 | CI | Required lint, typecheck, test, build and security checks pass | BLOCKED | GitHub Actions run URLs and logs |
| AC-031 | Operational recovery | Worker interruption and browser reconnection recover or explicitly fail | BLOCKED | Fault-injection run and correlated task logs |
| AC-032 | Rollback | Previous known-good artifact can be restored | BLOCKED | Staging rollback drill and deployment record |

## 4. Required end-to-end scenarios

| Scenario | Required workflow | Current status |
|---|---|---|
| E2E-01 | Create project, initialize workspace, open file tree, verify identity | BLOCKED |
| E2E-02 | Edit, save, refresh, reopen, compare exact file content | BLOCKED |
| E2E-03 | Create revision, inspect history, compare and restore as a new revision | BLOCKED |
| E2E-04 | Ask AI about selected code, create structured patch, review, approve and apply | BLOCKED |
| E2E-05 | Two sessions edit overlapping files and resolve conflict without data loss | BLOCKED |
| E2E-06 | Build/test a pinned revision and verify artifact provenance | BLOCKED |
| E2E-07 | Launch preview for the correct artifact and stop runtime safely | BLOCKED |
| E2E-08 | Disconnect/reconnect browser and interrupt worker; retrieve durable task state | BLOCKED |
| E2E-09 | Verify cross-project denial, secret redaction and command/egress restrictions | BLOCKED |
| E2E-10 | Complete core file/AI/patch/save/task workflow on Android | BLOCKED |

## 5. Test execution record at Stage 0

| Check | Actual observation | Audit status | Product-test interpretation |
|---|---|---|---|
| Repository metadata read | Metadata returned and matched target repository | PASS | Not a product test |
| Branch inventory | Three branches returned | PASS | Not a product test |
| Complete tree inventory | Main and target recursive trees returned with `truncated=false` | PASS | Establishes inspected source boundary |
| Branch comparisons | Counts and changed paths returned for both comparisons | PASS | Not an application merge test |
| PR/issues lookup | Empty arrays returned | PASS | Does not prove PR governance is configured |
| Workflow lookup | Zero workflow runs returned | PASS | CI is not passed |
| Commit status/check runs | Zero status entries/check runs; combined status state reported pending | PASS (observation) | No passing CI check exists in evidence |
| Application build/lint/typecheck | No source or manifest to execute | BLOCKED | No pass can be claimed |
| Unit/component/integration/E2E | No test harness or application source | BLOCKED | No pass can be claimed |
| Browser/Android/accessibility | No frontend exists in inspected tree | BLOCKED | No responsive/accessibility pass can be claimed |
| Security/sandbox | No application/runtime to test | BLOCKED | No security posture can be credited |
| Local/external infrastructure | Not accessible in this audit | NOT VERIFIED | Cannot infer presence or absence |

## 6. Release decision rule

- **PRODUCTION READY:** Only after mandatory product gates pass with traceable evidence and no unresolved critical security/data-integrity issue.
- **CONDITIONALLY READY:** Only when core workflows work and remaining limitations are documented and explicitly accepted, with no unresolved critical issue.
- **NOT READY:** When core workflows, persistence, authorization, isolation, or evidence are missing.

**Current product decision: NOT READY.** Stage 0 discovery passed; product implementation checks remain blocked.

No test may be relabeled PASS because a document describes expected behavior or because a CI endpoint returned an empty result.
