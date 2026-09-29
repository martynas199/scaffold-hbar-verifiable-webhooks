import { createProof } from "../lib/audit/proof";
import { getNetwork } from "../lib/hedera/client";
import { submitProof } from "../lib/hedera/hcs";
import { hashscanTopicUrl, hashscanTransactionUrl } from "../lib/hedera/links";
import { getMirrorBase } from "../lib/hedera/mirror";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

async function main() {

const topicId = process.env.HEDERA_AUDIT_TOPIC_ID;
if (!topicId) {
  console.error("HEDERA_AUDIT_TOPIC_ID is missing. Run npm run topic:create first and add the id to .env.local.");
  process.exit(1);
}

const event = {
  provider: "demo-payments",
  eventType: "payment.captured",
  externalId: `bounty-evidence-${new Date().toISOString().slice(0, 10)}`,
  occurredAt: new Date().toISOString(),
  payload: {
    amount: 2500,
    currency: "gbp",
    status: "captured",
    customer_email: "redacted-before-hashing@example.com",
    note: "Scaffold-HBAR bounty evidence",
  },
};

try {
  const proof = createProof(event);
  const submitted = await submitProof(topicId, proof.envelope);
  const network = getNetwork();
  console.log(JSON.stringify({
    event,
    redactedEvent: proof.redactedEvent,
    envelope: proof.envelope,
    topicId,
    transactionId: submitted.transactionId,
    hashscanTransactionUrl: hashscanTransactionUrl(submitted.transactionId, network),
    hashscanTopicUrl: hashscanTopicUrl(topicId, network),
    mirrorNodeUrl: `${getMirrorBase(network)}/api/v1/topics/${topicId}/messages?limit=10&order=desc`,
  }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

}
void main();
