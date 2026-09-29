import { createProof } from "@/lib/audit/proof";
import { fetchProofs } from "@/lib/hedera/mirror";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { topicId?: unknown; event?: unknown };
    if (typeof body.topicId !== "string") throw new Error("topicId is required");
    const expected = createProof(body.event).envelope;
    const messages = await fetchProofs(body.topicId, 100);
    const match = messages.find(item => item.proof.digest === expected.digest);
    return Response.json({
      verified: Boolean(match),
      expected,
      consensus: match ? {
        timestamp: match.consensus_timestamp,
        sequenceNumber: match.sequence_number,
        runningHash: match.running_hash,
      } : null,
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unable to verify proof";
    return Response.json({ error: message }, { status: 400 });
  }
}
