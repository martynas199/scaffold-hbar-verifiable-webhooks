# Work status

## Completed

- Scaffold-HBAR-compatible `template.json`
- Source layout aligned to the official `@sh/nextjs` workspace convention
- npm selected as the default generated-project package manager
- Next.js App Router demo UI
- Deterministic event canonicalisation
- Recursive sensitive-field redaction
- SHA-256 proof envelope
- Hedera Consensus Service topic creation
- HCS proof submission
- Hedera Mirror Node topic reads and decoding
- Independent candidate-event verification API
- Health endpoint
- Testnet evidence scripts
- Hashscan/Mirror Node evidence links
- Unit tests for canonicalisation/redaction/digest and Mirror Node decoding
- GitHub Actions CI
- MIT licence
- README, security guidance, AGENTS.md and submission worksheet
- Local manifest/secret-file self-check
- TypeScript/TSX syntax parse verification
- Local logic tests: 6/6 passing
- Simulated Scaffold-HBAR Yarn→npm workspace-script conversion
- Generated-project self-check after `template.json` removal

## Not falsely claimed

Work Mode verification on 29 September 2026 (Node 24.19.0, npm 11.9.0):

- Fresh `npm install`: passed (410 packages); npm lockfile included.
- `npm run typecheck --workspace=@sh/nextjs`: passed.
- `npm run lint --workspace=@sh/nextjs`: passed.
- `npm test --workspace=@sh/nextjs`: 6/6 passed.
- `npm run build --workspace=@sh/nextjs`: passed with Next.js 15.5.26.
- `node scripts/self-check.mjs`: passed.
- Test script now uses `node --import tsx --test` to avoid the tsx CLI IPC requirement.

Not yet verified: public-repository scaffold generation, live HTTP smoke test, Hedera testnet transaction and Mirror Node evidence. GitHub returned 404 for the intended repository; the available GitHub integration has no repository-creation operation. No submission or payout has been completed.

## Account-bound steps still required

1. Create a new public GitHub repository named `scaffold-hbar-verifiable-webhooks` under `martynas199` (the connected GitHub tools can edit repositories but cannot create one).
2. Push this prepared repository into it.
3. Run the public one-command scaffold and full install/lint/typecheck/test/build gate.
4. Create or use a funded Hedera **testnet** operator account. Account creation requires accepting Hedera's terms and controlling the testnet private key.
5. Run `topic:create`, add the topic id to `.env.local`, then run `evidence:create` and `evidence:verify`.
6. Paste the public Hashscan/Mirror Node evidence into `SUBMISSION.md` and submit the official form/dev-ex survey.

Do not put the Hedera private key in GitHub, this document, or the bounty submission.
