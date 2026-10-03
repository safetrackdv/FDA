"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export function DeleteAccount() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doDelete() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Delete failed. Please try again.");
      const supabase = getBrowserSupabase();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn-secondary mt-4 border-error/40 text-error hover:bg-error-container"
        >
          Delete my account
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-error/30 bg-error-container/40 p-4">
      <p className="text-body-md text-on-surface">
        This permanently removes your profile, cabinet, notifications, and
        preferences. This cannot be undone.
      </p>
      <label
        htmlFor="delete-confirm"
        className="mt-3 block text-label-md text-on-surface-variant"
      >
        Type <span className="font-mono font-semibold">DELETE</span> to confirm
      </label>
      <input
        id="delete-confirm"
        type="text"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
        className="input mt-1 bg-surface-container-lowest font-mono"
        placeholder="DELETE"
      />
      {error ? (
        <p className="mt-2 text-label-sm text-error">{error}</p>
      ) : null}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={busy || typed.trim() !== "DELETE"}
          onClick={doDelete}
          className="btn-secondary border-error/40 bg-error text-on-error disabled:opacity-40"
        >
          {busy ? "Deleting…" : "Permanently delete"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setConfirming(false);
            setTyped("");
            setError(null);
          }}
          className="btn-secondary"
        >
          Keep my account
        </button>
      </div>
    </div>
  );
}
