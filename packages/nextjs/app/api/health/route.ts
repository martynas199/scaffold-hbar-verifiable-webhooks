export const runtime = "nodejs";

export async function GET() {
  return Response.json({ ok: true, service: "verifiable-webhooks", version: 1 });
}
