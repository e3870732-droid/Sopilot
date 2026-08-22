import type { SopReport } from "@/lib/sop-report";
import type { SopOutput } from "@/types/workflow";

export interface ReportDraft {
  signature: string;
  report: SopReport;
}

const STORAGE_KEY = "sopilot:report";

export function getReportSignature(output: SopOutput): string {
  return JSON.stringify({
    industry: output.company.industry,
    businessModel: output.company.businessModel,
    companyScale: output.company.companyScale,
    platforms: output.situation.platforms,
    budgetTier: output.situation.budgetTier,
    contextAnswers: output.contextAnswers ?? {},
    teamSize: output.teamSize,
    primaryProblem: output.primaryProblem,
    customPrimaryProblem: output.customPrimaryProblem ?? "",
    operationTypes: output.overview.map((worksheet) => worksheet.operationType),
    subFlows: output.subFlows.map((subFlow) => ({
      id: subFlow.subcategory.id,
      name: subFlow.subcategory.name
    }))
  });
}

export function saveReportDraft(report: SopReport): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const draft: ReportDraft = {
      signature: getReportSignature(report.output),
      report
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // 忽略隐私模式或存储空间导致的失败
  }
}

export function loadReportDraft(): ReportDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ReportDraft;
    if (!parsed?.report?.output || !Array.isArray(parsed.report.roles)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function hasReportDraft(): boolean {
  return loadReportDraft() !== null;
}

export function clearReportDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 忽略失败
  }
}
