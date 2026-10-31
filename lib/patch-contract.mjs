import { createHash } from "node:crypto";
import { validateWorkspacePath } from "./path-policy.mjs";
import { checkRevisionBase } from "./workspace-manifest.mjs";

const MAX_OPERATIONS = 100;
const MAX_PATCH_BYTES = 5_000_000;
const ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const REVISION_PATTERN = /^[a-f0-9]{64}$/;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

export function validatePatchProposal(proposal) {
  const errors = [];
  if (!proposal || typeof proposal !== "object" || Array.isArray(proposal)) {
    return { ok: false, errors: ["proposal-must-be-an-object"] };
  }

  if (proposal.schemaVersion !== 1) errors.push("unsupported-schema-version");
  if (typeof proposal.proposalId !== "string" || !ID_PATTERN.test(proposal.proposalId)) errors.push("invalid-proposal-id");
  if (typeof proposal.taskId !== "string" || !ID_PATTERN.test(proposal.taskId)) errors.push("invalid-task-id");
  if (typeof proposal.baseRevision !== "string" || !REVISION_PATTERN.test(proposal.baseRevision)) errors.push("invalid-base-revision");
  if (!Array.isArray(proposal.operations) || proposal.operations.length === 0 || proposal.operations.length > MAX_OPERATIONS) {
    errors.push("invalid-operation-count");
  }

  if (errors.length) return { ok: false, errors };

  const seenPaths = new Set();
  const operations = [];
  let totalBytes = 0;

  for (const operation of proposal.operations) {
    if (!operation || typeof operation !== "object" || Array.isArray(operation)) {
      errors.push("invalid-operation");
      continue;
    }
    if (!["create", "update", "delete"].includes(operation.op)) {
      errors.push("unsupported-operation");
      continue;
    }

    const pathResult = validateWorkspacePath(operation.path);
    if (!pathResult.ok) {
      errors.push(`invalid-operation-path:${pathResult.reason}`);
      continue;
    }
    const path = pathResult.path;
    if (seenPaths.has(path)) {
      errors.push(`duplicate-operation-path:${path}`);
      continue;
    }
    seenPaths.add(path);

    if (operation.op === "delete") {
      if (Object.prototype.hasOwnProperty.call(operation, "content")) {
        errors.push(`delete-must-not-contain-content:${path}`);
        continue;
      }
      operations.push({ op: "delete", path });
      continue;
    }

    if (typeof operation.content !== "string") {
      errors.push(`content-required:${path}`);
      continue;
    }
    const sizeBytes = Buffer.byteLength(operation.content, "utf8");
    totalBytes += sizeBytes;
    if (sizeBytes > 1_000_000 || totalBytes > MAX_PATCH_BYTES) {
      errors.push(`patch-size-limit-exceeded:${path}`);
      continue;
    }
    operations.push({ op: operation.op, path, content: operation.content });
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      proposalId: proposal.proposalId,
      taskId: proposal.taskId,
      baseRevision: proposal.baseRevision,
      operations
    }
  };
}

export function computePatchDigest(proposal) {
  const validated = validatePatchProposal(proposal);
  if (!validated.ok) return { ok: false, errors: validated.errors };
  return {
    ok: true,
    digest: sha256(canonicalJson(validated.value))
  };
}

/**
 * An approval is bound to one immutable patch digest and expires.
 * This function verifies an approval record; it does not authenticate the approver.
 */
export function verifyPatchApproval(proposal, approval, now = Date.now()) {
  const digestResult = computePatchDigest(proposal);
  if (!digestResult.ok) return { ok: false, reason: "invalid-proposal", errors: digestResult.errors };
  if (!approval || approval.approved !== true) return { ok: false, reason: "approval-required" };
  if (typeof approval.approvedBy !== "string" || approval.approvedBy.length === 0) {
    return { ok: false, reason: "approver-required" };
  }
  if (approval.patchDigest !== digestResult.digest) return { ok: false, reason: "approval-digest-mismatch" };

  const expiresAt = Date.parse(approval.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return { ok: false, reason: "approval-expired-or-invalid" };
  }

  return { ok: true, digest: digestResult.digest };
}

export function evaluatePatchApplication({ currentRevision, proposal, approval, now = Date.now() }) {
  const validated = validatePatchProposal(proposal);
  if (!validated.ok) return { ok: false, reason: "invalid-proposal", errors: validated.errors };

  const revision = checkRevisionBase(currentRevision, validated.value.baseRevision);
  if (!revision.ok) return revision;

  const approvalResult = verifyPatchApproval(validated.value, approval, now);
  if (!approvalResult.ok) return approvalResult;

  return {
    ok: true,
    patchDigest: approvalResult.digest,
    operations: validated.value.operations
  };
}
