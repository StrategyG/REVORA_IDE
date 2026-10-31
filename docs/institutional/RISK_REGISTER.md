# REVORA IDE — Institutional Risk Register

**Date:** 2026-11-01  
**Candidate:** `067502dae06bd63c1a5cdfbb1e59bb2695cf7ed2`

Scales: Severity and likelihood are qualitative (Critical/High/Medium/Low). Likelihood describes exposure if the platform is operated beyond its current preview-only boundary.

| ID | Severity | Likelihood | Component | Risk / impact | Remediation | Release effect |
|---|---|---|---|---|---|---|
| R-01 | Critical | High | Identity/access | No authentication or server authorization; project data cannot be safely shared | Implement identity, sessions, RBAC and object-level authorization; test cross-project denial | BLOCK |
| R-02 | Critical | High | Workspace/data | Browser-only persistence can be lost and cannot provide durable shared state | Durable DB/object storage, transaction boundaries, backup/restore | BLOCK |
| R-03 | Critical | High | Patch/approval | Caller-supplied approver string is not authenticated; no durable atomic apply | Bind approval to authenticated principal, project, revision, digest, operations, policy and expiry; transaction + replay protection | BLOCK |
| R-04 | Critical | High | Execution | No sandbox; enabling arbitrary execution would expose host/app secrets | Independent per-task isolation, quotas, default-deny egress, no host secrets | BLOCK |
| R-05 | High | High | Supply chain | No lockfile; CI uses npm install; transitive dependency graph can drift | Generate lockfile with pinned toolchain; npm ci; provenance and scans | BLOCK |
| R-06 | High | High | Source governance | main is bootstrap-only and unprotected; nested PR promotion can merge wrong ancestry | Decide integration branch, reconcile bases, require reviews/checks and prevent force push/deletion | BLOCK |
| R-07 | High | Medium | AI/RAG | No context provenance or prompt-injection boundary | Access-filtered retrieval, source provenance, untrusted-content handling, evaluation | BLOCK AI release |
| R-08 | High | Medium | Agents | No tool permissions, budgets, scheduler or human checkpoints | Bounded agent identities, allowlists, idempotency, cancellation and approval gates | BLOCK agents |
| R-09 | High | Medium | Audit/recovery | No durable append-only audit or tested rollback/restore | Persist attributable events and revision lineage; perform restore and rollback drills | BLOCK |
| R-10 | High | Medium | Security assurance | No scanner evidence or API/DAST/sandbox tests | Add automated scans and adversarial regression suite; remediate critical/high findings | BLOCK |
| R-11 | Medium | Medium | Operations | No metrics, tracing, alerting, SLO or incident ownership evidence | Implement observability, on-call/incident runbooks and recovery objectives | BLOCK |
| R-12 | Medium | Medium | Performance | No representative load/performance baseline | Define workloads, run tests, apply measured capacity controls | BLOCK scale claims |

## Risk acceptance policy

No critical risk may be accepted for production by an informal note. Any exception must identify a named accountable risk owner, scope, compensating controls, expiry/review date, and explicit release approval. A risk exception does not change the implementation status or turn a failed gate into PASS.

## Current top risks

R-01 through R-06 are immediate release blockers. AI/agent feature work must not bypass identity, durable state, approval governance, and isolated execution prerequisites.
