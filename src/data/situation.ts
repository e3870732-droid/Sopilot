import type { BudgetTier, Platform } from "@/types/situation";

export interface SituationOption<T extends string> {
  id: T;
  label: string;
  description?: string;
}

export const PLATFORM_OPTIONS: SituationOption<Platform>[] = [
  { id: "douyin", label: "抖音" },
  { id: "xiaohongshu", label: "小红书" },
  { id: "wechat_mp", label: "微信公众号" },
  { id: "channels", label: "视频号" },
  { id: "kuaishou", label: "快手" },
  { id: "bilibili", label: "B站" },
  { id: "weibo", label: "微博" },
  { id: "private_domain", label: "私域（微信）" },
  { id: "other", label: "其他" }
];

export const BUDGET_OPTIONS: SituationOption<BudgetTier>[] = [
  { id: "none", label: "不花钱" },
  { id: "lt5k", label: "5000 以内" },
  { id: "5k_30k", label: "5000–3 万" },
  { id: "gt30k", label: "3 万以上" },
  { id: "unknown", label: "说不准" }
];

export function getPlatformLabel(id: string): string {
  return PLATFORM_OPTIONS.find((item) => item.id === id)?.label ?? id;
}

export function getBudgetTierLabel(id: string): string {
  return BUDGET_OPTIONS.find((item) => item.id === id)?.label ?? id;
}
