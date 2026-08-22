import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel, getStageLabel } from "@/data/situation";
import { EMPHASIS_FOCUS, EMPHASIS_LABELS } from "@/lib/workflow-customizer";
import type { RoleWorksheet, SopOutput } from "@/types/workflow";

export interface ExecutiveSummary {
  headline: string;
  northStar: string;
  priorities: { title: string; detail: string }[];
  firstWeekAction: string;
}

export interface SevenDayItem {
  days: string;
  action: string;
}

export interface ContextInjection {
  title: string;
  body: string;
}

function getPrimaryWorksheet(output: SopOutput): RoleWorksheet | null {
  return output.overview[0] ?? null;
}

export function getExecutiveSummary(output: SopOutput): ExecutiveSummary {
  const primary = getPrimaryWorksheet(output);
  const teamLabel = getOptionLabel("teamSize", output.teamSize);
  const stageLabel = getStageLabel(output.situation.stage);
  const industryLabel = getIndustryLabel(output.company.industry);

  const steps = primary?.steps ?? [];
  const priorities: { title: string; detail: string }[] = [];

  if (steps[0]) {
    priorities.push({ title: `跑通「${steps[0].title}」`, detail: steps[0].action });
  }

  if (steps[1]) {
    priorities.push({ title: `跑通「${steps[1].title}」`, detail: steps[1].action });
  }

  priorities.push({
    title: `强化「${EMPHASIS_LABELS[output.emphasis]}」`,
    detail: EMPHASIS_FOCUS[output.primaryProblem]
  });

  const firstWeekActions: Record<SopOutput["situation"]["stage"], string> = {
    cold_start: "先只做 1 个平台、低频、轻任务，跑通一次完整闭环并复盘。",
    struggling: "先做一次完整诊断，找出最卡的一环再集中投入，不盲目加量。",
    stable_growth: "保持现有稳定产出，把增长类任务提升为本周第一优先级。"
  };

  const soloNote = output.teamSize === "solo" ? "单人阶段优先用检查清单和模板，减少来回交接。" : "";

  return {
    headline: `为${industryLabel}「${output.company.businessModel}」团队生成 ${output.overview.length} 份岗位工作纸，适配 ${teamLabel}团队与「${stageLabel}」阶段。`,
    northStar: primary?.northStar ?? "先把核心流程跑通，形成可复用的标准动作。",
    priorities: priorities.slice(0, 3),
    firstWeekAction: [firstWeekActions[output.situation.stage], soloNote].filter(Boolean).join(" ")
  };
}

export function getSevenDayPlan(output: SopOutput): SevenDayItem[] {
  const steps = getPrimaryWorksheet(output)?.steps ?? [];

  if (steps.length === 0) {
    return Array.from({ length: 7 }, (_, index) => ({
      days: `第 ${index + 1} 天`,
      action: index === 6 ? "完成首周复盘，明确下周优先项" : "整理现有流程与分工，跑通最小闭环"
    }));
  }

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const stepIndex = Math.min(steps.length - 1, Math.floor((index / 7) * steps.length));
    const step = steps[stepIndex];

    return {
      days: `第 ${day} 天`,
      action: day === 7 ? `${step.title}收尾，并完成首周复盘` : `${step.title}：${step.action}`
    };
  });
}

