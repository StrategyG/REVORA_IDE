# REVORA IDE

REVORA IDE is at the **repository discovery and architecture-definition stage**. The inspected remote repository does not yet contain a verified application implementation.

## Current status

- **Stage 0 — Repository Audit:** PASS for the explicitly scoped remote GitHub repository inspection.
- **Stage 1 — Architecture and Data Contract:** NOT STARTED.
- **Application implementation, build, automated tests and production readiness:** NOT READY.
- **Application build/test/security checks:** BLOCKED because no application source, manifest, test harness or runtime was found in the inspected tree.
- **Local working trees and external infrastructure:** NOT VERIFIED.
- **Default branch:** `main`.
- **Audit branch:** `docs/stage0-repository-audit-v42`.

A Stage 0 PASS is an audit-process result. It does not mean the editor or any product capability has passed acceptance.

## Start here — Stage 0 evidence package

Open [REVORA_IDE_STAGE0_AUDIT/README.md](REVORA_IDE_STAGE0_AUDIT/README.md) for the authoritative sequence.

1. [Execution protocol](REVORA_IDE_STAGE0_AUDIT/STAGE0_EXECUTION_PROTOCOL.md) — repeatable audit method, status definitions, controls and exit gate.
2. [Evidence ledger](REVORA_IDE_STAGE0_AUDIT/STAGE0_EVIDENCE_LEDGER.md) — pinned refs, commit/tree SHAs, direct evidence links and limitations.
3. [Repository audit](REVORA_IDE_STAGE0_AUDIT/EDITOR_AUDIT.md) — actual repository baseline, technology discovery and capability classification.
4. [Architecture map](REVORA_IDE_STAGE0_AUDIT/EDITOR_ARCHITECTURE_MAP.md) — observed repository structure separated from proposed target design.
5. [Implementation gaps](REVORA_IDE_STAGE0_AUDIT/EDITOR_IMPLEMENTATION_GAP.md) — missing functionality, dependencies and blockers.
6. [Acceptance matrix](REVORA_IDE_STAGE0_AUDIT/EDITOR_ACCEPTANCE_MATRIX.md) — Stage 0 evidence checks and future product acceptance tests.
7. [Completion report](REVORA_IDE_STAGE0_AUDIT/STAGE0_COMPLETION_REPORT.md) — performed actions, verification results and gate decision.

## Repository baseline

At the pinned Stage 0 evidence snapshot, `main` contained only `README.md`. The audit branch's complete recursive tree contained 20 Markdown files and no executable application source, package/runtime manifest, lockfile, database schema, test harness, CI workflow, or deployment definition.

The exact snapshot, branch comparisons, workflow/status results, and full path inventory are documented in the evidence ledger. Refresh the evidence before relying on it after branch heads change.

## Earlier discovery documents

`REVORA_IDE_STAGE1_AUDIT/` contains earlier discovery and proposed design notes. They are retained as historical inputs; they are not proof of implemented capabilities and are not the current Stage 1 architecture contracts. Reconcile and promote applicable proposals during Stage 1.

## Change-control policy

- Keep audit and architecture work on dedicated branches.
- Do not merge to `main`, deploy, or claim production readiness without explicit authorization and evidence-based acceptance gates.
- Do not infer application code, services, tests, or infrastructure from documentation.
- Do not execute arbitrary generated code on a production host.
