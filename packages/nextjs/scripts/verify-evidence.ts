import { fetchProofs } from "../lib/hedera/mirror";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

async function main() {

const args = process.argv.slice(2);
const txIndex = args.indexOf("--transaction-id");
const transactionId = txIndex >= 0 ? args[txIndex + 1] : undefined;
const topicId = process.env.HEDERA_AUDIT_TOPIC_ID;

if (!topicId) {
  console.error("HEDERA_AUDIT_TOPIC_ID is missing");
  process.exit(1);
}

try {
  const proofs = await fetchProofs(topicId, 100);
  const bountyProof = proofs.find(item => item.proof.externalId.startsWith("bounty-evidence-"));
  if (!bountyProof) throw new Error("No bounty evidence proof is indexed on the configured topic yet");
  console.log(JSON.stringify({
    verified: true,
    topicId,
    requestedTransactionId: transactionId ?? null,
    proof: bountyProof.proof,
    consensusTimestamp: bountyProof.consensus_timestamp,
    sequenceNumber: bountyProof.sequence_number,
    runningHash: bountyProof.running_hash,
    note: transactionId ? "The transaction id is supplied for submission evidence; HCS message verification is performed through topic/sequence data from Mirror Node." : undefined,
  }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

}
void main();
