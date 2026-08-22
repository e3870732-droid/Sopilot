import type { CompanyScale, Industry } from "@/types/company";
import type { BudgetTier, Platform, Stage } from "@/types/situation";
import type { OperationType, PrimaryProblem, TeamSize } from "@/types/user-profile";
import type { CustomSubcategory } from "@/types/workflow";

export interface QuestionnaireDraft {
  step: number;
  industry: Industry | null;
  businessModel: string;
  companyScale: CompanyScale | null;
  selectedOperationTypes: OperationType[];
  selectedSubcategoryIds: string[];
  customSubcategories: CustomSubcategory[];
  teamSize: TeamSize | null;
  stage: Stage | null;
  platforms: Platform[];
  budgetTier: BudgetTier | null;
  primaryProblem: PrimaryProblem | null;
}

const STORAGE_KEY = "sopilot:questionnaire:draft";

function normalizeDraft(value: Partial<QuestionnaireDraft>): QuestionnaireDraft {
  return {
    step: typeof value.step === "number" ? value.step : 0,
    industry: value.industry ?? null,
    businessModel: typeof value.businessModel === "string" ? value.businessModel : "",
    companyScale: value.companyScale ?? null,
    selectedOperationTypes: Array.isArray(value.selectedOperationTypes) ? value.selectedOperationTypes : [],
    selectedSubcategoryIds: Array.isArray(value.selectedSubcategoryIds) ? value.selectedSubcategoryIds : [],
    customSubcategories: Array.isArray(value.customSubcategories) ? value.customSubcategories : [],
    teamSize: value.teamSize ?? null,
    stage: value.stage ?? null,
    platforms: Array.isArray(value.platforms) ? value.platforms : [],
    budgetTier: value.budgetTier ?? null,
    primaryProblem: value.primaryProblem ?? null
  };
}

export function loadQuestionnaireDraft(): QuestionnaireDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return normalizeDraft(JSON.parse(raw) as Partial<QuestionnaireDraft>);
  } catch {
    return null;
  }
}

export function saveQuestionnaireDraft(draft: QuestionnaireDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // 忽略隐私模式或存储空间导致的失败
  }
}

export function clearQuestionnaireDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 忽略隐私模式导致的失败
  }
}
