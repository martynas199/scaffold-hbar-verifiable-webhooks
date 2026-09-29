import { createProof } from "@/lib/audit/proof";
import { hasOperatorCredentials } from "@/lib/hedera/client";
import { submitProof } from "@/lib/hedera/hcs";
import { hashscanTransactionUrl, hashscanTopicUrl } from "@/lib/hedera/links";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input: unknown = await request.json();
    const proof = createProof(input);
    const shouldSubmit = new URL(request.url).searchParams.get("submit") === "true";

    if (!shouldSubmit) {
      return Response.json({ mode: "preview", redactedEvent: proof.redactedEvent, envelope: proof.envelope });
    }

    if (!hasOperatorCredentials()) {
      return Response.json({ error: "Hedera operator credentials are not configured; use preview mode or configure .env.local" }, { status: 503 });
    }

    const topicId = process.env.HEDERA_AUDIT_TOPIC_ID;
    if (!topicId) return Response.json({ error: "HEDERA_AUDIT_TOPIC_ID is not configured" }, { status: 503 });

    const submitted = await submitProof(topicId, proof.envelope);
    return Response.json({
      mode: "submitted",
      redactedEvent: proof.redactedEvent,
      envelope: proof.envelope,
      ...submitted,
      hashscanTransactionUrl: hashscanTransactionUrl(submitted.transactionId, submitted.network),
      hashscanTopicUrl: hashscanTopicUrl(topicId, submitted.network),
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unable to process event";
    return Response.json({ error: message }, { status: 400 });
  }
}
