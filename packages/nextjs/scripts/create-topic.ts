import { createAuditTopic } from "../lib/hedera/hcs";
import { hashscanTopicUrl, hashscanTransactionUrl } from "../lib/hedera/links";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

try {
  const result = await createAuditTopic();
  console.log(JSON.stringify({
    ...result,
    hashscanTopicUrl: hashscanTopicUrl(result.topicId, result.network),
    hashscanTransactionUrl: hashscanTransactionUrl(result.transactionId, result.network),
    next: `Set HEDERA_AUDIT_TOPIC_ID=${result.topicId} in packages/nextjs/.env.local`,
  }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
