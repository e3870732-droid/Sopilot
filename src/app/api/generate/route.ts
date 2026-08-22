import { NextResponse } from "next/server";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel, getStageLabel } from "@/data/situation";
import { buildFallbackOverview, buildFallbackRole } from "@/lib/sop-report";
import type { OperationType } from "@/types/user-profile";
import type { SopOutput } from "@/types/workflow";

export const runtime = "nodejs";

type GenerateTarget = { kind: "overview" } | { kind: "role"; operationType: OperationType };

interface GenerateRequest {
  output: SopOutput;
  target: GenerateTarget;
}

const SYSTEM_PROMPT = `你是一名企业运营 SOP 顾问。你擅长把结构化运营流程改写成贴合企业实际情况、可直接执行的行动建议。

要求：
1. 只输出 JSON，不要输出 Markdown 代码块或多余解释。
2. 所有内容使用中文。
3. 建议必须可落地、不空泛，并体现企业画像、阶段、平台、预算和首要问题的差异。
4. 不要编造题目中没有的信息。`;

function getProblemLabel(output: SopOutput): string {
  if (output.primaryProblem === "other") {
    return output.customPrimaryProblem || "其他";
  }
  return getOptionLabel("primaryProblem", output.primaryProblem);
}

function buildContextLines(output: SopOutput): string[] {
  const lines: string[] = [];
  lines.push("【企业】");
  lines.push(`- 行业：${getIndustryLabel(output.company.industry)}`);
  lines.push(`- 业务模式：${output.company.businessModel}`);
  lines.push(`- 企业规模：${getCompanyScaleLabel(output.company.companyScale)}`);
  lines.push("");
  lines.push("【现状与卡点】");
  lines.push(`- 运营阶段：${getStageLabel(output.situation.stage)}`);
  lines.push(`- 主要平台：${output.situation.platforms.map(getPlatformLabel).join("、")}`);
  lines.push(`- 月投放预算：${getBudgetTierLabel(output.situation.budgetTier)}`);
  lines.push(`- 首要问题：${getProblemLabel(output)}`);
  lines.push("");
  lines.push("【团队】");
  lines.push(`- 参与人数：${getOptionLabel("teamSize", output.teamSize)}`);
  return lines;
}

function buildOverviewPrompt(output: SopOutput): string {
  const lines = buildContextLines(output);
  lines.push("");
  lines.push("【已选岗位工作纸】");
  output.overview.forEach((worksheet) => {
    lines.push(`- ${worksheet.name}：${worksheet.northStar}`);
    lines.push(`  流程：${worksheet.steps.map((step) => step.title).join(" → ")}`);
  });
  lines.push("");
  lines.push("请输出这份报告的全局执行建议，严格按以下 JSON 结构：");
  lines.push("{");
  lines.push('  "executiveBrief": "150 字以内的执行简报",');
  lines.push('  "weeklyPlan": ["本周行动 1", "本周行动 2", "本周行动 3"],');
  lines.push('  "risks": ["风险或提醒 1", "风险或提醒 2"]');
  lines.push("}");
  return lines.join("\n");
}

function buildRolePrompt(output: SopOutput, operationType: OperationType): string {
  const worksheet = output.overview.find((item) => item.operationType === operationType);
  const subFlows = output.subFlows.filter(
    (item) => item.subcategory.operationType === operationType
  );

  const lines = buildContextLines(output);
  lines.push("");
  lines.push("【当前要生成的岗位】");
  if (worksheet) {
    lines.push(`- 岗位：${worksheet.name}`);
    lines.push(`- 北极星：${worksheet.northStar}`);
    lines.push(`- 流程：${worksheet.steps.map((step) => step.title).join(" → ")}`);
    lines.push(`- 关键指标：${worksheet.kpis.join("、")}`);
  }
  if (subFlows.length > 0) {
    lines.push(`- 涉及子类：${subFlows.map((item) => item.subcategory.name).join("、")}`);
  }
  lines.push("");
  lines.push("请针对该岗位输出定制建议，严格按以下 JSON 结构：");
  lines.push("{");
  lines.push('  "roleBrief": "该岗位的定制定位，120 字以内",');
  lines.push('  "priorityTasks": ["本阶段重点任务 1", "重点任务 2", "重点任务 3"],');
  lines.push('  "checklist": ["关键检查清单 1", "检查清单 2"],');
  lines.push('  "risks": ["该岗位风险或提醒 1", "风险或提醒 2"]');
  lines.push("}");
  return lines.join("\n");
}

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error("无法解析模型输出");
  }
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function callModel(
  apiKey: string,
  model: string,
  baseUrl: string,
  prompt: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.6
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`模型请求失败（${response.status}）：${errorText.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content.trim()) {
    throw new Error("模型返回内容为空");
  }

  return extractJson(content);
}

export async function POST(request: Request) {
  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  const { output, target } = body;
  if (!output || !Array.isArray(output.overview) || output.overview.length === 0 || !target) {
    return NextResponse.json({ error: "缺少有效的问卷输出" }, { status: 400 });
  }

  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = (process.env.LLM_BASE_URL || "https://aiping.cn/api/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "deepseek-v4-pro";

  if (target.kind === "overview") {
    if (!apiKey) {
      return NextResponse.json(buildFallbackOverview(output));
    }

    try {
      const parsed = await callModel(apiKey, model, baseUrl, buildOverviewPrompt(output));
      const overview = {
        source: "ai" as const,
        executiveBrief: toStringValue(parsed.executiveBrief),
        weeklyPlan: toStringArray(parsed.weeklyPlan),
        risks: toStringArray(parsed.risks)
      };

      if (!overview.executiveBrief && overview.weeklyPlan.length === 0) {
        return NextResponse.json(buildFallbackOverview(output));
      }

      return NextResponse.json(overview);
    } catch (error) {
      console.error("生成执行总览失败：", error);
      return NextResponse.json(buildFallbackOverview(output));
    }
  }

  const worksheet = output.overview.find((item) => item.operationType === target.operationType);
  if (!worksheet) {
    return NextResponse.json({ error: "未找到对应岗位" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json(buildFallbackRole(output, worksheet));
  }

  try {
    const parsed = await callModel(apiKey, model, baseUrl, buildRolePrompt(output, target.operationType));
    const role = {
      source: "ai" as const,
      operationType: target.operationType,
      name: worksheet.name,
      roleBrief: toStringValue(parsed.roleBrief),
      priorityTasks: toStringArray(parsed.priorityTasks),
      checklist: toStringArray(parsed.checklist),
      risks: toStringArray(parsed.risks)
    };

    if (!role.roleBrief && role.priorityTasks.length === 0) {
      return NextResponse.json(buildFallbackRole(output, worksheet));
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error(`生成岗位「${worksheet.name}」失败：`, error);
    return NextResponse.json(buildFallbackRole(output, worksheet));
  }
}
