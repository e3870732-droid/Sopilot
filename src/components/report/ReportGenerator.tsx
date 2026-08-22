"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Download,
  Loader2,
  Printer,
  RefreshCw,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assembleReport,
  toReportMarkdown,
  type OverviewReport,
  type RoleReport,
  type SopReport
} from "@/lib/sop-report";
import type { OperationType } from "@/types/user-profile";
import type { SopOutput } from "@/types/workflow";
import { ReportView } from "./ReportView";

type StepStatus = "pending" | "running" | "done" | "failed";

interface StepDefinition {
  id: string;
  label: string;
}

interface GenerateRoleResponse {
  source: "ai" | "fallback";
  operationType: OperationType;
  name: string;
  roleBrief: string;
  priorityTasks: string[];
  checklist: string[];
  risks: string[];
}

export function ReportGenerator({ output }: { output: SopOutput }) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, StepStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [report, setReport] = useState<SopReport | null>(null);
  const [copied, setCopied] = useState(false);
  const startedRef = useRef(false);
  const resultsRef = useRef<{
    overview: OverviewReport | null;
    roles: Record<string, RoleReport>;
  }>({ overview: null, roles: {} });

  const stepDefs = useMemo<StepDefinition[]>(
    () => [
      { id: "overview", label: "执行总览" },
      ...output.overview.map((worksheet) => ({
        id: `role:${worksheet.operationType}`,
        label: worksheet.name
      }))
    ],
    [output]
  );

  function buildTarget(step: StepDefinition) {
    if (step.id === "overview") {
      return { kind: "overview" as const };
    }
    return {
      kind: "role" as const,
      operationType: step.id.replace("role:", "") as OperationType
    };
  }

  async function fetchStep(step: StepDefinition) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ output, target: buildTarget(step) })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error || "生成失败");
    }

    return response.json();
  }

  function applyResult(step: StepDefinition, result: unknown) {
    if (step.id === "overview") {
      resultsRef.current.overview = result as OverviewReport;
      return;
    }

    const operationType = step.id.replace("role:", "") as OperationType;
    const worksheet = output.overview.find((item) => item.operationType === operationType);
    if (!worksheet) {
      return;
    }

    const role = result as GenerateRoleResponse;
    resultsRef.current.roles[operationType] = {
      source: role.source,
      operationType: role.operationType,
      name: role.name,
      roleBrief: role.roleBrief,
      priorityTasks: role.priorityTasks,
      checklist: role.checklist,
      risks: role.risks,
      worksheet,
      subFlows: output.subFlows.filter(
        (subFlow) => subFlow.subcategory.operationType === operationType
      )
    };
  }

  async function runFrom(startIndex: number) {
    setErrors({});
    setStatuses((previous) => {
      const next = { ...previous };
      stepDefs.slice(startIndex).forEach((step) => delete next[step.id]);
      return next;
    });

    for (let index = startIndex; index < stepDefs.length; index += 1) {
      const step = stepDefs[index];
      setStatuses((previous) => ({ ...previous, [step.id]: "running" }));

      try {
        const result = await fetchStep(step);
        applyResult(step, result);
        setStatuses((previous) => ({ ...previous, [step.id]: "done" }));
      } catch (error) {
        setStatuses((previous) => ({ ...previous, [step.id]: "failed" }));
        setErrors((previous) => ({
          ...previous,
          [step.id]: error instanceof Error ? error.message : "生成失败"
        }));
        return;
      }
    }

    const overview = resultsRef.current.overview;
    if (overview) {
      const roles = output.overview
        .map((worksheet) => resultsRef.current.roles[worksheet.operationType])
        .filter((role): role is RoleReport => Boolean(role));
      setReport(assembleReport(output, overview, roles));
    }
  }

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    void runFrom(0);
  }, []);

  function retryFailedStep() {
    const failedIndex = stepDefs.findIndex((step) => statuses[step.id] === "failed");
    if (failedIndex >= 0) {
      void runFrom(failedIndex);
    }
  }

  function restartAll() {
    resultsRef.current = { overview: null, roles: {} };
    setReport(null);
    void runFrom(0);
  }

  async function copyMarkdown() {
    if (!report) {
      return;
    }

    const markdown = toReportMarkdown(report);
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function downloadMarkdown() {
    if (!report) {
      return;
    }

    const blob = new Blob([toReportMarkdown(report)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sop-report.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    window.print();
  }

  const doneCount = stepDefs.filter((step) => statuses[step.id] === "done").length;
  const failedStep = stepDefs.find((step) => statuses[step.id] === "failed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft />
          返回
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {report ? (
            <>
              <Button variant="outline" size="sm" onClick={copyMarkdown}>
                {copied ? <Check /> : <ClipboardCopy />}
                {copied ? "已复制" : "复制 Markdown"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                <Download />
                下载 Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={exportPdf}>
                <Printer />
                导出 PDF
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {!report ? (
        <Card>
          <CardHeader>
            <CardTitle>正在生成 SOP 报告</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                第 {Math.min(doneCount + (failedStep ? 0 : 1), stepDefs.length)} / {stepDefs.length} 步
              </span>
              <span className="text-muted-foreground">{doneCount}/{stepDefs.length} 已完成</span>
            </div>
            <div className="space-y-2">
              {stepDefs.map((step, index) => {
                const status = statuses[step.id] ?? "pending";
                return (
                  <div key={step.id} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {status === "running" ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : status === "done" ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : status === "failed" ? (
                        <X className="h-4 w-4 text-destructive" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-muted" />
                      )}
                    </span>
                    <span
                      className={
                        status === "done"
                          ? "text-foreground"
                          : status === "failed"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }
                    >
                      {index + 1}. {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {failedStep ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="font-medium text-destructive">
                  第 {stepDefs.indexOf(failedStep) + 1} 步「{failedStep.label}」生成失败
                </p>
                <p className="mt-1 text-muted-foreground">{errors[failedStep.id]}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={retryFailedStep}>
                    <RefreshCw />
                    重试此步
                  </Button>
                  <Button size="sm" variant="outline" onClick={restartAll}>
                    重新生成全部
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <ReportView report={report} />
      )}
    </div>
  );
}
