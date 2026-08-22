import type { OperationType } from "@/types/user-profile";

export interface OperationCategory {
  id: OperationType;
  name: string;
  category: string;
  description: string;
}

export const OPERATION_CATEGORIES: OperationCategory[] = [
  { id: "market_operations", name: "市场运营", category: "获客", description: "渠道、增长投放与商务合作" },
  { id: "content_operations", name: "内容运营", category: "触达", description: "图文、短视频与账号内容运营" },
  { id: "user_operations", name: "用户运营", category: "留存", description: "社群、会员与用户生命周期运营" },
  { id: "event_operations", name: "活动运营", category: "转化", description: "线上、线下与节点活动运营" },
  { id: "growth_operations", name: "渠道增长运营", category: "增长", description: "漏斗优化、增长实验与规模化投放" },
  { id: "ecommerce_operations", name: "电商运营", category: "交易", description: "选品、店铺、直播与转化履约" },
  { id: "product_operations", name: "产品运营", category: "产品", description: "需求、上线与用户教育运营" },
  { id: "enterprise_operations", name: "企业运营", category: "治理", description: "品牌、私域与数据化经营决策" }
];

export function getOperationCategory(id: string): OperationCategory | undefined {
  return OPERATION_CATEGORIES.find((category) => category.id === id);
}
