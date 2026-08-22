import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel } from "@/data/situation";
import { getContextInjections, getExecutiveSummary } from "@/lib/workflow-enrichment";
import type { OperationType } from "@/types/user-profile";
import type { RoleWorksheet, SopOutput, SubFlow } from "@/types/workflow";

export interface OverviewReport {
  source: "ai" | "fallback";
  executiveBrief: string;
  weeklyPlan: string[];
  risks: string[];
}

export interface RoleReport {
  source: "ai" | "fallback";
  operationType: OperationType;
  name: string;
  roleBrief: string;
  priorityTasks: string[];
  checklist: string[];
  risks: string[];
  worksheet: RoleWorksheet;
  subFlows: SubFlow[];
}

export interface FollowUpItem {
  id: string;
  question: string;
  answer: string;
  source: "ai" | "fallback";
  createdAt: string;
}

export interface SopReport {
  output: SopOutput;
  overview: OverviewReport;
  roles: RoleReport[];
  followUps: FollowUpItem[];
}

export function buildFallbackOverview(output: SopOutput): OverviewReport {
  const summary = getExecutiveSummary(output);
  const injections = getContextInjections(output);

  return {
    source: "fallback",
    executiveBrief: `${summary.headline}。北极星：${summary.northStar}`,
    weeklyPlan: summary.priorities.map((priority) => `${priority.title}：${priority.detail}`),
    risks: injections.map((item) => `${item.title}：${item.body}`)
  };
}

export function buildFallbackRole(output: SopOutput, worksheet: RoleWorksheet): RoleReport {
  const subFlows = output.subFlows.filter(
    (subFlow) => subFlow.subcategory.operationType === worksheet.operationType
  );

  return {
    source: "fallback",
    operationType: worksheet.operationType,
    name: worksheet.name,
    roleBrief: worksheet.northStar,
    priorityTasks: worksheet.steps.slice(0, 3).map((step) => step.title),
    checklist: worksheet.guardrails,
    risks: [],
    worksheet,
    subFlows
  };
}

export function assembleReport(
  output: SopOutput,
  overview: OverviewReport,
  roles: RoleReport[]
): SopReport {
  return { output, overview, roles, followUps: [] };
}

function worksheetMarkdown(report: RoleReport): string {
  const worksheet = report.worksheet;
  const lines: string[] = [];

  lines.push(`### ${report.name}`);
  lines.push("");
  lines.push(`#### AI 定制建议`);
  lines.push(`- 岗位定位：${report.roleBrief}`);
  lines.push(`- 本阶段重点任务：${report.priorityTasks.join("、")}`);
  lines.push(`- 关键检查清单：${report.checklist.join("、")}`);
  if (report.risks.length > 0) {
    lines.push(`- 岗位风险：${report.risks.join("、")}`);
  }
  if (report.subFlows.length > 0) {
    lines.push(`- 涉及子类：${report.subFlows.map((subFlow) => subFlow.subcategory.name).join("、")}`);
  }
  lines.push("");
  lines.push(`#### 标准流程`);
  worksheet.steps.forEach((step, index) => {
    const owner = step.owner ? `（${step.owner}）` : "";
    lines.push(`${index + 1}. **${step.title}**${owner}`);
    lines.push(`   - ${step.action}`);
    if (step.handoff) {
      lines.push(`   - 交接：${step.handoff}`);
    }
    lines.push(`   - 完成留痕：${step.proof}`);
  });
  lines.push("");
  lines.push(`#### 运营节奏`);
  worksheet.cadence.forEach((item) => {
    lines.push(`- ${item.rhythm}：${item.actions}`);
  });
  lines.push("");
  lines.push(`#### 必须留下的东西`);
  lines.push(`- ${worksheet.deliverables.join("、")}`);
  lines.push("");
  lines.push(`#### 关键协同`);
  worksheet.collaboration.forEach((item) => {
    lines.push(`- ${item}`);
  });
  lines.push("");
  lines.push(`#### 典型衡量指标`);
  lines.push(`- ${worksheet.kpis.join("、")}`);
  lines.push("");
  lines.push(`#### 执行护栏`);
  worksheet.guardrails.forEach((item) => {
    lines.push(`- ${item}`);
  });

  return lines.join("\n");
}

export function toReportMarkdown(report: SopReport): string {
  const output = report.output;
  const lines: string[] = [];

  lines.push("# SOP 报告");
  lines.push("");
  lines.push("## 企业画像");
  lines.push(`- 行业：${getIndustryLabel(output.company.industry)}`);
  lines.push(`- 业务模式：${output.company.businessModel}`);
  lines.push(`- 企业规模：${getCompanyScaleLabel(output.company.companyScale)}`);
  lines.push("");
  lines.push("## 现状与卡点");
  lines.push(`- 平台：${output.situation.platforms.map(getPlatformLabel).join("、")}`);
  lines.push(`- 预算：${getBudgetTierLabel(output.situation.budgetTier)}`);
  lines.push(`- 团队：${getOptionLabel("teamSize", output.teamSize)}`);
  lines.push("");
  lines.push("## 执行总览");
  lines.push(`- 执行简报：${report.overview.executiveBrief}`);
  lines.push("");
  lines.push("**本周计划**");
  report.overview.weeklyPlan.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });
  lines.push("");
  lines.push("**风险与提醒**");
  report.overview.risks.forEach((item) => {
    lines.push(`- ${item}`);
  });
  lines.push("");
  lines.push("## 岗位工作纸");
  report.roles.forEach((role) => {
    lines.push("");
    lines.push(worksheetMarkdown(role));
  });

  if (report.followUps.length > 0) {
    lines.push("");
    lines.push("## 追问与补充");
    report.followUps.forEach((item) => {
      lines.push(`- Q：${item.question}`);
      lines.push(`  A：${item.answer}`);
    });
  }

  return lines.join("\n");
}
