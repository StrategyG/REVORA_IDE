import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWorkspaceManifest,
  verifyWorkspaceManifest,
  checkRevisionBase
} from "../lib/workspace-manifest.mjs";

const revisionA = "a".repeat(64);
const revisionB = "b".repeat(64);

test("workspace manifest is deterministic regardless of input key order", () => {
  const first = buildWorkspaceManifest({ "src/b.js": "b", "README.md": "hello" });
  const second = buildWorkspaceManifest({ "README.md": "hello", "src/b.js": "b" });
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.manifest.digest, second.manifest.digest);
});

test("manifest detects changed content and changed file inventory", () => {
  const manifest = buildWorkspaceManifest({ "src/main.js": "console.log(1)" });
  assert.equal(verifyWorkspaceManifest(manifest.manifest, { "src/main.js": "console.log(2)" }).reason, "manifest-digest-mismatch");
  assert.equal(verifyWorkspaceManifest(manifest.manifest, { "src/other.js": "console.log(1)" }).reason, "manifest-digest-mismatch");
});

test("manifest rejects unsafe paths, non-text content and quota violations", () => {
  assert.equal(buildWorkspaceManifest({ "../secret": "x" }).ok, false);
  assert.equal(buildWorkspaceManifest({ "src/file.bin": Buffer.from([1, 2]) }).ok, false);
  assert.equal(buildWorkspaceManifest({ "large.txt": "x".repeat(11) }, {
    maxFiles: 2, maxFileBytes: 10, maxTotalBytes: 20
  }).ok, false);
});

test("manifest verification succeeds for exact original workspace", () => {
  const files = { "README.md": "revora", "src/main.js": "export {};" };
  const manifest = buildWorkspaceManifest(files);
  assert.deepEqual(verifyWorkspaceManifest(manifest.manifest, files), {
    ok: true,
    digest: manifest.manifest.digest
  });
});

test("revision base rejects stale writes and malformed revisions", () => {
  assert.deepEqual(checkRevisionBase(revisionA, revisionA), { ok: true });
  assert.deepEqual(checkRevisionBase(revisionB, revisionA), { ok: false, reason: "revision-conflict" });
  assert.deepEqual(checkRevisionBase("not-a-hash", revisionA), { ok: false, reason: "invalid-revision-format" });
});
