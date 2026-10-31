# REVORA IDE

REVORA IDE is currently at the **repository audit and architecture-definition stage**. The remote repository contains documentation only; an application implementation has not yet been verified.

## Current status

- **Stage 0 — Repository Audit:** PASS (remote repository audit scope).
- **Stage 1 — Architecture and Data Contract:** NOT STARTED.
- **Application implementation / build / automated tests:** BLOCKED — no application source or executable project manifest has been verified.
- **Production readiness:** NOT READY.
- **Default branch:** `main` (bootstrap README only).
- **Current audit branch:** `docs/stage0-repository-audit-v42`.

## Current audit package

The authoritative Stage 0 audit and completion evidence are maintained here:

- [Stage 0 audit package](REVORA_IDE_STAGE0_AUDIT/README.md)
- [Stage 0 completion report](REVORA_IDE_STAGE0_AUDIT/STAGE0_COMPLETION_REPORT.md)
- [Repository audit](REVORA_IDE_STAGE0_AUDIT/EDITOR_AUDIT.md)
- [Observed and target architecture map](REVORA_IDE_STAGE0_AUDIT/EDITOR_ARCHITECTURE_MAP.md)
- [Implementation gap analysis](REVORA_IDE_STAGE0_AUDIT/EDITOR_IMPLEMENTATION_GAP.md)
- [Stage 0 acceptance matrix](REVORA_IDE_STAGE0_AUDIT/EDITOR_ACCEPTANCE_MATRIX.md)

## Earlier discovery notes

`REVORA_IDE_STAGE1_AUDIT/` contains earlier discovery and proposed design notes created against the initial bootstrap state. They are retained as historical inputs, not treated as the current repository inventory or as proof that any capability is implemented.

Start with the Stage 0 package for the verified current baseline. Reconcile and promote applicable design proposals during Stage 1 — Architecture and Data Contract.

## Change-control policy

- Audit and design work stays on a dedicated branch.
- Do not merge into `main`, deploy, or claim production readiness without explicit authorization and passing evidence-based gates.
- Do not infer application code, services, tests, or infrastructure from design documents.
