"use client";

import { useMemo, useState } from "react";

const sample = {
  provider: "stripe",
  eventType: "payment_intent.succeeded",
  externalId: "evt_demo_001",
  occurredAt: "2026-09-29T12:00:00.000Z",
  payload: {
    amount: 2500,
    currency: "gbp",
    customer_email: "customer@example.com",
    billing_address: "1 Example Street",
    status: "succeeded"
  }
};

export function AuditDemo() {
  const [value, setValue] = useState(JSON.stringify(sample, null, 2));
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pretty = useMemo(() => (result ? JSON.stringify(result, null, 2) : "Run the preview to inspect the proof envelope."), [result]);

  async function run(submit: boolean) {
    setBusy(true);
    setError(null);
    try {
      const body = JSON.parse(value);
      const response = await fetch(`/api/audit?submit=${submit ? "true" : "false"}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="demo">
      <div className="demo-head">
        <div>
          <div className="eyebrow">Interactive proof</div>
          <strong>Try the event pipeline</strong>
        </div>
        <span className="badge">HCS + Mirror Node</span>
      </div>

      <textarea aria-label="Webhook event JSON" value={value} onChange={event => setValue(event.target.value)} />
      <div className="actions">
        <button className="btn" disabled={busy} onClick={() => run(false)}>Preview proof</button>
        <button className="btn primary" disabled={busy} onClick={() => run(true)}>Submit to Hedera testnet</button>
      </div>
      {error ? <p className="error" role="alert">{error}</p> : null}
      <div className="result"><pre>{pretty}</pre></div>
    </section>
  );
}
