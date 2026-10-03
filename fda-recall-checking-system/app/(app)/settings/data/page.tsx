import Link from "next/link";
import { DeleteAccount } from "@/components/settings/DeleteAccount";

export const metadata = { title: "Data & Privacy | SafeTrack" };

export default function DataExportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-surface">Data &amp; privacy</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Download a copy of everything we store about you, or close your account.
        </p>
      </div>

      <section className="card">
        <h2 className="font-display text-headline-sm text-on-surface">Export your data</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Includes your profile, medications, notification history, and preferences.
          Downloads as a JSON file you can save or import elsewhere.
        </p>
        <a
          href="/api/me/export"
          className="btn-primary mt-4 inline-flex"
          download
        >
          Download my data (.json)
        </a>
      </section>

      <section className="card">
        <h2 className="font-display text-headline-sm text-on-surface">Close account</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Permanently removes your profile, cabinet, notifications, and preferences.
          This cannot be undone. If you have an active subscription, cancel it under
          Billing first.
        </p>
        <DeleteAccount />
      </section>

      <p className="text-label-sm text-on-surface-variant">
        Read the{" "}
        <Link href="/privacy" className="text-secondary underline">
          Privacy Policy
        </Link>{" "}
        for details on how we handle your information.
      </p>
    </div>
  );
}
