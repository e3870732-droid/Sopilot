"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GenerateReportButton } from "@/components/report/GenerateReportButton";
import { ResumeReportButton } from "@/components/report/ResumeReportButton";
import { ResultActions } from "@/components/workflow/ResultActions";
import { WorkflowPreview } from "@/components/workflow/WorkflowPreview";
import { Button } from "@/components/ui/button";
import { parseSopOutputFromSearchParams, type SearchParams } from "@/lib/parse-sop-output";
import { toMarkdown } from "@/lib/workflow-enrichment";

function toSearchParams(searchParams: ReturnType<typeof useSearchParams>): SearchParams {
  const params: SearchParams = {};
  searchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing === undefined) {
      params[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      params[key] = [existing, value];
    }
  });
  return params;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const output = parseSopOutputFromSearchParams(toSearchParams(searchParams));

  if (!output) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">缺少有效的问卷答案</h1>
          <p className="text-muted-foreground">请重新回答问卷，以生成岗位工作纸。</p>
          <Button asChild>
            <Link href="/questionnaire">返回问卷</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <ResultActions markdown={toMarkdown(output)} />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">你的岗位工作纸</h1>
          <p className="text-muted-foreground">先预览确定性工作纸，确认后生成完整 SOP 报告。</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <GenerateReportButton />
          <ResumeReportButton output={output} />
        </div>

        <WorkflowPreview output={output} />
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
