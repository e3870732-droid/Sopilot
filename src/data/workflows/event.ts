import type { WorkflowTemplate } from "@/types/workflow";

export const eventWorkflow: WorkflowTemplate = {
  id: "event_operations_v1",
  operationType: "event_operations",
  name: "活动运营工作流",
  description: "覆盖立项、策划、准备、执行和复盘的标准流程。",
  supportedProblems: ["unclear_process", "low_efficiency", "frequent_errors", "lack_of_metrics"],
  stages: [
    {
      id: "initiation",
      name: "立项",
      description: "明确活动目标、预算、范围和责任人。"
    },
    {
      id: "planning",
      name: "策划",
      description: "设计活动主题、玩法和传播方案。"
    },
    {
      id: "preparation",
      name: "准备",
      description: "完成物料、排期、渠道和风险准备。"
    },
    {
      id: "execution",
      name: "执行",
      description: "按计划落地活动并处理现场问题。"
    },
    {
      id: "review",
      name: "复盘",
      description: "回顾目标达成情况，沉淀活动经验。"
    }
  ]
};
