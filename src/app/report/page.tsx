"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ReportGenerator } from "@/components/report/ReportGenerator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseSopOutputFromSearchParams, type SearchParams } from "@/lib/parse-sop-output";

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

function ReportContent() {
  const searchParams = useSearchParams();
  const output = parseSopOutputFromSearchParams(toSearchParams(searchParams));

  if (!output) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">缺少有效的问卷答案</h1>
          <p className="text-muted-foreground">请重新回答问卷，以生成 SOP 报告。</p>
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">SOP 报告</h1>
            <Badge variant="outline">结构化输出</Badge>
          </div>
          <p className="text-muted-foreground">
            系统将自动按岗位逐步生成定制建议，完成后可导出 Markdown 或 PDF。
          </p>
        </div>

        <ReportGenerator output={output} />
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportContent />
    </Suspense>
  );
}
