export function hashscanTransactionUrl(transactionId: string, network = "testnet"): string {
  const [accountId, validStart] = transactionId.split("@");
  if (!accountId || !validStart) return `https://hashscan.io/${network}/transaction/${encodeURIComponent(transactionId)}`;
  const [seconds, nanos] = validStart.split(".");
  if (!seconds || !nanos) return `https://hashscan.io/${network}/transaction/${encodeURIComponent(transactionId)}`;
  const tid = `${accountId}-${seconds}-${nanos}`;
  return `https://hashscan.io/${network}/transaction/${validStart}?tid=${tid}`;
}

export function hashscanTopicUrl(topicId: string, network = "testnet"): string {
  return `https://hashscan.io/${network}/topic/${topicId}`;
}
