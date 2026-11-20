import { SignupForm } from "@/components/auth/SignupForm";
import { drugDisplayName, getSeoDrug } from "@/lib/seo-drugs";

export const metadata = {
  title: "Create Account | SafeTrack",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ drug?: string }>;
}) {
  const { drug: drugSlug } = await searchParams;
  const drug = drugSlug ? getSeoDrug(drugSlug) : undefined;
  const subtitle = drug
    ? `Get free email alerts when the FDA recalls ${drugDisplayName(drug)}.`
    : "Get email alerts when the FDA recalls medications in your cabinet.";

  return (
    <>
      <div className="mb-gutter text-center">
        <h1 className="font-display text-headline-md text-on-surface mb-2">Create your account</h1>
        <p className="text-body-md text-on-surface-variant">{subtitle}</p>
      </div>

      <div className="card p-8 md:p-10">
        <SignupForm />
      </div>
    </>
  );
}
