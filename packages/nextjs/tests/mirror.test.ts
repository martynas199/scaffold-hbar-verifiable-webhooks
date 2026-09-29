import assert from "node:assert/strict";
import test from "node:test";
import { decodeProofMessage, type MirrorTopicMessage } from "../lib/hedera/mirror";

const envelope = {
  schemaVersion: 1,
  kind: "verifiable-webhook",
  provider: "stripe",
  eventType: "payment_intent.succeeded",
  externalId: "evt_1",
  occurredAt: "2026-09-29T12:00:00.000Z",
  digestAlgorithm: "sha256",
  digest: "a".repeat(64),
};

const base: MirrorTopicMessage = {
  consensus_timestamp: "123.456",
  topic_id: "0.0.123",
  message: Buffer.from(JSON.stringify(envelope)).toString("base64"),
  running_hash: "hash",
  running_hash_version: 3,
  sequence_number: 1,
};

test("decodes a valid proof envelope from Mirror Node base64", () => {
  const decoded = decodeProofMessage(base);
  assert.equal(decoded?.proof.digest, envelope.digest);
});

test("ignores malformed topic messages", () => {
  assert.equal(decodeProofMessage({ ...base, message: "not base64 json" }), null);
});
