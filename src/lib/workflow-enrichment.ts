import { buildFocusLine, getAttributionDef, getStepPriority, type StepPriority } from "@/data/attributions";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel } from "@/data/situation";
import { EMPHASIS_FOCUS, EMPHASIS_LABELS } from "@/lib/workflow-customizer";
import type { RoleWorksheet, SopOutput } from "@/types/workflow";

export interface ExecutiveSummary {
  headline: string;
  northStar: string;
  priorities: { title: string; detail: string }[];
  onboardingAdvice: string;
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

/**
 * 上手路径建议：不问用户，按已有答案自动写入总纲。
 * 原则：阶段影响建议怎么说，不影响标准是什么——任务清单本体对所有人唯一。
 */
export function getOnboardingAdvice(output: SopOutput): string {
  if (output.teamSize === "solo") {
    return "前 4 周先只跑 P0 任务，跑顺了再逐步加 P1。";
  }
  if (output.primaryProblem === "lack_of_metrics") {
    return "先拿完成标准自查 2 周，找到差距再上量。";
  }
  return "直接进入全量节奏，P0 先行，P2 可暂缓。";
}

export function getExecutiveSummary(output: SopOutput): ExecutiveSummary {
  const primary = getPrimaryWorksheet(output);
  const teamLabel = getOptionLabel("teamSize", output.teamSize);
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

  return {
    headline: `为${industryLabel}「${output.company.businessModel}」团队生成 ${output.overview.length} 份岗位工作纸，适配 ${teamLabel}团队。`,
    northStar: primary?.northStar ?? "先把核心流程跑通，形成可复用的标准动作。",
    priorities: priorities.slice(0, 3),
    onboardingAdvice: getOnboardingAdvice(output)
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
  const { company, situation, contextAnswers } = output;
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
      body:
        contextAnswers?.hasLegalReviewer === "yes"
          ? "所属行业偏强监管，发布前走一遍法务/审核把关，并把审核节点写进标准流程。"
          : "所属行业偏强监管且暂时没有法务/审核支持，发布前务必完成合规自查，先建好敏感词清单与发布前自查表。"
    });
  }

  if (contextAnswers?.livestreamGoods === "own_goods") {
    injections.push({
      title: "直播提示",
      body: "自有货源：定价与让利空间自己定，把库存周转和售后履约写进直播复盘。"
    });
  } else if (contextAnswers?.livestreamGoods === "consignment") {
    injections.push({
      title: "直播提示",
      body: "帮别人卖：重点核对佣金结算、退换责任归属与样品管理，避免售后纠纷。"
    });
  }

  if (contextAnswers?.privateDomainSize === "lt500") {
    injections.push({
      title: "私域提示",
      body: "私域好友 0–500：适合 1 对 1 深度维护，优先做标签和信任，不急着做裂变。"
    });
  } else if (contextAnswers?.privateDomainSize === "500_to_5000") {
    injections.push({
      title: "私域提示",
      body: "私域好友 500–5000：开始分层运营，用社群 + 朋友圈节奏化触达。"
    });
  } else if (contextAnswers?.privateDomainSize === "gt5000") {
    injections.push({
      title: "私域提示",
      body: "私域好友 5000+：需要工具化 SOP（欢迎语、分层、群发规范），并关注账号安全。"
    });
  }

  if (situation.platforms.length > 0) {
    injections.push({
      title: "平台提示",
      body: `优先覆盖 ${situation.platforms.map(getPlatformLabel).join("、")}，按各平台口径调整标题、封面与发布时间。`
    });
  }

  return injections;
}

function worksheetToMarkdown(
  worksheet: RoleWorksheet,
  level: "##" | "###",
  heading = worksheet.name,
  priorities?: StepPriority[]
): string {
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
    const priority = priorities?.[index];
    const priorityMark = priority === "P0" ? "【P0·重点改造】" : priority === "P1" ? "【P1】" : "";
    lines.push(`${index + 1}. ${priorityMark}**${step.title}**${owner}`);
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
  lines.push(`- 平台：${output.situation.platforms.map(getPlatformLabel).join("、")}`);
  lines.push(`- 预算：${getBudgetTierLabel(output.situation.budgetTier)}`);
  if (output.contextAnswers?.livestreamGoods) {
    lines.push(`- 直播货源：${output.contextAnswers.livestreamGoods === "own_goods" ? "货是自己的" : "帮别人卖"}`);
  }
  if (output.contextAnswers?.privateDomainSize) {
    const sizeLabel =
      output.contextAnswers.privateDomainSize === "lt500"
        ? "0–500"
        : output.contextAnswers.privateDomainSize === "500_to_5000"
          ? "500–5000"
          : "5000+";
    lines.push(`- 私域好友规模：${sizeLabel}`);
  }
  if (output.contextAnswers?.hasLegalReviewer) {
    lines.push(`- 法务/审核把关：${output.contextAnswers.hasLegalReviewer === "yes" ? "有" : "没有"}`);
  }
  lines.push("");
  lines.push("## 本次优化重点");
  lines.push(`- 团队：${getOptionLabel("teamSize", output.teamSize)}`);
  lines.push(`- 优先解决：${problemLabel}`);
  if (output.attributions && output.primaryProblem !== "other") {
    output.overview.forEach((worksheet) => {
      const attribution = output.attributions?.[worksheet.operationType];
      if (attribution) {
        lines.push(
          `- ${worksheet.name}（归因：${getAttributionDef(attribution).label}）：${buildFocusLine(worksheet.operationType, attribution)}`
        );
      }
    });
  } else {
    lines.push(`- 重点：${EMPHASIS_FOCUS[output.primaryProblem]}`);
  }
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
  lines.push(`**上手路径建议**：${summary.onboardingAdvice}`);
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
    const priorities =
      output.attributions && output.primaryProblem !== "other"
        ? worksheet.steps.map((step) => getStepPriority(step.tags, worksheet.operationType, output))
        : undefined;
    lines.push(worksheetToMarkdown(worksheet, "###", worksheet.name, priorities));
  });

  if (output.subFlows.length > 0) {
    lines.push("");
    lines.push("## 子流程");
    output.subFlows.forEach((subFlow) => {
      lines.push("");
      const priorities =
        output.attributions && output.primaryProblem !== "other"
          ? subFlow.worksheet.steps.map((step) =>
              getStepPriority(step.tags, subFlow.worksheet.operationType, output)
            )
          : undefined;
      lines.push(worksheetToMarkdown(subFlow.worksheet, "###", subFlow.subcategory.name, priorities));
    });
  }

  return lines.join("\n");
}
