import { Client, PrivateKey } from "@hiero-ledger/sdk";

export type HederaNetwork = "testnet" | "mainnet" | "previewnet";

export function getNetwork(): HederaNetwork {
  const value = (process.env.HEDERA_NETWORK ?? "testnet").toLowerCase();
  if (value === "mainnet" || value === "previewnet") return value;
  return "testnet";
}

export function hasOperatorCredentials(): boolean {
  return Boolean(process.env.HEDERA_OPERATOR_ID && process.env.HEDERA_OPERATOR_PRIVATE_KEY);
}

export function getHederaClient(): Client {
  const network = getNetwork();
  const client = network === "mainnet" ? Client.forMainnet() : network === "previewnet" ? Client.forPreviewnet() : Client.forTestnet();
  const accountId = process.env.HEDERA_OPERATOR_ID;
  const privateKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
  if (!accountId || !privateKey) throw new Error("Hedera operator credentials are not configured");
  const key = privateKey.startsWith("0x") ? PrivateKey.fromStringECDSA(privateKey.slice(2)) : PrivateKey.fromStringDer(privateKey);
  client.setOperator(accountId, key);
  return client;
}
