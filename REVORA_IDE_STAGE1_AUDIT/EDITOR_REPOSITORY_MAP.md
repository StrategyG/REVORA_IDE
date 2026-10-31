> **CURRENT-STATE CORRECTION (2026-10-31):** This document records an earlier bootstrap-state snapshot. The current audit branch `docs/stage0-repository-audit-v42` contains documentation-only audit packages, including `REVORA_IDE_STAGE0_AUDIT/` and the retained historical notes in this directory. The default branch `main` still contains only its bootstrap README. No application source, executable project manifest, test harness, or deployment implementation has been verified. Stage 0 is **PASS** for remote audit scope; Stage 1 — Architecture and Data Contract — is **NOT STARTED**. See [the current Stage 0 completion report](../REVORA_IDE_STAGE0_AUDIT/STAGE0_COMPLETION_REPORT.md). The historical analysis below is retained as context and is not the current branch inventory.\n\n---\n\n# REVORA IDE — Repository Map

## Observed remote state

`StrategyG/REVORA_IDE` is public, not archived, repository size 0, with `main` reported as default-branch metadata. The contents endpoint says the repository is empty; branch listing is empty; commit listing reports that the Git repository is empty.

```text
StrategyG/REVORA_IDE/
└── [NO FILES — GitHub reports empty repository]
```

## Required map when source is available

```text
/
├── apps/                  # product applications (only if justified)
├── frontend/              # editor client / application shell
├── backend/               # modular API application
├── workers/               # asynchronous tasks and isolated execution adapters
├── packages/              # shared contracts, types, and reusable libraries
├── database/              # migrations, schema, seed/test fixtures
├── infra/                 # IaC and runtime definitions
├── .github/workflows/     # CI/CD workflows
├── docs/                  # architecture, operations, security, ADRs
├── tests/                 # unit, integration, E2E, security, regression
└── manifests/config       # language and toolchain manifests
```

This is a **proposed logical layout**, not the current repository structure. Do not create all directories mechanically; Stage 2 should choose a layout that fits the selected stack.

## Discovery inventory

| Discovery target | Result |
|---|---|
| Root directories/files | None returned; repository empty |
| README / documentation | Not available |
| Frontend manifests | Not available |
| Backend manifests | Not available |
| Lockfiles | Not available |
| Database migrations | Not available |
| API definitions | Not available |
| Tests and fixtures | Not available |
| CI workflows | Not available in the empty repository; workflow endpoint could not be independently queried through the available read surface |
| Deployment/IaC | Not available |
| Editor modules | Not available |

## Working tree caveat

A remote GitHub API view cannot establish whether a user's local clone contains unstaged, staged, or untracked files. Local working-tree status is **NOT VERIFIED** and must be checked from the actual clone with `git status --short --branch` before any future implementation begins.
