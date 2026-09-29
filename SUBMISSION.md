# Scaffold-HBAR bounty submission worksheet

This file is deliberately safe to keep public. Do **not** paste private keys, portal tokens, wallet recovery phrases or webhook secrets here.

## Repository

`https://github.com/martynas199/scaffold-hbar-verifiable-webhooks`

## One-command scaffold

```bash
npx create-scaffold-hbar@latest --template martynas199/scaffold-hbar-verifiable-webhooks --solidity-framework none --frontend nextjs-app --package-manager npm
```

## Testnet evidence

Fill these from `npm run evidence:create`:

- Topic ID: `<0.0.xxxxx>`
- Hedera transaction ID: `<0.0.xxxxx@seconds.nanoseconds>`
- SHA-256 proof digest: `<digest>`
- Hashscan transaction: `https://hashscan.io/testnet/transaction/<transaction-id>`
- Mirror Node messages: `https://testnet.mirrornode.hedera.com/api/v1/topics/<topic-id>/messages?limit=10&order=desc`

## Suggested submission summary

**Verifiable Webhooks** is a Scaffold-HBAR template that lets ordinary SaaS applications anchor privacy-preserving audit proofs for payments, bookings, logistics, consent and other webhook-driven events. It deterministically redacts and canonicalises event data, commits only a SHA-256 proof envelope to Hedera Consensus Service, and independently verifies that proof through Hedera Mirror Node. No smart-contract deployment is required, and no customer PII is written to the public ledger.

The template is intentionally structured for developer adoption: a Next.js UI, server route handlers, isolated Hedera service modules, deterministic test fixtures, CLI evidence scripts, CI, security guidance and an AI-agent operating guide are included.

## AI use disclosure

Substantial AI-agent assistance was used for research, architecture, implementation, testing and documentation. The repository explicitly documents this in `AGENTS.md`. Automated checks and Hedera/Mirror Node evidence—not agent self-reporting—are used as the verification boundary.

## Before submission

1. Make the repository public under MIT.
2. Run a fresh scaffold using the public repository URL.
3. Run `npm install`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run self-check` from the fresh scaffold.
4. Run `npm run evidence:create` using a funded testnet operator.
5. Verify the resulting proof using `npm run evidence:verify -- --transaction-id ...`.
6. Add the public evidence URLs above.
7. Complete the official submission form and developer-experience survey.
