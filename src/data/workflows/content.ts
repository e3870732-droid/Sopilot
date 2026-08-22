import type { WorkflowTemplate } from "@/types/workflow";

export const contentWorkflow: WorkflowTemplate = {
  id: "content_operations_v1",
  operationType: "content_operations",
  name: "内容与账号运营工作流",
  description: "覆盖内容选题、生产、审核、发布和数据复盘的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "planning",
      name: "内容规划",
      description: "确定选题方向、内容目标和排期计划。"
    },
    {
      id: "production",
      name: "内容生产",
      description: "按照选题完成图文、视频或短视频的内容创作。"
    },
    {
      id: "review",
      name: "内容审核",
      description: "检查事实、品牌口径、合规风险和内容质量。"
    },
    {
      id: "publish",
      name: "发布",
      description: "按渠道规范完成发布并同步监控上线状态。"
    },
    {
      id: "analysis",
      name: "数据复盘",
      description: "汇总关键指标，沉淀可复用的内容经验。"
    }
  ]
};
