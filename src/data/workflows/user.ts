import type { WorkflowTemplate } from "@/types/workflow";

export const userWorkflow: WorkflowTemplate = {
  id: "user_operations_v1",
  operationType: "user_operations",
  name: "用户与私域运营工作流",
  description: "覆盖拉新、承接、活跃、转化和复购的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "acquisition",
      name: "拉新",
      description: "通过渠道触达和裂变活动获取新用户。"
    },
    {
      id: "onboarding",
      name: "承接",
      description: "完成新用户的首次触达、标签和信任建立。"
    },
    {
      id: "engagement",
      name: "活跃",
      description: "通过内容和活动提升用户参与和留存。"
    },
    {
      id: "conversion",
      name: "转化",
      description: "设计私域转化路径和成交场景。"
    },
    {
      id: "retention",
      name: "复购",
      description: "通过会员运营和召回策略提升复购率。"
    }
  ]
};
