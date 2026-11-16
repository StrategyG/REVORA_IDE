# React DevOps IDE v6 source package

The complete application source is delivered as `react-devops-ide-v6-source.zip`.

## Add the source

Upload the ZIP to `tools/react-devops-ide-v6-source.zip` in the repository and commit it. The dedicated GitHub Actions workflow automatically extracts it for validation and deployment. Alternatively, extract it locally into `tools/` so this directory contains `package.json`, `server.js`, `public/`, `lib/`, and `workspace/`.

See [the integration guide](../../docs/integrations/REACT_DEVOPS_IDE_V6.md).

The source archive excludes local credentials, `.env`, `node_modules`, runtime JSON state, and generated build output.
