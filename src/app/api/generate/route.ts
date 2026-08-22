import { NextResponse } from "next/server";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel, getStageLabel } from "@/data/situation";
import { getContextInjections, getExecutiveSummary } from "@/lib/workflow-enrichment";
import type { SopOutput } from "@/types/workflow";

export const runtime = "nodejs";

interface GenerateResponse {
  source: "ai" | "fallback";
  executiveBrief: string;
  weeklyPlan: string[];
  risks: string[];
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

function buildUserPrompt(output: SopOutput): string {
  const lines: string[] = [];
  lines.push("请基于以下信息，为这家企业生成定制化 SOP 建议。");
  lines.push("");
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
  lines.push("");
  lines.push("【已选岗位工作纸】");
  output.overview.forEach((worksheet) => {
    lines.push(`- ${worksheet.name}：${worksheet.northStar}`);
    lines.push(`  流程：${worksheet.steps.map((step) => step.title).join(" → ")}`);
  });
  if (output.subFlows.length > 0) {
    lines.push("");
    lines.push("【已选子类】");
    output.subFlows.forEach((subFlow) => {
      lines.push(`- ${subFlow.subcategory.name}（复用${subFlow.worksheet.name}工作流）`);
    });
  }
  lines.push("");
  lines.push("请严格输出以下 JSON 结构：");
  lines.push("{");
  lines.push('  "executiveBrief": "150 字以内的执行简报",');
  lines.push('  "weeklyPlan": ["本周行动 1", "本周行动 2", "本周行动 3"],');
  lines.push('  "risks": ["风险或提醒 1", "风险或提醒 2"]');
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

function toGenerateResponse(parsed: Record<string, unknown>): GenerateResponse {
  const executiveBrief =
    typeof parsed.executiveBrief === "string" && parsed.executiveBrief.trim()
      ? parsed.executiveBrief.trim()
      : "";
  const weeklyPlan = Array.isArray(parsed.weeklyPlan)
    ? parsed.weeklyPlan.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const risks = Array.isArray(parsed.risks)
    ? parsed.risks.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return { source: "ai", executiveBrief, weeklyPlan, risks };
}

function deterministicFallback(output: SopOutput): GenerateResponse {
  const summary = getExecutiveSummary(output);
  const injections = getContextInjections(output);

  return {
    source: "fallback",
    executiveBrief: `${summary.headline}。北极星：${summary.northStar}`,
    weeklyPlan: summary.priorities.map((priority) => `${priority.title}：${priority.detail}`),
    risks: injections.map((item) => `${item.title}：${item.body}`)
  };
}

export async function POST(request: Request) {
  let output: SopOutput;
  try {
    output = (await request.json()) as SopOutput;
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  if (!output || !Array.isArray(output.overview) || output.overview.length === 0) {
    return NextResponse.json({ error: "缺少有效的问卷输出" }, { status: 400 });
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(deterministicFallback(output));
  }

  const baseUrl = (process.env.LLM_BASE_URL || "https://aiping.cn/api/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "deepseek-v4-pro";

  try {
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
          { role: "user", content: buildUserPrompt(output) }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM 请求失败：", response.status, errorText);
      return NextResponse.json(deterministicFallback(output));
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) {
      return NextResponse.json(deterministicFallback(output));
    }

    return NextResponse.json(toGenerateResponse(extractJson(content)));
  } catch (error) {
    console.error("LLM 生成失败：", error);
    return NextResponse.json(deterministicFallback(output));
  }
}
