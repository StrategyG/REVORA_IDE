import test from "node:test";
import assert from "node:assert/strict";
import { validateWorkspacePath } from "../lib/path-policy.mjs";

test("accepts ordinary relative workspace paths", () => {
  assert.deepEqual(validateWorkspacePath("src/main.js"), { ok: true, path: "src/main.js" });
  assert.deepEqual(validateWorkspacePath("README.md"), { ok: true, path: "README.md" });
});

test("rejects traversal, absolute and drive-qualified paths", () => {
  for (const path of ["../secret", "src/../secret", "/etc/passwd", "C:/secret", "//host/share"]) {
    assert.equal(validateWorkspacePath(path).ok, false, path);
  }
});

test("rejects Windows separators, control bytes and internal metadata folders", () => {
  for (const path of ["src\\main.js", "src/\0secret", ".git/config", "node_modules/pkg/index.js", ".next/cache/x"]) {
    assert.equal(validateWorkspacePath(path).ok, false, JSON.stringify(path));
  }
});

test("rejects empty, padded, oversized and malformed segments", () => {
  for (const path of ["", " src/file.js", "src/file.js ", "src//file.js", "a".repeat(241), "src/my file.js"]) {
    assert.equal(validateWorkspacePath(path).ok, false, JSON.stringify(path));
  }
});
