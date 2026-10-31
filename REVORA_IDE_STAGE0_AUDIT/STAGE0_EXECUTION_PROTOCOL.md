# REVORA IDE — Stage 0 Execution Protocol

**Protocol version:** 1.0  
**Effective snapshot:** 2026-10-31  
**Repository:** StrategyG/REVORA_IDE  
**Execution branch:** `docs/stage0-repository-audit-v42`  
**Purpose:** Make repository discovery repeatable, evidence-led, and safe before architecture or implementation work.

## 1. Stage 0 purpose and non-goals

Stage 0 establishes the verifiable baseline of the target repository. It answers:

1. What repository and refs are being inspected?
2. What files and executable assets exist at each pinned ref?
3. What implementation, tooling, CI, security, and deployment evidence exists?
4. What is absent, blocked, unverified, or merely proposed?
5. Is the evidence sufficient to enter Stage 1?

Stage 0 does **not** choose the application stack, define final data contracts, implement features, prove production readiness, or infer that an external service exists because a document mentions it.

A Stage 0 **PASS is an audit-process result only**. It is never a product-feature, build, test, security, or production PASS.

## 2. Required inputs and audit freeze

Before collecting evidence, record:

| Input | Required value |
|---|---|
| Repository | Exact `owner/name` |
| Default/base branch | Read from GitHub repository metadata; do not assume |
| Target audit branch/ref | Exact branch, tag, or commit SHA |
| Prior design/audit refs | List each separately; do not merge their contents mentally |
| Snapshot timestamp | UTC timestamp |
| Access channel | GitHub API / connector / local checkout; state which was actually used |
| Permission limitations | Record denied or unavailable endpoints |
| Change boundary | Documentation-only audit branch unless separately authorized |

Pin the target branch head SHA before inspection. If its head moves during the audit, restart or repeat all affected checks against the new SHA. Record the exact SHA used for every tree and file read.

Do not describe a remote-only inspection as a local checkout audit. Do not treat a branch name as an immutable evidence identifier; use its resolved SHA.

## 3. Mandatory inspection sequence

### S0-A — Repository identity and access

1. Fetch repository metadata.
2. Record full name, repository ID, visibility, archived/disabled state, default branch, and available permission flags.
3. Enumerate all branches and tags returned by the available endpoints.
4. Record each branch head SHA and the branch protection flag returned by the API.
5. Record access failures explicitly.

**Exit evidence:** repository metadata and ref inventory with timestamp and source links.

### S0-B — Complete tree inventory

1. Resolve the default branch to a commit SHA.
2. Resolve the target audit ref to a commit SHA.
3. Fetch the Git tree recursively for each relevant SHA.
4. Require the tree response to report `truncated: false`. If it is truncated, inventory is incomplete and the gate is BLOCKED until paged or otherwise completed.
5. Classify every blob by path and role:
   - application source;
   - package/runtime manifest and lockfile;
   - configuration;
   - database schema/migration;
   - tests and fixtures;
   - CI/workflow;
   - infrastructure/deployment;
   - documentation;
   - assets/binaries;
   - unknown.
6. Do not conclude that a repository is documentation-only from a README, a code-search result, or a partial directory listing. Use the complete tree.

**Exit evidence:** pinned tree SHA, recursive completeness flag, full path inventory, and classification.

### S0-C — Branch lineage and change scope

1. Compare `main` (or the actual default branch) with the target branch.
2. If the target branch was based on another audit/design branch, compare against that branch as well.
3. Record merge base, ahead/behind counts, changed paths, and each path's status (added, modified, deleted, renamed).
4. Verify the default branch head has not changed as a consequence of the audit.
5. Review commit messages and relevant diffs for unintended application/configuration changes.

**Exit evidence:** compare results with both ref names and resolved SHAs.

### S0-D — Toolchain and capability discovery

Inspect all files in the complete target tree for evidence of:

- language and runtime;
- frontend/backend framework;
- dependency manifests and lockfiles;
- editor library;
- API routes/contracts;
- persistence/schema/migrations;
- authentication and authorization;
- AI/provider integration;
- workers, queues, terminal, and sandbox;
- build/test tooling;
- CI/CD and deployment;
- observability, secrets, and operations.

Use code search only as a supplementary discovery method. A zero-result search is not enough to prove absence if the tree can be inspected directly.

For each product capability, classify it as:
- **IMPLEMENTED** — executable code exists and the relevant behavior has been exercised;
- **PARTIAL** — some executable behavior exists but acceptance is incomplete;
- **DOCUMENTED ONLY** — described in prose/diagram but no executable implementation was verified;
- **ABSENT IN INSPECTED TREE** — no implementation evidence in the complete inspected tree;
- **NOT VERIFIED** — the relevant location/system could not be inspected.

Do not label a feature IMPLEMENTED merely because a component, API name, mockup, prompt, or architecture diagram exists.

### S0-E — CI, collaboration, and repository controls

Inspect and record, where accessible:

- pull requests and issues;
- workflow definitions and recent workflow runs;
- commit statuses and check runs for the pinned base and target commits;
- branch protection flags and available rulesets;
- release/deployment metadata where relevant to the requested scope.

An empty workflow list, an empty status array, or zero check runs means **no check evidence was returned**. It does not mean CI passed. A returned status of `pending` with zero status entries is not a passing result.

