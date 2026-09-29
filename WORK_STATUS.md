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

## Publication and public scaffold verification

- Public repository created: https://github.com/martynas199/scaffold-hbar-verifiable-webhooks
- Source uploaded to main.
- Public `create-scaffold-hbar` generation completed successfully with explicit frontend, Solidity-framework and package-manager options.
- Fresh generated-project dependency install, typecheck, lint, all 6 tests, production build and self-check passed.
- Fixed ESLint global ignores for generated Next.js declarations and build output after the fresh scaffold exposed a lint failure.

## Still required

1. Create or sign in to a Hedera testnet account; signup requires the user's email verification and agreement to terms.
2. Configure testnet operator credentials securely, create the topic, submit the demo proof and independently verify Mirror Node evidence.
3. Add public evidence to SUBMISSION.md and complete the official submission/survey.

No live testnet evidence, bounty submission or payout has been completed. Do not put the Hedera private key in GitHub or the submission.
