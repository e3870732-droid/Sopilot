import { NextResponse } from "next/server";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel, getStageLabel } from "@/data/situation";
import type { SopOutput } from "@/types/workflow";

export const runtime = "nodejs";

interface FollowUpInput {
  question: string;
  answer: string;
}

interface ChatRequest {
  output: SopOutput;
  question: string;
  followUps?: FollowUpInput[];
}

const SYSTEM_PROMPT = `你是一名企业运营 SOP 顾问。请基于给出的企业画像、岗位工作纸和上下文，直接回答用户的追问。

要求：
1. 使用中文，回答简洁、可落地、不空泛。
2. 只输出回答正文，不要 Markdown 代码块或 JSON。
3. 回答必须结合企业画像、阶段、平台、预算和团队规模。
4. 不要编造题目中没有的信息。`;

function getProblemLabel(output: SopOutput): string {
  if (output.primaryProblem === "other") {
    return output.customPrimaryProblem || "其他";
  }
  return getOptionLabel("primaryProblem", output.primaryProblem);
}

function buildPrompt(output: SopOutput, question: string, followUps: FollowUpInput[]): string {
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
  lines.push("");
  lines.push("【已选岗位】");
  output.overview.forEach((worksheet) => {
    lines.push(`- ${worksheet.name}：${worksheet.northStar}`);
  });

  if (followUps.length > 0) {
    lines.push("");
    lines.push("【之前的追问】");
    followUps.slice(-6).forEach((item) => {
      lines.push(`Q：${item.question}`);
      lines.push(`A：${item.answer}`);
    });
  }

  lines.push("");
  lines.push(`【当前追问】${question}`);
  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  const { output, question } = body;
  const followUps = Array.isArray(body.followUps) ? body.followUps : [];

  if (!output || !Array.isArray(output.overview) || output.overview.length === 0 || !question?.trim()) {
    return NextResponse.json({ error: "缺少有效的追问上下文" }, { status: 400 });
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "未配置 LLM_API_KEY" }, { status: 503 });
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
          { role: "user", content: buildPrompt(output, question.trim(), followUps) }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("追问请求失败：", response.status, errorText);
      return NextResponse.json({ error: "追问生成失败" }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return NextResponse.json({ error: "模型返回内容为空" }, { status: 502 });
    }

    return NextResponse.json({ source: "ai", answer });
  } catch (error) {
    console.error("追问生成失败：", error);
    return NextResponse.json({ error: "追问生成失败" }, { status: 502 });
  }
}