Do not imply that branch protections, required reviews, release controls, or deployment protections exist unless the corresponding settings were inspected.

### S0-F — Security and data-integrity discovery

Review available executable configuration/code for evidence of:

- authentication and server-side object authorization;
- tenant/project/workspace isolation;
- path normalization and symlink/traversal protections;
- secret and provider-credential handling;
- revision immutability and optimistic concurrency;
- patch validation, approval, and provenance;
- sandbox isolation, process/filesystem/network boundaries, and resource limits;
- audit-event integrity, logging, and redaction;
- dependency and build supply-chain controls.

If there is no executable application, classify these as **NOT VERIFIED / BLOCKED**, not as secure and not as confirmed vulnerabilities. Do not run arbitrary repository scripts merely to discover what they do.

### S0-G — Gap and dependency analysis

1. Map every required capability to implementation evidence.
2. Identify blockers and prerequisites.
3. Order the roadmap by dependency and security risk.
4. Separate observed facts from target recommendations.
5. Leave undecided design choices as NEEDS REVIEW for Stage 1.

Do not pick a framework, database, hosting provider, or editor library without constraints and an explicit decision record.

### S0-H — Acceptance and independent consistency check

Before publishing the final gate:

1. Verify each material claim against the evidence ledger.
2. Cross-check branch names, SHA values, tree counts, file counts, and comparison counts across all Stage 0 documents.
3. Ensure every PASS maps to an action that actually succeeded.
4. Ensure every unexecuted test is NOT RUN or BLOCKED, never PASS.
5. Ensure every inaccessible local/external system is NOT VERIFIED.
6. Read back every changed document from GitHub.
7. Compare the final audit branch to the default branch and the prior audit branch.
8. Confirm no application source, production configuration, secret, or deployment was changed.
9. Record the exact final branch state and any remaining limitations.

## 4. Evidence rules

Every material assertion must point to one or more evidence IDs in `STAGE0_EVIDENCE_LEDGER.md`.

Evidence priority:

1. **Primary:** GitHub API response, pinned commit/tree SHA, executable file, test output, workflow/check result.
2. **Secondary:** a source document or previous audit report.
3. **Inference:** a conclusion derived from primary evidence; label it as inference.
4. **Proposal:** intended target behavior; label it as proposed, not implemented.

For negative findings, state the inspected boundary. Example: “No application source was present in the complete remote tree at commit SHA X” is acceptable. “No application exists anywhere” is not.

Do not store credentials, access tokens, private keys, user data, or secret values in the evidence ledger.

## 5. Status vocabulary and gate rules

| Status | Exact meaning |
|---|---|
| PASS | The defined audit check was performed successfully and its evidence is recorded. This does not imply the product passed. |
| FAIL | The check was performed and its acceptance condition was not met, or the evidence contradicts a required claim. |
| BLOCKED | The check cannot be completed because required code, access, permission, environment, or prerequisite is absent. |
| NOT RUN | The check was executable but was not run. |
| NOT VERIFIED | The state lies outside the inspected boundary or evidence is insufficient. |
| NEEDS REVIEW | A human decision or unresolved interpretation is required. |

**Stage 0 gate = PASS** only when every mandatory Stage 0 discovery check is PASS, the complete tree inventory is available, all material claims are evidence-linked, and no material contradiction remains unresolved.

The gate is **BLOCKED** if a mandatory inspection cannot be completed. It is **FAIL** if the inspection exposes an unresolved integrity or change-control violation. Use **NEEDS REVIEW** for unresolved scope or interpretation.

Application tests that cannot run because application code is absent remain BLOCKED. Their status does not invalidate a valid repository-discovery PASS, but it does keep product readiness at NOT READY.

## 6. Change-control rules

- Read first; do not alter application source while auditing.
- Use a dedicated audit branch.
- Keep audit changes documentation-only.
- Do not modify the default branch, merge, deploy, rotate credentials, alter repository settings, or delete files without explicit authorization.
- Do not execute untrusted code on a host environment.
- Read back every write and verify the new blob content/SHA.
- If an unintended file changes, stop and report it; do not silently revert or force-push.

## 7. Stage 0 deliverable checklist

- [ ] Repository metadata and permission boundary.
- [ ] Branch/tag/ref inventory with pinned SHAs.
- [ ] Complete recursive tree inventories for base and target refs.
- [ ] Path classification and technology/toolchain inventory.
- [ ] Base-to-target and prior-branch comparisons.
- [ ] CI, workflow, status, PR, issue, and protection observations.
- [ ] Evidence-linked capability map.
- [ ] Security/data-integrity gap inventory.
- [ ] Dependency-ordered implementation gaps.
- [ ] Acceptance matrix with accurate statuses.
- [ ] Evidence ledger and completion report.
- [ ] GitHub readback and final branch-diff verification.

## 8. Stage 0 entry criteria for Stage 1

Stage 1 may begin only after:

1. Stage 0 gate is PASS for the explicitly stated repository scope.
2. Root README and Stage 0 index point to the authoritative audit package.
3. Historical documents are clearly marked as historical where their statements are stale.
4. No material evidence contradiction remains.
5. Stage 1 is started as a separately tracked architecture/data-contract activity.

Stage 0 PASS does not authorize Stage 2 UI implementation, a merge to `main`, or deployment.
