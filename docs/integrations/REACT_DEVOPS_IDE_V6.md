# React DevOps IDE v6 integration

This integration keeps the standalone React DevOps IDE v6 separate from REVORA IDE's Next.js application. The source package is delivered as `react-devops-ide-v6-source.zip` and is not embedded in this PR; add it to the repository using the steps below. The workflow is deliberately configured to skip v6 jobs until the source directory exists.

## Add the v6 source package

Download `react-devops-ide-v6-source.zip` from the project conversation, then from the REVORA IDE repository root:

```bash
unzip react-devops-ide-v6-source.zip -d tools
git add tools/react-devops-ide-v6
git commit -m "feat: add React DevOps IDE v6 module"
git push
```

The archive expands to `tools/react-devops-ide-v6/`. It excludes `.env`, credentials, `node_modules`, runtime JSON state, and generated build output.

## Run locally

```bash
cd tools/react-devops-ide-v6
npm install
cp .env.example .env
npm start
```

Open `http://localhost:3000`. Keep `HOST=127.0.0.1` unless the service is behind an authenticated reverse proxy or VPN with TLS and network restrictions. Docker and Kubernetes mutations remain opt-in.

## GitHub Actions

The repository-level workflow is `.github/workflows/react-devops-ide-v6.yml`. Once the source directory is committed, it runs backend syntax checks and tests, workspace tests/build, npm audit, Trivy filesystem scanning, and a Docker build.

On `main`, a successful run can publish a commit-SHA-tagged GHCR image with SBOM and provenance. Staging and production deployment are manual only. GitHub requires a `workflow_dispatch` workflow to exist on the repository's default branch before it can be dispatched through the IDE; therefore, the CI/CD Center integration becomes dispatchable after this workflow reaches `main`.

Configure the IDE backend `.env` after the workflow is on the default branch:

```env
GITHUB_OWNER=StrategyG
GITHUB_REPO=REVORA_IDE
GITHUB_WORKFLOW_FILE=react-devops-ide-v6.yml
GITHUB_DEFAULT_REF=main
CICD_ALLOWED_REFS=main
GITHUB_TOKEN=YOUR_FINE_GRAINED_TOKEN
```

The token needs repository metadata read and Actions read/write permissions. Prefer a GitHub App installation token for team use. Never commit credentials.

## Staging prerequisites

- A trusted Linux self-hosted runner registered with labels `self-hosted, linux, x64, devops-staging`.
- Minikube reachable from that runner; set repository variable `STAGING_KUBE_CONTEXT` if the context is not `minikube`.
- Repository or `staging` environment secrets `GHCR_PULL_USER` and `GHCR_PULL_TOKEN` with package read permission.
- A dedicated, least-privilege kubeconfig for the runner account.

Run **Actions → React DevOps IDE v6 → Run workflow → staging**. The job deploys the immutable image digest, waits for rollout, and attempts rollback if verification fails.

## Production prerequisites

- A separate trusted runner labelled `devops-production`.
- Repository variable `PRODUCTION_KUBE_CONTEXT` and optional `PRODUCTION_K8S_NAMESPACE`.
- A GitHub Environment named `production` with required reviewers, deployment branch restrictions, and `GHCR_PULL_USER` / `GHCR_PULL_TOKEN` secrets.
- A separate production cluster identity with least-privilege namespace-scoped permissions.

Production is never triggered by a push. It requires manual workflow dispatch and protected GitHub Environment approval. Do not share the staging runner or kubeconfig with production.

## Operational boundaries

- A passing PR CI run proves validation/build only. It does not prove GitHub workflow dispatch, GHCR publication, self-hosted runner connectivity, or Kubernetes deployment.
- The backend's JSON run store is single-process local persistence; PostgreSQL/Redis and full multi-user RBAC are follow-on work.
- The standalone backend currently has no committed root lockfile. CI uses `npm install` and `npm audit`; dependency resolution is not yet fully reproducible. Commit a reviewed lockfile and switch to `npm ci` before production release.
- Keep the IDE backend local-only until full authentication, authorization, CSRF protection, rate limiting, and secret management are implemented.
