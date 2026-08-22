import type { Subcategory } from "@/types/workflow";

export const SUBCATEGORIES: Subcategory[] = [
  { id: "market_channel", operationType: "market_operations", name: "渠道运营" },
  { id: "market_growth", operationType: "market_operations", name: "增长投放" },
  { id: "market_bd", operationType: "market_operations", name: "商务合作" },

  { id: "content_text", operationType: "content_operations", name: "图文内容" },
  { id: "content_short_video", operationType: "content_operations", name: "短视频内容" },
  { id: "content_account", operationType: "content_operations", name: "账号运营" },

  { id: "user_community", operationType: "user_operations", name: "社群运营" },
  { id: "user_membership", operationType: "user_operations", name: "会员运营" },
  { id: "user_private_domain", operationType: "user_operations", name: "私域运营" },

  { id: "event_online", operationType: "event_operations", name: "线上活动" },
  { id: "event_offline", operationType: "event_operations", name: "线下活动" },
  { id: "event_campaign", operationType: "event_operations", name: "节点活动" },

  { id: "growth_funnel", operationType: "growth_operations", name: "漏斗优化" },
  { id: "growth_experiment", operationType: "growth_operations", name: "增长实验" },
  { id: "growth_scale", operationType: "growth_operations", name: "规模化投放" },

  { id: "ecommerce_sourcing", operationType: "ecommerce_operations", name: "选品运营" },
  { id: "ecommerce_store", operationType: "ecommerce_operations", name: "店铺运营" },
  { id: "ecommerce_livestream", operationType: "ecommerce_operations", name: "直播运营" },
  { id: "ecommerce_fulfillment", operationType: "ecommerce_operations", name: "转化履约" },

  { id: "product_requirements", operationType: "product_operations", name: "需求管理" },
  { id: "product_launch", operationType: "product_operations", name: "上线运营" },
  { id: "product_education", operationType: "product_operations", name: "用户教育" },

  { id: "enterprise_brand", operationType: "enterprise_operations", name: "品牌运营" },
  { id: "enterprise_data", operationType: "enterprise_operations", name: "数据运营" }
];

export function getSubcategories(operationType: string): Subcategory[] {
  return SUBCATEGORIES.filter((subcategory) => subcategory.operationType === operationType);
}

export function findSubcategory(id: string): Subcategory | undefined {
  return SUBCATEGORIES.find((subcategory) => subcategory.id === id);
}
