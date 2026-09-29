# Verifiable Webhooks — Scaffold-HBAR Template

A production-oriented **Next.js + Hedera Consensus Service (HCS)** starter for ordinary SaaS teams that need to prove an external event existed in a specific form at a specific time without putting the sensitive event itself on a public ledger.

Typical uses include payment webhooks, booking confirmations, logistics status changes, consent events, order fulfilment events and other audit-sensitive application activity.

## Why Hedera is load-bearing here

The core guarantee is provided by Hedera Consensus Service, not by a local database:

1. The application deterministically canonicalises an incoming event.
2. Sensitive keys are redacted before hashing.
3. A SHA-256 digest is created from the canonical payload.
4. A minimal proof envelope is submitted to an HCS topic.
5. Verification independently reads the consensus message from a Hedera Mirror Node and recomputes the digest from the candidate event.

The raw event can stay in your normal application database. Hedera provides the independently timestamped, ordered proof.

## Scaffold it

Create a project from this public repository:

```bash
npx create-scaffold-hbar@latest --template martynas199/scaffold-hbar-verifiable-webhooks --solidity-framework none --frontend nextjs-app --package-manager npm
```

The template declares Next.js, no Solidity framework and npm in `template.json`.

## Requirements

- Node.js 20.18.3+
- npm 10+
- A Hedera testnet account only for write operations and evidence generation

Read-only Mirror Node verification needs no Hedera private key.

## Quick start

```bash
npm install
cp packages/nextjs/.env.example packages/nextjs/.env.local
npm run dev
```

Open `http://localhost:3000`.

The UI works in two modes:

- **Preview mode** without credentials: canonicalise and hash a demo event locally through the API.
- **Testnet mode** with operator credentials and a topic id: submit the proof to HCS, then verify it independently through Mirror Node.


### Working on the template repository itself

The source repository follows Scaffold-HBAR's official Yarn workspace convention so the CLI can safely rewrite it when a user chooses npm. For source development:

```bash
corepack enable
yarn install
yarn typecheck
yarn lint
yarn test
yarn build
```

A project created with the template defaults to **npm**, so the generated project uses the `npm run ...` commands shown elsewhere in this README.

## Testnet setup

### 1. Add operator credentials

Edit `packages/nextjs/.env.local`:

```dotenv
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_PRIVATE_KEY=302e...
HEDERA_AUDIT_TOPIC_ID=
```

Never commit this file.

### 2. Create an HCS audit topic

```bash
npm run topic:create
```

The script prints a topic id and Hashscan URL. Put the topic id in `HEDERA_AUDIT_TOPIC_ID`.

### 3. Create adjudication evidence

```bash
npm run evidence:create
```

This submits a deterministic demonstration event and prints:

- Hedera transaction id
- HCS topic id
- proof digest
- Hashscan transaction URL
- Mirror Node topic URL

Save those public URLs in the bounty submission. No secret is written to the repository.

### 4. Verify evidence independently

```bash
npm run evidence:verify -- --transaction-id 0.0.xxxxx@1234567890.000000000
```

The verifier queries the public testnet Mirror Node and fails if it cannot find the matching digest.

## API

### `GET /api/health`

Local health route. It intentionally requires neither Hedera nor environment variables.

### `POST /api/audit?submit=false`

Canonicalises, redacts and hashes an event without submitting a transaction.

Example body:

```json
{
  "provider": "stripe",
  "eventType": "payment_intent.succeeded",
  "externalId": "evt_demo_001",
  "occurredAt": "2026-09-29T12:00:00.000Z",
  "payload": {
    "amount": 2500,
    "currency": "gbp",
    "customer_email": "customer@example.com",
    "status": "succeeded"
  }
}
```

The email is redacted before the digest is created.

### `POST /api/audit?submit=true`

Creates the same proof and submits its envelope to `HEDERA_AUDIT_TOPIC_ID`. Requires server-side operator credentials.

### `GET /api/audit/{topicId}`

Returns decoded proof envelopes indexed by the Hedera Mirror Node.

### `POST /api/verify`

Recomputes the digest from a candidate event and checks the HCS messages for a matching proof.

## Privacy model

This template intentionally does **not** anchor a raw webhook body. By default it recursively redacts keys matching patterns such as:

- email
- phone
- address
- name
- token
- secret
- password
- authorization
- card

You should extend the denylist for your own domain. The redacted structure is hashed deterministically, so two semantically identical JSON objects with different key ordering produce the same digest.

## Proof envelope

HCS receives a compact JSON document:

```json
{
  "schemaVersion": 1,
  "kind": "verifiable-webhook",
  "provider": "stripe",
  "eventType": "payment_intent.succeeded",
  "externalId": "evt_demo_001",
  "occurredAt": "2026-09-29T12:00:00.000Z",
  "digestAlgorithm": "sha256",
  "digest": "..."
}
```

The consensus timestamp, sequence number and running hash are supplied by Hedera/Mirror Node.

## Quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run self-check
```

CI runs the same checks on every push and pull request.

## Security notes

- Server operator credentials are never exposed through `NEXT_PUBLIC_*` variables.
- API responses never return the private key.
- Raw event bodies are not submitted to HCS.
- The public template contains only `.env.example` placeholders.
- Production webhook authentication is provider-specific and deliberately left as an adapter boundary; verify the provider signature **before** calling the proof function.

See `SECURITY.md` for deployment guidance.

## Bounty eligibility checklist

- [x] `template.json` present
- [x] `README.md` present
- [x] `AGENTS.md` present
- [x] MIT licence
- [x] Next.js app and health route
- [x] Hedera Consensus Service integration
- [x] Mirror Node independent verification
- [x] No committed secrets or `.env`
- [x] Install/lint/test/build scripts
- [x] Public GitHub repository URL
- [ ] Real testnet transaction + Hashscan/Mirror Node evidence
- [ ] Final developer-experience survey/submission

The remaining items are account-bound publication/evidence steps and are documented in `SUBMISSION.md`.

## License

MIT
