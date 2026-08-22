import type { PrimaryEmphasis, PrimaryProblem, TeamSize } from "@/types/user-profile";
import type { ScaleAdaptation } from "@/types/workflow";

export const PROBLEM_EMPHASIS: Record<PrimaryProblem, PrimaryEmphasis> = {
  unclear_process: "strategy_and_process",
  low_efficiency: "execution_efficiency",
  frequent_errors: "quality_control",
  lack_of_metrics: "data_review",
  other: "strategy_and_process"
};

export const EMPHASIS_LABELS: Record<PrimaryEmphasis, string> = {
  strategy_and_process: "流程与策略",
  execution_efficiency: "执行效率",
  quality_control: "质量管控",
  data_review: "数据复盘"
};

export const EMPHASIS_FOCUS: Record<PrimaryProblem, string> = {
  unclear_process: "强化每个阶段的入口/出口定义与先后顺序",
  low_efficiency: "强化时间要求、减少审批、模板化与批量处理",
  frequent_errors: "强化检查清单、Review 节点、风险点与异常处理",
  lack_of_metrics: "强化 KPI、复盘频率与数据反馈机制",
  other: "根据你的描述，重点梳理流程、执行与复盘标准"
};

export const TEAM_SCALE_ADAPTATION: Record<TeamSize, ScaleAdaptation> = {
  solo: {
    position: "一个人全流程负责",
    focus: "重点是不漏事、不返工",
    add: "Checklist 自查、模板复用",
    remove: "非必要审批与复杂交接"
  },
  small_team: {
    position: "2–5 人简单分工",
    focus: "明确每个阶段的 Owner 与交接界面",
    add: "阶段 Owner、任务交接确认",
    remove: "复杂层级与多级审批"
  },
  mid_team: {
    position: "6–10 人明确岗位分工",
    focus: "统一流程节点与验收口径",
    add: "Review 节点、交接标准、阶段验收",
    remove: "一人多阶段的模糊边界"
  },
  large_team: {
    position: "11–20 人层级协作",
    focus: "建立审批链与问责标准",
    add: "Owner / Reviewer / Approver、SLA 与汇报机制",
    remove: "无审批的临时口头交接"
  },
  xlarge_team: {
    position: "20 人以上多团队协作",
    focus: "跨团队对齐与标准化治理",
    add: "跨团队 SLA、例会机制、资产库与权限",
    remove: "各自维护的孤立流程"
  }
};

export function getScaleAdaptation(teamSize: TeamSize): ScaleAdaptation {
  return TEAM_SCALE_ADAPTATION[teamSize];
}
