# AGENTS.md

This repository is intentionally AI-agent friendly and was produced with substantial AI-assisted engineering.

## Mission

Keep this template mechanically eligible for the Scaffold-HBAR template programme while preserving its core promise: **a developer can add tamper-evident, privacy-preserving webhook audit records to an ordinary SaaS application without deploying a smart contract.**

## Non-negotiable rules

1. Never commit private keys, portal tokens, seed phrases, `.env`, `.env.local`, or production webhook secrets.
2. Never place a raw webhook payload or customer PII on Hedera. The on-ledger message contains a deterministic SHA-256 digest plus deliberately minimal metadata.
3. Treat Mirror Node data as the independent verification source; do not mark an event verified merely because the submit endpoint returned success.
4. Preserve deterministic canonicalisation. Changing it without a version bump can make historical proofs unverifiable.
5. Keep `GET /api/health` free of external dependencies so the eligibility gate can probe a healthy route locally.
6. Tests must cover canonicalisation stability, secret-field redaction, digest changes, and decoding Mirror Node messages.
7. If the HCS payload schema changes, increment `schemaVersion` and document backward-compatibility behaviour.

## Commands

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run self-check
```

For testnet evidence:

```bash
cp packages/nextjs/.env.example packages/nextjs/.env.local
# Add HEDERA_OPERATOR_ID and HEDERA_OPERATOR_PRIVATE_KEY
npm run topic:create
# Copy the printed topic id into HEDERA_AUDIT_TOPIC_ID
npm run evidence:create
npm run evidence:verify -- --transaction-id <transaction-id>
```

## Architecture

- `packages/nextjs/lib/audit/canonicalize.ts` normalises and redacts the application event.
- `packages/nextjs/lib/audit/proof.ts` creates the deterministic proof digest and HCS envelope.
- `packages/nextjs/lib/hedera/client.ts` creates a server-only Hedera SDK client.
- `packages/nextjs/lib/hedera/hcs.ts` creates topics and submits messages.
- `packages/nextjs/lib/hedera/mirror.ts` reads HCS messages from Hedera Mirror Node.
- `POST /api/audit` anchors an event proof.
- `GET /api/audit/[topicId]` reads independently indexed proofs.
- `POST /api/verify` recomputes a digest and verifies it against Mirror Node data.

## AI usage disclosure

AI agents may research, implement, refactor, test and document this repository. Human maintainers remain responsible for reviewing changes, protecting credentials and deciding what is submitted or deployed. Agent output is not accepted as evidence by itself; automated checks and Hedera/Mirror Node verification are the source of truth.
