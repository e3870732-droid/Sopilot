import type { PrimaryEmphasis, PrimaryProblem, TeamSize } from "@/types/user-profile";
import type { WorkflowCustomization, WorkflowTemplate } from "@/types/workflow";

interface VariantRule {
  roles: string[];
  checkpoints: string[];
  metrics: string[];
  highlights: string[];
}

export const PROBLEM_EMPHASIS: Record<PrimaryProblem, PrimaryEmphasis> = {
  unclear_process: "strategy_and_process",
  low_efficiency: "execution_efficiency",
  frequent_errors: "quality_control",
  lack_of_metrics: "data_review"
};

export const EMPHASIS_LABELS: Record<PrimaryEmphasis, string> = {
  strategy_and_process: "流程与策略",
  execution_efficiency: "执行效率",
  quality_control: "质量管控",
  data_review: "数据复盘"
};

const TEAM_RULES: Record<TeamSize, VariantRule> = {
  solo: {
    roles: ["单人全流程负责"],
    checkpoints: ["Checklist 自查"],
    metrics: ["核心产出数量"],
    highlights: ["Checklist 自查"]
  },
  small_team: {
    roles: ["明确 Owner"],
    checkpoints: ["任务交接确认"],
    metrics: ["关键节点完成率"],
    highlights: ["角色分工", "任务交接"]
  },
  structured_team: {
    roles: ["岗位分工", "Reviewer"],
    checkpoints: ["Review 节点", "交接标准"],
    metrics: ["阶段验收通过率"],
    highlights: ["岗位分工", "Review 节点"]
  },
  large_team: {
    roles: ["Owner", "Reviewer", "Approver"],
    checkpoints: ["审批节点", "SLA/汇报机制"],
    metrics: ["SLA 达成率", "汇报频率"],
    highlights: ["Owner / Reviewer / Approver", "审批与汇报机制"]
  }
};

const PROBLEM_RULES: Record<PrimaryProblem, VariantRule> = {
  unclear_process: {
    roles: [],
    checkpoints: ["流程顺序", "阶段入口与出口"],
    metrics: ["阶段验收标准"],
    highlights: ["流程顺序", "阶段入口与出口"]
  },
  low_efficiency: {
    roles: [],
    checkpoints: ["时间节点", "模板化与批量处理"],
    metrics: ["任务耗时"],
    highlights: ["时间要求", "模板化与批量处理"]
  },
  frequent_errors: {
    roles: ["Reviewer"],
    checkpoints: ["关键检查清单", "风险节点", "异常处理"],
    metrics: [],
    highlights: ["检查清单", "Review", "风险节点", "异常处理"]
  },
  lack_of_metrics: {
    roles: [],
    checkpoints: ["数据反馈机制"],
    metrics: ["核心 KPI", "复盘频率"],
    highlights: ["核心 KPI", "复盘频率", "数据反馈"]
  }
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function customizeWorkflow(
  workflow: WorkflowTemplate,
  teamSize: TeamSize,
  primaryProblem: PrimaryProblem
): WorkflowCustomization {
  const emphasis = PROBLEM_EMPHASIS[primaryProblem];
  const teamRule = TEAM_RULES[teamSize];
  const problemRule = PROBLEM_RULES[primaryProblem];

  return {
    teamMode: teamSize,
    emphasis,
    emphasisLabel: EMPHASIS_LABELS[emphasis],
    roles: unique([...teamRule.roles, ...problemRule.roles]),
    checkpoints: unique([...teamRule.checkpoints, ...problemRule.checkpoints]),
    metrics: unique([...teamRule.metrics, ...problemRule.metrics]),
    highlights: unique([...teamRule.highlights, ...problemRule.highlights])
  };
}
