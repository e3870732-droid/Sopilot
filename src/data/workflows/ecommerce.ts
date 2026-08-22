import type { WorkflowTemplate } from "@/types/workflow";

export const ecommerceWorkflow: WorkflowTemplate = {
  id: "ecommerce_operations_v1",
  operationType: "ecommerce_operations",
  name: "电商与直播运营工作流",
  description: "覆盖选品、上架、直播、转化和售后的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "sourcing",
      name: "选品",
      description: "基于数据、毛利和用户需求筛选可售卖商品。"
    },
    {
      id: "listing",
      name: "上架",
      description: "完成商品信息、价格、库存和页面配置。"
    },
    {
      id: "live_selling",
      name: "直播",
      description: "组织直播脚本、排品和现场执行。"
    },
    {
      id: "conversion",
      name: "转化",
      description: "通过活动、话术和流量承接提升成交转化。"
    },
    {
      id: "after_sales",
      name: "售后",
      description: "处理退换、客诉和售后数据复盘。"
    }
  ]
};
