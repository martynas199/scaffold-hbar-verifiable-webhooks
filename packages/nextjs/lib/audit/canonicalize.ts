const SENSITIVE_KEY = /(email|phone|address|name|token|secret|password|authorization|card|cvv|cvc|iban|account_number)/i;

export const REDACTED = "[REDACTED]" as const;

function normalise(value: unknown, key = ""): unknown {
  if (key && SENSITIVE_KEY.test(key)) return REDACTED;

  if (Array.isArray(value)) return value.map(item => normalise(item));

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([childKey, childValue]) => [childKey, normalise(childValue, childKey)]),
    );
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new Error("Non-finite numbers cannot be canonicalised");
  }

  return value;
}

export function redactAndCanonicalise(value: unknown): unknown {
  return normalise(value);
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(redactAndCanonicalise(value));
}
