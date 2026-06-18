import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SafeTrack",
};

const CONTACTS = [
  {
    email: "support@safetrackdv.com",
    label: "General Support",
    description: "Questions about medication recall alerts, your account, or how SafeTrack works.",
  },
  {
    email: "billing@safetrackdv.com",
    label: "Billing & Subscription",
    description: "Subscription changes, payment issues, receipts, and refund requests.",
  },
  {
    email: "legal@safetrackdv.com",
    label: "Legal & Privacy",
    description: "Privacy requests, data deletion, HIPAA inquiries, and legal matters.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-display-sm font-bold text-on-surface mb-2">Contact Us</h1>
      <p className="text-body-lg text-on-surface-variant mb-2">
        SafeTrack DV LLC
      </p>
      <p className="text-body-md text-on-surface-variant mb-10">
        Have questions about medication recall alerts, subscriptions, billing, or your account?
        Reach us at the addresses below — we typically respond within{" "}
        <strong className="text-on-surface">1–2 business days</strong>.
      </p>

      <div className="flex flex-col gap-4">
        {CONTACTS.map(({ email, label, description }) => (
          <div
            key={email}
            className="rounded-2xl border border-primary/10 bg-surface-container-low p-6 flex flex-col gap-2"
          >
            <span className="text-label-sm font-semibold uppercase tracking-widest text-secondary">
              {label}
            </span>
            <a
              href={`mailto:${email}`}
              className="text-title-md font-semibold text-on-surface hover:text-secondary transition-colors"
            >
              {email}
            </a>
            <p className="text-body-sm text-on-surface-variant">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary hover:opacity-90 transition-opacity"
        >
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
