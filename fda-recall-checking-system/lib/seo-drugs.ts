/**
 * Drug landing pages for SEO (`/recalls/[drug]`).
 *
 * Each entry powers one statically generated page targeting searches like
 * "<drug> recall". Keep `match` terms aligned with how the recalls table
 * stores brand_name / generic_name values.
 */
export type SeoDrug = {
  /** URL slug, e.g. "atorvastatin" -> /recalls/atorvastatin */
  slug: string;
  /** Generic name as stored in the recalls table */
  generic: string;
  /** Common brand names (shown to users, also matched) */
  brands: string[];
  /** Short plain-language description of what the drug is for */
  what: string;
};

export const SEO_DRUGS: SeoDrug[] = [
  { slug: "atorvastatin", generic: "atorvastatin", brands: ["Lipitor"], what: "a cholesterol-lowering statin taken daily by millions of Americans" },
  { slug: "levothyroxine", generic: "levothyroxine", brands: ["Synthroid"], what: "a thyroid hormone replacement taken daily for hypothyroidism" },
  { slug: "lisinopril", generic: "lisinopril", brands: ["Prinivil", "Zestril"], what: "an ACE inhibitor widely prescribed for high blood pressure" },
  { slug: "metformin", generic: "metformin", brands: ["Glucophage"], what: "a first-line medication for type 2 diabetes" },
  { slug: "amlodipine", generic: "amlodipine", brands: ["Norvasc"], what: "a calcium channel blocker prescribed for high blood pressure and chest pain" },
  { slug: "metoprolol", generic: "metoprolol", brands: ["Lopressor", "Toprol"], what: "a beta blocker used for high blood pressure and heart conditions" },
  { slug: "losartan", generic: "losartan", brands: ["Cozaar"], what: "an ARB blood pressure medication" },
  { slug: "gabapentin", generic: "gabapentin", brands: ["Neurontin"], what: "a medication commonly prescribed for nerve pain" },
  { slug: "omeprazole", generic: "omeprazole", brands: ["Prilosec"], what: "a proton pump inhibitor used for acid reflux and heartburn" },
  { slug: "simvastatin", generic: "simvastatin", brands: ["Zocor"], what: "a cholesterol-lowering statin" },
  { slug: "albuterol", generic: "albuterol", brands: ["Ventolin", "ProAir"], what: "a rescue inhaler medication for asthma" },
  { slug: "sertraline", generic: "sertraline", brands: ["Zoloft"], what: "an SSRI antidepressant" },
  { slug: "escitalopram", generic: "escitalopram", brands: ["Lexapro"], what: "an SSRI antidepressant prescribed for depression and anxiety" },
  { slug: "furosemide", generic: "furosemide", brands: ["Lasix"], what: "a diuretic ('water pill') used for fluid retention and blood pressure" },
  { slug: "hydrochlorothiazide", generic: "hydrochlorothiazide", brands: ["Microzide"], what: "a diuretic widely prescribed for high blood pressure" },
  { slug: "pantoprazole", generic: "pantoprazole", brands: ["Protonix"], what: "a proton pump inhibitor used for acid reflux" },
  { slug: "valsartan", generic: "valsartan", brands: ["Diovan"], what: "an ARB blood pressure medication affected by widely reported NDMA-related recalls" },
  { slug: "ranitidine", generic: "ranitidine", brands: ["Zantac"], what: "a heartburn medication withdrawn from the market over NDMA contamination concerns" },
  { slug: "acetaminophen", generic: "acetaminophen", brands: ["Tylenol"], what: "a widely used over-the-counter pain reliever and fever reducer" },
  { slug: "ibuprofen", generic: "ibuprofen", brands: ["Advil", "Motrin"], what: "a widely used over-the-counter NSAID pain reliever" },
];

export function getSeoDrug(slug: string): SeoDrug | undefined {
  return SEO_DRUGS.find((d) => d.slug === slug);
}

/** Display name: "Atorvastatin (Lipitor)" */
export function drugDisplayName(drug: SeoDrug): string {
  const generic = drug.generic.charAt(0).toUpperCase() + drug.generic.slice(1);
  return drug.brands.length > 0 ? `${generic} (${drug.brands.join(", ")})` : generic;
}
