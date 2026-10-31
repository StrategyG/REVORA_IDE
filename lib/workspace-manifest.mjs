import { createHash } from "node:crypto";
import { validateWorkspacePath } from "./path-policy.mjs";

export const DEFAULT_WORKSPACE_LIMITS = Object.freeze({
  maxFiles: 500,
  maxFileBytes: 1_000_000,
  maxTotalBytes: 20_000_000
});

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

/**
 * Builds a deterministic, content-addressed manifest.
 * This is a domain contract only; persistence and authorization belong to the server layer.
 */
export function buildWorkspaceManifest(files, limits = DEFAULT_WORKSPACE_LIMITS) {
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    return { ok: false, errors: ["files-must-be-an-object"] };
  }

  const entries = Object.entries(files);
  if (entries.length > limits.maxFiles) {
    return { ok: false, errors: ["workspace-file-limit-exceeded"] };
  }

  const normalized = [];
  const errors = [];
  let totalBytes = 0;

  for (const [path, content] of entries) {
    const pathResult = validateWorkspacePath(path);
    if (!pathResult.ok) {
      errors.push(`invalid-path:${pathResult.reason}`);
      continue;
    }
    if (typeof content !== "string") {
      errors.push(`non-text-content:${path}`);
      continue;
    }

    const sizeBytes = Buffer.byteLength(content, "utf8");
    if (sizeBytes > limits.maxFileBytes) {
      errors.push(`file-size-limit-exceeded:${path}`);
      continue;
    }

    totalBytes += sizeBytes;
    if (totalBytes > limits.maxTotalBytes) {
      errors.push("workspace-total-size-limit-exceeded");
      break;
    }

    normalized.push({
      path: pathResult.path,
      sizeBytes,
      sha256: sha256(content)
    });
  }

  if (errors.length) return { ok: false, errors };
  normalized.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

  const payload = {
    schemaVersion: 1,
    files: normalized,
    totalBytes
  };

  return {
    ok: true,
    manifest: {
      ...payload,
      digest: sha256(canonicalJson(payload))
    }
  };
}

export function verifyWorkspaceManifest(manifest, files, limits = DEFAULT_WORKSPACE_LIMITS) {
  if (!manifest || typeof manifest !== "object" || manifest.schemaVersion !== 1) {
    return { ok: false, reason: "unsupported-manifest" };
  }

  const rebuilt = buildWorkspaceManifest(files, limits);
  if (!rebuilt.ok) return { ok: false, reason: "invalid-workspace", errors: rebuilt.errors };

  if (typeof manifest.digest !== "string" || !/^[a-f0-9]{64}$/.test(manifest.digest)) {
    return { ok: false, reason: "invalid-manifest-digest" };
  }
  if (rebuilt.manifest.digest !== manifest.digest) {
    return { ok: false, reason: "manifest-digest-mismatch" };
  }
  if (manifest.totalBytes !== rebuilt.manifest.totalBytes) {
    return { ok: false, reason: "manifest-total-size-mismatch" };
  }

  if (canonicalJson(rebuilt.manifest.files) !== canonicalJson(manifest.files)) {
    return { ok: false, reason: "manifest-file-list-mismatch" };
  }

  return { ok: true, digest: rebuilt.manifest.digest };
}

export function checkRevisionBase(currentRevision, expectedBaseRevision) {
  if (typeof currentRevision !== "string" || typeof expectedBaseRevision !== "string") {
    return { ok: false, reason: "revision-required" };
  }
  if (!/^[a-f0-9]{64}$/.test(currentRevision) || !/^[a-f0-9]{64}$/.test(expectedBaseRevision)) {
    return { ok: false, reason: "invalid-revision-format" };
  }
  if (currentRevision !== expectedBaseRevision) {
    return { ok: false, reason: "revision-conflict" };
  }
  return { ok: true };
}
