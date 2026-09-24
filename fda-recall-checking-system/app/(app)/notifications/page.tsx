import { getServerAuthSupabase } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ item?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const rawItemId = params.item ? Number(params.item) : null;
  const authSupabase = await getServerAuthSupabase();
  const { data: userData } = await authSupabase.auth.getUser();
  const userId = userData.user?.id;

  // NOTE: queried with the service-role client scoped to this user. The
  // recalls embed is not visible through the user-scoped client (RLS), which
  // left recall numbers/dates blank on alert cards.
  const supabase = getServerSupabase();
  const { data } = userId
    ? await supabase
        .from("notifications")
        .select(
          `
      id, classification, status, created_at, email_sent_at,
      medication_items(id, product_name, manufacturer),
      recalls(recall_number, reason_for_recall, recall_initiation_date, classification, recalling_firm)
      `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: null };

  const initial = (data ?? []) as unknown as Parameters<
    typeof NotificationsList
  >[0]["initial"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-md text-on-surface">Notifications</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          FDA recall alerts for medications in your cabinet.
        </p>
      </div>
      <NotificationsList
        initial={initial}
        itemId={Number.isFinite(rawItemId) ? rawItemId : null}
      />
    </div>
  );
}
