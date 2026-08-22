import type { WorkflowTemplate } from "@/types/workflow";

export const productWorkflow: WorkflowTemplate = {
  id: "product_operations_v1",
  operationType: "product_operations",
  name: "产品运营工作流",
  description: "覆盖上线准备、发布、用户触达、反馈和优化的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "launch_prep",
      name: "上线准备",
      description: "确认功能范围、验收标准和上线材料。"
    },
    {
      id: "release",
      name: "发布",
      description: "按计划完成功能发布和版本同步。"
    },
    {
      id: "user_outreach",
      name: "用户触达",
      description: "通过公告、教程或推送让用户感知新功能。"
    },
    {
      id: "feedback",
      name: "反馈",
      description: "收集用户反馈、问题和需求。"
    },
    {
      id: "optimization",
      name: "优化",
      description: "基于数据与反馈推动产品持续优化。"
    }
  ]
};
