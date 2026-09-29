# Security

## Secrets

Use `packages/nextjs/.env.local` for testnet credentials. Never expose a Hedera private key through a variable prefixed with `NEXT_PUBLIC_`.

## Webhook authentication

This template demonstrates ledger proofing, not provider authentication. In production, verify the provider's signature (for example, Stripe's signature header) against the **raw request bytes** before constructing an audit proof.

## Public-ledger data

Assume every HCS message is permanently public. Only the minimal proof envelope is submitted. The canonicalised/redacted event is returned to the caller for demonstration but is not placed on Hedera.

## Digest semantics

A digest proves that the template saw a canonicalised/redacted representation. It does not prove that a third-party provider itself emitted the event unless provider signature verification is performed before anchoring.

## Key rotation

Rotate the Hedera operator key according to your deployment policy. If a topic uses a submit key, update the topic key separately. The default demo topic is intentionally simple and uses operator-authorised submission through the SDK.
