import test from "node:test";
import assert from "node:assert/strict";
import {
  validatePatchProposal,
  computePatchDigest,
  verifyPatchApproval,
  evaluatePatchApplication
} from "../lib/patch-contract.mjs";

const baseRevision = "a".repeat(64);
const proposal = {
  schemaVersion: 1,
  proposalId: "proposal-001",
  taskId: "task-001",
  baseRevision,
  operations: [
    { op: "update", path: "src/main.js", content: "export const value = 2;\n" },
    { op: "create", path: "src/new.js", content: "export {};\n" }
  ]
};

test("accepts a bounded revision-pinned patch proposal", () => {
  const result = validatePatchProposal(proposal);
  assert.equal(result.ok, true);
  assert.equal(result.value.operations.length, 2);
});

test("rejects traversal, duplicate paths, unsupported operations and oversized patches", () => {
  const cases = [
    { ...proposal, operations: [{ op: "delete", path: "../secret" }] },
    { ...proposal, operations: [{ op: "delete", path: "src/a.js" }, { op: "delete", path: "src/a.js" }] },
    { ...proposal, operations: [{ op: "exec", path: "src/a.js" }] },
    { ...proposal, operations: [{ op: "update", path: "src/a.js", content: "x".repeat(1_000_001) }] }
  ];
  for (const candidate of cases) assert.equal(validatePatchProposal(candidate).ok, false);
});

test("patch digest is stable and changes when patch content changes", () => {
  const digest = computePatchDigest(proposal);
  assert.equal(digest.ok, true);
  assert.equal(computePatchDigest(proposal).digest, digest.digest);
  const modified = structuredClone(proposal);
  modified.operations[0].content += "// changed";
  assert.notEqual(computePatchDigest(modified).digest, digest.digest);
});

test("approval is bound to exact patch digest and expiry", () => {
  const digest = computePatchDigest(proposal).digest;
  const approval = {
    approved: true,
    approvedBy: "user-123",
    patchDigest: digest,
    expiresAt: "2099-01-01T00:00:00.000Z"
  };
  assert.equal(verifyPatchApproval(proposal, approval, 0).ok, true);
  assert.equal(verifyPatchApproval(proposal, { ...approval, patchDigest: "0".repeat(64) }, 0).reason, "approval-digest-mismatch");
  assert.equal(verifyPatchApproval(proposal, { ...approval, expiresAt: "2000-01-01T00:00:00.000Z" }, 0).reason, "approval-expired-or-invalid");
});

test("application gate rejects stale revisions and requires matching approval", () => {
  const digest = computePatchDigest(proposal).digest;
  const approval = {
    approved: true,
    approvedBy: "user-123",
    patchDigest: digest,
    expiresAt: "2099-01-01T00:00:00.000Z"
  };
  assert.equal(evaluatePatchApplication({
    currentRevision: "b".repeat(64), proposal, approval, now: 0
  }).reason, "revision-conflict");
  assert.equal(evaluatePatchApplication({
    currentRevision: baseRevision, proposal, approval: null, now: 0
  }).reason, "approval-required");
  assert.equal(evaluatePatchApplication({
    currentRevision: baseRevision, proposal, approval, now: 0
  }).ok, true);
});
