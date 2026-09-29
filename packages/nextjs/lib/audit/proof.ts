import { createHash } from "node:crypto";
import { canonicalJson, redactAndCanonicalise } from "./canonicalize";

export type AuditEvent = {
  provider: string;
  eventType: string;
  externalId: string;
  occurredAt: string;
  payload: unknown;
};

export type ProofEnvelope = {
  schemaVersion: 1;
  kind: "verifiable-webhook";
  provider: string;
  eventType: string;
  externalId: string;
  occurredAt: string;
  digestAlgorithm: "sha256";
  digest: string;
};

function assertNonEmpty(name: string, value: unknown): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${name} is required`);
}

export function parseAuditEvent(input: unknown): AuditEvent {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Event must be a JSON object");
  const candidate = input as Record<string, unknown>;
  assertNonEmpty("provider", candidate.provider);
  assertNonEmpty("eventType", candidate.eventType);
  assertNonEmpty("externalId", candidate.externalId);
  assertNonEmpty("occurredAt", candidate.occurredAt);
  const date = new Date(candidate.occurredAt);
  if (Number.isNaN(date.getTime())) throw new Error("occurredAt must be an ISO date/time");

  return {
    provider: candidate.provider.trim(),
    eventType: candidate.eventType.trim(),
    externalId: candidate.externalId.trim(),
    occurredAt: date.toISOString(),
    payload: candidate.payload ?? null,
  };
}

export function createProof(input: unknown): { event: AuditEvent; redactedEvent: unknown; canonical: string; envelope: ProofEnvelope } {
  const event = parseAuditEvent(input);
  const redactedEvent = redactAndCanonicalise(event);
  const canonical = canonicalJson(event);
  const digest = createHash("sha256").update(canonical, "utf8").digest("hex");
  const envelope: ProofEnvelope = {
    schemaVersion: 1,
    kind: "verifiable-webhook",
    provider: event.provider,
    eventType: event.eventType,
    externalId: event.externalId,
    occurredAt: event.occurredAt,
    digestAlgorithm: "sha256",
    digest,
  };
  return { event, redactedEvent, canonical, envelope };
}

export function isProofEnvelope(value: unknown): value is ProofEnvelope {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ProofEnvelope>;
  return item.schemaVersion === 1 && item.kind === "verifiable-webhook" && item.digestAlgorithm === "sha256" && typeof item.digest === "string";
}
