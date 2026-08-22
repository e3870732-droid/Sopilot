import type { WorkflowTemplate } from "@/types/workflow";

export const growthWorkflow: WorkflowTemplate = {
  id: "growth_operations_v1",
  operationType: "growth_operations",
  name: "市场与增长运营工作流",
  description: "覆盖渠道、获客、转化、ROI 分析和优化的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "channel",
      name: "渠道拓展",
      description: "识别并评估适合的获客渠道和合作资源。"
    },
    {
      id: "acquisition",
      name: "获客",
      description: "通过投放、内容或 BD 带来目标用户。"
    },
    {
      id: "conversion",
      name: "转化",
      description: "优化落地路径，提升线索到成交的转化。"
    },
    {
      id: "roi_analysis",
      name: "ROI 分析",
      description: "核算渠道成本、产出和投入回报。"
    },
    {
      id: "optimization",
      name: "优化",
      description: "基于数据调整渠道组合和增长策略。"
    }
  ]
};
