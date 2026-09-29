import { AuditDemo } from "@/components/AuditDemo";

export default function Home() {
  return (
    <main className="shell">
      <div className="eyebrow">Scaffold-HBAR template</div>
      <h1>Prove critical SaaS events without publishing customer data.</h1>
      <p className="lead">
        Verifiable Webhooks turns a normal payment, booking or logistics event into a deterministic SHA-256 proof,
        anchors the proof to Hedera Consensus Service, and verifies it independently through the Hedera Mirror Node.
      </p>

      <section className="grid" aria-label="How it works">
        <article className="card">
          <strong>1 · Redact + canonicalise</strong>
          <p>Known sensitive fields are removed and JSON keys are deterministically ordered before hashing.</p>
        </article>
        <article className="card">
          <strong>2 · Anchor to HCS</strong>
          <p>Only a compact proof envelope is submitted. The original webhook stays in your application.</p>
        </article>
        <article className="card">
          <strong>3 · Verify independently</strong>
          <p>Mirror Node data supplies the consensus timestamp, sequence and immutable message used for verification.</p>
        </article>
      </section>

      <AuditDemo />

      <footer>
        Test locally with no credentials. Add a funded Hedera testnet operator and <code className="inline">HEDERA_AUDIT_TOPIC_ID</code> to submit real proofs.
      </footer>
    </main>
  );
}
