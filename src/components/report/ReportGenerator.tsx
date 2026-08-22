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
  Send,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assembleReport,
  buildFallbackOverview,
  buildFallbackRole,
  toReportMarkdown,
  type FollowUpItem,
  type OverviewReport,
  type RoleReport,
  type SopReport
} from "@/lib/sop-report";
import { getReportSignature, loadReportDraft, saveReportDraft } from "@/lib/report-draft";
import type { OperationType } from "@/types/user-profile";
import type { SopOutput } from "@/types/workflow";
import { ReportAdjustPanel } from "./ReportAdjustPanel";
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
  const [currentOutput, setCurrentOutput] = useState<SopOutput>(output);
  const outputRef = useRef<SopOutput>(output);
  const [statuses, setStatuses] = useState<Record<string, StepStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [report, setReport] = useState<SopReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const resultsRef = useRef<{
    overview: OverviewReport | null;
    roles: Record<string, RoleReport>;
  }>({ overview: null, roles: {} });

  const stepDefs = useMemo<StepDefinition[]>(
    () => [
      { id: "overview", label: "执行总览" },
      ...currentOutput.overview.map((worksheet) => ({
        id: `role:${worksheet.operationType}`,
        label: worksheet.name
      }))
    ],
    [currentOutput]
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

  // 静态演示版：不依赖后端 API，直接在浏览器端生成确定性建议
  async function fetchStep(step: StepDefinition) {
    // 保留逐步生成的节奏感
    await new Promise((resolve) => setTimeout(resolve, 400));

    const target = buildTarget(step);
    if (target.kind === "overview") {
      return buildFallbackOverview(outputRef.current);
    }

    const worksheet = outputRef.current.overview.find(
      (item) => item.operationType === target.operationType
    );
    if (!worksheet) {
      throw new Error("未找到对应岗位");
    }
    return buildFallbackRole(outputRef.current, worksheet);
  }

  function applyResult(step: StepDefinition, result: unknown) {
    if (step.id === "overview") {
      resultsRef.current.overview = result as OverviewReport;
      return;
    }

    const operationType = step.id.replace("role:", "") as OperationType;
    const worksheet = outputRef.current.overview.find((item) => item.operationType === operationType);
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
      subFlows: outputRef.current.subFlows.filter(
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
      const roles = outputRef.current.overview
        .map((worksheet) => resultsRef.current.roles[worksheet.operationType])
        .filter((role): role is RoleReport => Boolean(role));
      setReport(assembleReport(outputRef.current, overview, roles));
    }
  }

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const draft = loadReportDraft();
    if (draft && draft.signature === getReportSignature(outputRef.current)) {
      resultsRef.current = {
        overview: draft.report.overview,
        roles: Object.fromEntries(draft.report.roles.map((role) => [role.operationType, role]))
      };
      setReport(draft.report);
    } else {
      void runFrom(0);
    }
  }, []);

  useEffect(() => {
    if (report) {
      saveReportDraft(report);
    }
  }, [report]);

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

  function buildAdjustedQuery(next: SopOutput): string {
    const params = new URLSearchParams(window.location.search);
    params.set("stage", next.situation.stage);
    params.delete("platform");
    next.situation.platforms.forEach((platform) => params.append("platform", platform));
    params.set("budgetTier", next.situation.budgetTier);
    params.set("teamSize", next.teamSize);
    params.set("primaryProblem", next.primaryProblem);
    if (next.customPrimaryProblem) {
      params.set("customPrimaryProblem", next.customPrimaryProblem);
    } else {
      params.delete("customPrimaryProblem");
    }
    return params.toString();
  }

  function handleApplyAdjustment(next: SopOutput) {
    outputRef.current = next;
    setCurrentOutput(next);
    window.history.replaceState(null, "", `${window.location.pathname}?${buildAdjustedQuery(next)}`);
    resultsRef.current = { overview: null, roles: {} };
    setReport(null);
    setStatuses({});
    setErrors({});
    void runFrom(0);
  }

  async function askFollowUp() {
    const value = question.trim();
    if (!value || chatLoading || !report) {
      return;
    }

    // 静态演示版：AI 追问依赖后端 API，在纯静态托管下不可用
    setChatError("当前为静态演示版，AI 追问功能不可用。报告正文已由内置规则生成。");
  }

  async function askFollowUpWithApi() {
    const value = question.trim();
    if (!value || chatLoading || !report) {
      return;
    }

    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          output: outputRef.current,
          question: value,
          followUps: report.followUps
        })
      });

      const data = (await response.json().catch(() => null)) as {
        answer?: string;
        source?: FollowUpItem["source"];
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || "追问失败");
      }
      if (!data?.answer) {
        throw new Error("模型返回内容为空");
      }

      const item: FollowUpItem = {
        id: `${Date.now()}`,
        question: value,
        answer: data.answer,
        source: data.source ?? "ai",
        createdAt: new Date().toISOString()
      };

      setReport((previous) =>
        previous ? { ...previous, followUps: [...previous.followUps, item] } : previous
      );
      setQuestion("");
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "追问失败");
    } finally {
      setChatLoading(false);
    }
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
        <Button variant="ghost" onClick={() => router.push(`/result${window.location.search}`)}>
          <ArrowLeft />
          返回预览
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {report ? (
            <>
              <Button variant="outline" size="sm" onClick={restartAll}>
                <RefreshCw />
                重新生成
              </Button>
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
              <span className="text-muted-foreground">
                {doneCount}/{stepDefs.length} 已完成
              </span>
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
        <div className="space-y-6">
          <ReportAdjustPanel output={outputRef.current} onApply={handleApplyAdjustment} />
          <ReportView report={report} />

          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>继续追问</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.followUps.map((item) => (
                <div key={item.id} className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Q：{item.question}</p>
                  <p className="mt-1 text-muted-foreground">A：{item.answer}</p>
                </div>
              ))}
              {chatError ? <p className="text-sm text-destructive">{chatError}</p> : null}
              <div className="flex gap-2">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void askFollowUp();
                    }
                  }}
                  placeholder="例如：预算改成 5 万，帮我调整本周计划"
                  className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
                <Button onClick={() => void askFollowUp()} disabled={chatLoading || !question.trim()}>
                  {chatLoading ? <Loader2 className="animate-spin" /> : <Send />}
                  发送
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
