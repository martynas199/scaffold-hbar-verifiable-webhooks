import { fetchProofs } from "@/lib/hedera/mirror";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await context.params;
    const proofs = await fetchProofs(topicId, 50);
    return Response.json({ topicId, count: proofs.length, proofs });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unable to read topic";
    return Response.json({ error: message }, { status: 400 });
  }
}
