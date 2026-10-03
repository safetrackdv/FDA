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
      urlPrefix: (process.env.NEXT_PUBLIC_SUPABASE_URL || "").slice(0, 25),
      nodeEnv: process.env.NODE_ENV,
    },
  };
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();
    out.getCurrentUser = { ok: true, user: user ? { id: user.id } : null };
  } catch (e) {
    out.getCurrentUser = {
      ok: false,
      error: String((e as Error)?.message || e).slice(0, 300),
      stack: String((e as Error)?.stack || "").split("\n").slice(0, 4),
    };
  }
  return NextResponse.json(out);
}
