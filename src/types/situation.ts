export const PLATFORMS = [
  "douyin",
  "xiaohongshu",
  "wechat_mp",
  "channels",
  "kuaishou",
  "bilibili",
  "weibo",
  "private_domain",
  "other"
] as const;

export const BUDGET_TIERS = ["none", "lt5k", "5k_30k", "gt30k", "unknown"] as const;

export type Platform = (typeof PLATFORMS)[number];
export type BudgetTier = (typeof BUDGET_TIERS)[number];

export interface SituationProfile {
  platforms: Platform[];
  budgetTier: BudgetTier;
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

export function isPlatform(value: unknown): value is Platform {
  return isOneOf(value, PLATFORMS);
}

export function isBudgetTier(value: unknown): value is BudgetTier {
  return isOneOf(value, BUDGET_TIERS);
}
