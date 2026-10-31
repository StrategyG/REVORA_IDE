import test from "node:test";
import assert from "node:assert/strict";
import { GET as healthz } from "../app/api/healthz/route.js";
import { GET as readyz } from "../app/api/readyz/route.js";

test("healthz reports process liveness without implying product readiness", async () => {
  const response = healthz();
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.status, "ok");
  assert.equal(payload.scope, "process-liveness-only");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("readyz fails closed while production dependencies are absent", async () => {
  const response = readyz();
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.status, "blocked");
  assert.equal(payload.productReady, false);
  assert.ok(Array.isArray(payload.missing));
  assert.ok(payload.missing.includes("durable database and workspace persistence"));
  assert.equal(response.headers.get("cache-control"), "no-store");
});
