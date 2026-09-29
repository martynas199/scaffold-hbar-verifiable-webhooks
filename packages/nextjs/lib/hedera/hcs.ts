import { TopicCreateTransaction, TopicMessageSubmitTransaction } from "@hiero-ledger/sdk";
import type { ProofEnvelope } from "../audit/proof";
import { getHederaClient, getNetwork } from "./client";

export async function createAuditTopic(memo = "scaffold-hbar:verifiable-webhooks:v1") {
  const client = getHederaClient();
  try {
    const response = await new TopicCreateTransaction().setTopicMemo(memo).execute(client);
    const receipt = await response.getReceipt(client);
    const topicId = receipt.topicId?.toString();
    if (!topicId) throw new Error("Topic creation succeeded without a topic id");
    return { topicId, transactionId: response.transactionId.toString(), network: getNetwork() };
  } finally {
    client.close();
  }
}

export async function submitProof(topicId: string, envelope: ProofEnvelope) {
  if (!/^\d+\.\d+\.\d+$/.test(topicId)) throw new Error("HEDERA_AUDIT_TOPIC_ID must look like 0.0.xxxxx");
  const client = getHederaClient();
  try {
    const message = JSON.stringify(envelope);
    if (Buffer.byteLength(message, "utf8") > 1024) throw new Error("Proof envelope exceeds HCS single-message size limit");
    const response = await new TopicMessageSubmitTransaction().setTopicId(topicId).setMessage(message).execute(client);
    const receipt = await response.getReceipt(client);
    return {
      status: receipt.status.toString(),
      transactionId: response.transactionId.toString(),
      topicId,
      network: getNetwork(),
    };
  } finally {
    client.close();
  }
}
