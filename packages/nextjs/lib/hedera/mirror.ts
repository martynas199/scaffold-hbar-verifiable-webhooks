import { isProofEnvelope, type ProofEnvelope } from "../audit/proof";
export type MirrorNetwork = "testnet" | "mainnet" | "previewnet";

const DEFAULT_MIRROR: Record<MirrorNetwork, string> = {
  testnet: "https://testnet.mirrornode.hedera.com",
  mainnet: "https://mainnet-public.mirrornode.hedera.com",
  previewnet: "https://previewnet.mirrornode.hedera.com",
};

export type MirrorTopicMessage = {
  consensus_timestamp: string;
  topic_id: string;
  message: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
};

export type DecodedProof = MirrorTopicMessage & { proof: ProofEnvelope };

type MirrorResponse = { messages?: MirrorTopicMessage[]; links?: { next?: string | null } };

function currentMirrorNetwork(): MirrorNetwork {
  const value = (process.env.HEDERA_NETWORK ?? "testnet").toLowerCase();
  if (value === "mainnet" || value === "previewnet") return value;
  return "testnet";
}

export function getMirrorBase(network: MirrorNetwork = currentMirrorNetwork()): string {
  if (network === "testnet" && process.env.HEDERA_MIRROR_TESTNET_URL) return process.env.HEDERA_MIRROR_TESTNET_URL.replace(/\/$/, "");
  return DEFAULT_MIRROR[network];
}

export function decodeProofMessage(message: MirrorTopicMessage): DecodedProof | null {
  try {
    const decoded = Buffer.from(message.message, "base64").toString("utf8");
    const parsed: unknown = JSON.parse(decoded);
    return isProofEnvelope(parsed) ? { ...message, proof: parsed } : null;
  } catch {
    return null;
  }
}

export async function fetchProofs(topicId: string, limit = 25): Promise<DecodedProof[]> {
  if (!/^\d+\.\d+\.\d+$/.test(topicId)) throw new Error("Invalid Hedera topic id");
  const capped = Math.max(1, Math.min(limit, 100));
  const response = await fetch(`${getMirrorBase()}/api/v1/topics/${encodeURIComponent(topicId)}/messages?limit=${capped}&order=desc`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Mirror Node request failed (${response.status})`);
  const data = (await response.json()) as MirrorResponse;
  return (data.messages ?? []).map(decodeProofMessage).filter((item): item is DecodedProof => item !== null);
}
