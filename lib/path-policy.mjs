const FORBIDDEN_SEGMENTS = new Set([".", "..", ".git", ".next", "node_modules"]);

export function validateWorkspacePath(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 240) {
    return { ok: false, reason: "invalid-length-or-type" };
  }

  if (value !== value.trim() || value.includes("\\") || value.includes("\0")) {
    return { ok: false, reason: "invalid-characters" };
  }

  if (value.startsWith("/") || value.startsWith("//") || /^[a-zA-Z]:/.test(value)) {
    return { ok: false, reason: "absolute-path-not-allowed" };
  }

  const segments = value.split("/");
  if (segments.some((segment) => segment.length === 0 || FORBIDDEN_SEGMENTS.has(segment))) {
    return { ok: false, reason: "unsafe-path-segment" };
  }

  if (segments.some((segment) => segment.length > 100 || !/^[a-zA-Z0-9._@+-]+$/.test(segment))) {
    return { ok: false, reason: "unsupported-path-segment" };
  }

  return { ok: true, path: segments.join("/") };
}
