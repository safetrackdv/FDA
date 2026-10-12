import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import { SEO_DRUGS, drugDisplayName, getSeoDrug } from "@/lib/seo-drugs";

export const dynamicParams = false;
export const revalidate = 86400; // refresh recall counts daily

export function generateStaticParams() {
  return SEO_DRUGS.map((d) => ({ drug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ drug: string }> }) {
  const { drug: slug } = await params;
  const drug = getSeoDrug(slug);
  if (!drug) return {};
  const name = drugDisplayName(drug);
  return {
    title: `${name} Recalls & Free Safety Alerts | SafeTrack`,
    description: `Track FDA recalls for ${name}. See recent ${drug.generic} recalls and get free email alerts when a new recall is issued.`,
  };
}

type RecallRow = {
  id: number;
  recall_number: string;
  recalling_firm: string | null;
  brand_name: string | null;
  generic_name: string | null;
  reason_for_recall: string | null;
  classification: string | null;
  status: string | null;
  recall_initiation_date: string | null;
};

function classChip(c: string | null): string {
  if (!c) return "chip bg-surface-container-high text-on-surface";
  if (/class\s*iii\b/i.test(c)) return "chip chip-iii";
  if (/class\s*ii\b/i.test(c)) return "chip chip-ii";
  if (/class\s*i\b/i.test(c)) return "chip chip-i";
  return "chip bg-surface-container-high text-on-surface";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function isOngoing(status: string | null): boolean {
  return /ongoing|pending/i.test(status ?? "");
}

export default async function DrugRecallPage({ params }: { params: Promise<{ drug: string }> }) {
  const { drug: slug } = await params;
  const drug = getSeoDrug(slug);
  if (!drug) notFound();

  const name = drugDisplayName(drug);
  const genericCap = drug.generic.charAt(0).toUpperCase() + drug.generic.slice(1);
  const terms = [drug.generic, ...drug.brands];

  let recalls: RecallRow[] = [];
  try {
    const supabase = getServerSupabase();
    const ors = terms
      .flatMap((t) => [`brand_name.ilike.%${t}%`, `generic_name.ilike.%${t}%`])
      .join(",");
    const { data } = await supabase
      .from("recalls")
      .select(
        "id, recall_number, recalling_firm, brand_name, generic_name, reason_for_recall, classification, status, recall_initiation_date",
      )
      .or(ors)
      .order("recall_initiation_date", { ascending: false, nullsFirst: false })
      .limit(50);
    recalls = (data ?? []) as RecallRow[];
  } catch {
    recalls = [];
  }

  const activeCount = recalls.filter((r) => isOngoing(r.status)).length;
  const recent = recalls.slice(0, 8);
  const related = SEO_DRUGS.filter((d) => d.slug !== drug.slug).slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-label-md text-on-surface-variant">
        <Link href="/recalls" className="hover:text-secondary">FDA recalls</Link>
        <span className="mx-2">/</span>
        <span className="text-on-surface">{genericCap}</span>
      </nav>

      {/* Hero */}
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">{name} recalls</h1>
        <p className="mt-3 max-w-3xl text-body-lg text-on-surface-variant">
          {genericCap} is {drug.what}. We track every FDA enforcement recall involving{" "}
          {name} —{" "}
          {recalls.length > 0 ? (
            <>
              <strong className="text-on-surface">{recalls.length} recalls</strong> in our
              database{activeCount > 0 ? (
                <>
                  , including <strong className="text-on-surface">{activeCount} active</strong>
                </>
              ) : null}
              .
            </>
          ) : (
            <>so you can check yours any time.</>
          )}
        </p>
      </div>

      {/* Signup CTA */}
      <section aria-label="Get recall alerts" className="card bg-primary-container p-8 md:p-10">
        <h2 className="font-display text-headline-md text-on-primary-container">
          Get free {drug.generic} recall alerts
        </h2>
        <p className="mt-2 max-w-2xl text-body-md text-on-primary-container">
          Add {genericCap} to your medicine cabinet and we&rsquo;ll email you the moment the
          FDA issues a new recall — before your pharmacy calls. Free forever, no credit card.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={`/signup?drug=${drug.slug}`} className="btn-primary text-label-lg">
            Alert me about {genericCap} recalls
          </Link>
          <Link href="/check" className="btn-secondary text-label-lg">
            Quick check — no signup
          </Link>
        </div>
      </section>

      {/* Recent recalls */}
      <section aria-label={`Recent ${drug.generic} recalls`}>
        <h2 className="font-display text-headline-md text-on-surface">
          Recent {genericCap} recalls
        </h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-body-md text-on-surface-variant">
            No recalls for {name} in our current database snapshot, or our database is
            temporarily unavailable.{" "}
            <Link href="/recalls" className="text-secondary hover:underline">
              Browse all FDA recalls
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {recent.map((r) => (
              <li key={r.id} className="card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={classChip(r.classification)}>
                    {r.classification ?? "Unclassified"}
                  </span>
                  {isOngoing(r.status) && (
                    <span className="chip bg-error-container text-on-error-container">Active</span>
                  )}
                  <span className="text-label-md text-on-surface-variant">
                    {formatDate(r.recall_initiation_date)}
                  </span>
                </div>
                <p className="mt-2 text-body-md text-on-surface">
                  <span className="font-medium">{r.recalling_firm ?? "Unknown firm"}</span>
                  {" — "}
                  {r.reason_for_recall ?? "No reason listed."}
                </p>
                <p className="mt-1 text-label-md text-on-surface-variant">
                  Recall {r.recall_number}
                </p>
              </li>
            ))}
          </ul>
        )}
        {recalls.length > recent.length && (
          <p className="mt-4 text-body-md text-on-surface-variant">
            Showing {recent.length} of {recalls.length}.{" "}
            <Link href={`/recalls?q=${encodeURIComponent(drug.generic)}`} className="text-secondary hover:underline">
              See all {genericCap} recalls
            </Link>
            .
          </p>
        )}
      </section>

      {/* What to do */}
      <section aria-label="What to do if your medication is recalled" className="card p-8">
        <h2 className="font-display text-headline-md text-on-surface">
          What to do if your {genericCap} is recalled
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-body-md text-on-surface-variant">
          <li>
            <strong className="text-on-surface">Don&rsquo;t panic — and don&rsquo;t stop taking it on your own.</strong>{" "}
            Suddenly stopping a prescription can be riskier than the recall itself.
          </li>
          <li>
            <strong className="text-on-surface">Check the details.</strong> Recalls often affect
            specific lots, manufacturers, or strengths — not every bottle of {genericCap}.
          </li>
          <li>
            <strong className="text-on-surface">Talk to your pharmacist or doctor</strong> about
            whether your supply is affected and what to do next.
          </li>
        </ol>
        <p className="mt-4 text-label-md text-on-surface-variant">
          This page is for information only and isn&rsquo;t medical advice. Always follow your
          clinician&rsquo;s guidance.
        </p>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions">
        <h2 className="font-display text-headline-md text-on-surface">
          {genericCap} recall FAQs
        </h2>
        <div className="mt-4 space-y-4">
          <div className="card p-5">
            <h3 className="text-title-md text-on-surface">How will I know if my {genericCap} is recalled?</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              The FDA publishes recalls, but most never make the news. The reliable way is an
              automated alert:{" "}
              <Link href={`/signup?drug=${drug.slug}`} className="text-secondary hover:underline">
                sign up free
              </Link>{" "}
              and we&rsquo;ll email you when a {genericCap} recall is issued.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-title-md text-on-surface">Are generic {genericCap} recalls common?</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Most prescriptions filled in the US are generics, so most recalls involve generic
              products. A recall doesn&rsquo;t mean the drug itself is unsafe — it usually affects
              specific lots or manufacturers.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-title-md text-on-surface">Is SafeTrack free?</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Yes — weekly recall alert digests are free forever, with no credit card required.{" "}
              <Link href="/pricing" className="text-secondary hover:underline">
                See pricing
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Related drugs */}
      <section aria-label="Other drugs">
        <h2 className="font-display text-headline-md text-on-surface">Track other medications</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((d) => (
            <Link
              key={d.slug}
              href={`/recalls/${d.slug}`}
              className="chip bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
            >
              {d.generic.charAt(0).toUpperCase() + d.generic.slice(1)} recalls
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
