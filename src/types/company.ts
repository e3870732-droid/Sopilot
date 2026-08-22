export const INDUSTRIES = [
  "internet_software",
  "ecommerce",
  "retail",
  "education",
  "healthcare",
  "finance",
  "enterprise_services",
  "manufacturing",
  "media",
  "other"
] as const;

export const COMPANY_SCALES = ["micro", "small", "medium"] as const;

export type Industry = (typeof INDUSTRIES)[number];
export type CompanyScale = (typeof COMPANY_SCALES)[number];

export interface CompanyProfile {
  industry: Industry;
  businessModel: string;
  companyScale: CompanyScale;
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

export function isIndustry(value: unknown): value is Industry {
  return isOneOf(value, INDUSTRIES);
}

export function isCompanyScale(value: unknown): value is CompanyScale {
  return isOneOf(value, COMPANY_SCALES);
}