export function getContextInjections(output: SopOutput): ContextInjection[] {
  const { company, situation } = output;
  const injections: ContextInjection[] = [];

  if (situation.budgetTier === "none") {
    injections.push({
      title: "预算提示",
      body: "当前预算为 0，先走自然流量版本，付费投放子流程暂不启用。"
    });
  } else if (situation.budgetTier === "unknown") {
    injections.push({
      title: "预算提示",
      body: "预算暂不确定，先按不花钱执行，确认预算后再补充投放计划。"
    });
  }

  if (["healthcare", "finance", "education"].includes(company.industry)) {
    injections.push({
      title: "合规提示",
      body: "所属行业偏强监管，发布前务必完成合规自查，敏感词与资质材料先备好。"
    });
  }

  if (situation.platforms.length > 0) {
    injections.push({
      title: "平台提示",
      body: `优先覆盖 ${situation.platforms.map(getPlatformLabel).join("、")}，按各平台口径调整标题、封面与发布时间。`
    });
  }

  if (situation.stage === "cold_start") {
    injections.push({
      title: "冷启动提示",
      body: "当前为冷启动阶段，先低频、单平台、轻任务跑通闭环，再逐步加量。"
    });
  } else if (situation.stage === "struggling") {
    injections.push({
      title: "诊断提示",
      body: "已有一定投入但没起色，先复盘哪个环节最卡，先诊断再加量。"
    });
  }

  return injections;
}

function worksheetToMarkdown(worksheet: RoleWorksheet, level: "##" | "###", heading = worksheet.name): string {
  const lines: string[] = [];
  lines.push(`${level} ${heading}`);
  lines.push("");
  lines.push(`**北极星**：${worksheet.northStar}`);
  lines.push(`**核心交付物**：${worksheet.output}`);
  lines.push(`**工作节奏**：${worksheet.cycle}`);
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

export function toMarkdown(output: SopOutput): string {
  const summary = getExecutiveSummary(output);
  const sevenDayPlan = getSevenDayPlan(output);
  const injections = getContextInjections(output);
  const problemLabel =
    output.primaryProblem === "other"
      ? output.customPrimaryProblem || "其他"
      : getOptionLabel("primaryProblem", output.primaryProblem);

  const lines: string[] = [];
  lines.push("# 你的岗位工作纸");
  lines.push("");
  lines.push("## 企业画像");
  lines.push(`- 行业：${getIndustryLabel(output.company.industry)}`);
  lines.push(`- 业务模式：${output.company.businessModel}`);
  lines.push(`- 企业规模：${getCompanyScaleLabel(output.company.companyScale)}`);
  lines.push("");
  lines.push("## 现状与卡点");
  lines.push(`- 运营阶段：${getStageLabel(output.situation.stage)}`);
  lines.push(`- 平台：${output.situation.platforms.map(getPlatformLabel).join("、")}`);
  lines.push(`- 预算：${getBudgetTierLabel(output.situation.budgetTier)}`);
  lines.push("");
  lines.push("## 本次优化重点");
  lines.push(`- 团队：${getOptionLabel("teamSize", output.teamSize)}`);
  lines.push(`- 优先解决：${problemLabel}`);
  lines.push(`- 重点：${EMPHASIS_FOCUS[output.primaryProblem]}`);
  lines.push("");
  lines.push("## 执行总览");
  lines.push(summary.headline);
  lines.push("");
  lines.push(`**北极星**：${summary.northStar}`);
  lines.push("");
  lines.push("**本周 3 件事**");
  summary.priorities.forEach((priority, index) => {
    lines.push(`${index + 1}. ${priority.title}：${priority.detail}`);
  });
  lines.push("");
  lines.push(`**第一周行动**：${summary.firstWeekAction}`);
  lines.push("");
  lines.push("## 7 天启动计划");
  sevenDayPlan.forEach((item) => {
    lines.push(`- ${item.days}：${item.action}`);
  });
  lines.push("");

  if (injections.length > 0) {
    lines.push("## 执行提示");
    injections.forEach((item) => {
      lines.push(`- **${item.title}**：${item.body}`);
    });
    lines.push("");
  }

  lines.push("## 总纲");
  output.overview.forEach((worksheet) => {
    lines.push("");
    lines.push(worksheetToMarkdown(worksheet, "###"));
  });

  if (output.subFlows.length > 0) {
    lines.push("");
    lines.push("## 子流程");
    output.subFlows.forEach((subFlow) => {
      lines.push("");
      lines.push(worksheetToMarkdown(subFlow.worksheet, "###", subFlow.subcategory.name));
    });
  }

  return lines.join("\n");
}
