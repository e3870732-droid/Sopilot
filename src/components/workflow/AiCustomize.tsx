"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SopOutput } from "@/types/workflow";

interface AiCustomizeProps {
  output: SopOutput;
}

interface GenerateResponse {
  source: "ai" | "fallback";
  executiveBrief: string;
  weeklyPlan: string[];
  risks: string[];
}

export function AiCustomize({ output }: AiCustomizeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(output)
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "生成失败，请稍后重试");
      }

      setResult((await response.json()) as GenerateResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle>AI 定制建议</CardTitle>
          {result ? <Badge variant="secondary">{result.source === "ai" ? "AI 生成" : "默认方案"}</Badge> : null}
        </div>
        <Button size="sm" onClick={handleGenerate} disabled={loading}>
          <Sparkles />
          {loading ? "生成中…" : result ? "重新生成" : "开始生成"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {result ? (
          <>
            <div>
              <div className="font-medium">执行简报</div>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{result.executiveBrief}</p>
            </div>
            <div>
              <div className="font-medium">本周计划</div>
              <ol className="mt-1 space-y-1 text-muted-foreground">
                {result.weeklyPlan.map((item, index) => (
                  <li key={index}>
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="font-medium">风险与提醒</div>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                {result.risks.map((item, index) => (
                  <li key={index}>· {item}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          !loading ? (
            <p className="text-muted-foreground">
              点击「开始生成」，用 AI 基于你的企业画像生成更贴合的执行建议。
            </p>
          ) : null
        )}
      </CardContent>
    </Card>
  );
}
