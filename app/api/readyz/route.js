export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  // Deliberately fail closed: backend dependencies do not exist in this foundation.
  return Response.json(
    {
      status: "blocked",
      productReady: false,
      missing: [
        "server-side authentication and project authorization",
        "durable database and workspace persistence",
        "revision and optimistic-concurrency service",
        "production secret management",
        "AI gateway with reviewed patch lifecycle",
        "isolated execution sandbox",
        "observability, backup and restore verification"
      ]
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
