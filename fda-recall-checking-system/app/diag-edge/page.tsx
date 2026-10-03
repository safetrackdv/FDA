export const runtime = "edge";
export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/auth";
import { getMeta } from "@/lib/meta";
/** TEMPORARY diagnostic page — edge runtime with real data. Remove after fix. */
export default async function DiagEdgePage() {
  let user: string;
  let meta: string;
  try {
    const u = await getCurrentUser();
    user = u ? u.id.slice(0, 8) : "null";
  } catch (e) {
    user = "THROW:" + String((e as Error)?.message || e).slice(0, 100);
  }
  try {
    const m = await getMeta();
    meta = `recalls=${m.recallCount}`;
  } catch (e) {
    meta = "THROW:" + String((e as Error)?.message || e).slice(0, 100);
  }
  return <div>diag-edge user={user} meta={meta}</div>;
}
