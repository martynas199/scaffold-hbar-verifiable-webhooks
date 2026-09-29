import assert from "node:assert/strict";
import test from "node:test";
import { canonicalJson, redactAndCanonicalise, REDACTED } from "../lib/audit/canonicalize";
import { createProof } from "../lib/audit/proof";

const base = {
  provider: "stripe",
  eventType: "payment_intent.succeeded",
  externalId: "evt_1",
  occurredAt: "2026-09-29T12:00:00.000Z",
  payload: { amount: 2500, currency: "gbp", customer_email: "a@example.com" },
};

test("canonical JSON is independent of object key insertion order", () => {
  const one = { b: 2, a: { d: 4, c: 3 } };
  const two = { a: { c: 3, d: 4 }, b: 2 };
  assert.equal(canonicalJson(one), canonicalJson(two));
});

test("sensitive keys are recursively redacted", () => {
  assert.deepEqual(redactAndCanonicalise({ user: { email: "x@y.z", card_number: "4242", amount: 10 } }), {
    user: { amount: 10, card_number: REDACTED, email: REDACTED },
  });
});

test("changing non-sensitive content changes the digest", () => {
  const first = createProof(base).envelope.digest;
  const second = createProof({ ...base, payload: { ...base.payload, amount: 2600 } }).envelope.digest;
  assert.notEqual(first, second);
});

test("changing only a redacted value does not change the digest", () => {
  const first = createProof(base).envelope.digest;
  const second = createProof({ ...base, payload: { ...base.payload, customer_email: "different@example.com" } }).envelope.digest;
  assert.equal(first, second);
});
