export const runtime = "edge";
export const dynamic = "force-dynamic";
/** TEMPORARY diagnostic page — edge runtime. Remove after fix. */
export default function DiagEdgePage() {
  return <div>diag-edge ok {Date.now()}</div>;
}
