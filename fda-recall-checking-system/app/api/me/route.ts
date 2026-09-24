import { NextResponse } from "next/server";
import { getServerAuthSupabase } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase";
import { getUserPlan } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Self-serve account deletion. Deletes the user's data rows (service role),
 * then the auth user itself. Paid plans are blocked — cancel the subscription
 * first so Stripe stays consistent.
 */
export async function DELETE() {
  const authSupabase = await getServerAuthSupabase();
  const { data: userData } = await authSupabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = getServerSupabase();
  const plan = await getUserPlan(admin, userId);
  if (plan !== "free") {
    return NextResponse.json(
      {
        error:
          "You have an active subscription. Cancel it under Billing first, then delete your account.",
      },
      { status: 409 },
    );
  }

  // Child rows first (FKs), then the profile, then the auth user.
  const deletions: Array<{ table: string; column: string }> = [
    { table: "notifications", column: "user_id" },
    { table: "notification_preferences", column: "user_id" },
    { table: "medication_items", column: "user_id" },
    { table: "profiles", column: "id" },
  ];
  for (const { table, column } of deletions) {
    const { error } = await admin.from(table).delete().eq(column, userId);
    if (error) {
      return NextResponse.json(
        { error: `Could not delete your ${table.replace(/_/g, " ")}.` },
        { status: 500 },
      );
    }
  }

  const { error: authError } = await admin.auth.admin.deleteUser(userId);
  if (authError) {
    return NextResponse.json(
      { error: "Could not delete your account. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
