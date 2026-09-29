import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verifiable Webhooks · Hedera",
  description: "Privacy-preserving webhook proofs anchored to Hedera Consensus Service.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
