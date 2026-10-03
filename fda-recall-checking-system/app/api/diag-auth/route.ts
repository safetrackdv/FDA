import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** TEMPORARY diagnostic — reports why page SSR throws. Remove after fix. */
export async function GET() {
  const out: Record<string, unknown> = {
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  };
  async function tryCall(name: string, fn: () => Promise<unknown>) {
    try {
      const v = await fn();
      const s = JSON.stringify(v);
      (out as Record<string, unknown>)[name] = { ok: true, type: typeof v, len: s ? s.length : 0 };
    } catch (e) {
      (out as Record<string, unknown>)[name] = {
        ok: false,
        error: String((e as Error)?.message || e).slice(0, 400),
        stack: String((e as Error)?.stack || "").split("\n").slice(0, 5),
      };
    }
  }
  const { getCurrentUser } = await import("@/lib/auth");
  await tryCall("getCurrentUser", () => getCurrentUser());
  const { getMeta } = await import("@/lib/meta");
  await tryCall("getMeta", () => getMeta());
  const homeMod = await import("@/app/page");
  await tryCall("homePageFn", () => (homeMod.default as () => Promise<unknown>)());
  const checkMod = await import("@/app/check/page");
  await tryCall("checkPageFn", () => (checkMod.default as () => Promise<unknown>)());
  return NextResponse.json(out);
}
