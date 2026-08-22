import type { OperationType, PrimaryEmphasis, PrimaryProblem, TeamSize } from "./user-profile";
import type { CompanyProfile } from "./company";
import type { SituationProfile } from "./situation";

export interface Subcategory {
  id: string;
  operationType: OperationType;
  name: string;
}

export interface CustomSubcategory {
  operationType: OperationType;
  name: string;
}

/**
 * 条件追问的答案（只在命中条件时存在）：
 * - 选了「直播运营」子类 → livestreamGoods
 * - 选了「私域运营」子类 → privateDomainSize
 * - 行业属于强监管（医疗/金融/教育）→ hasLegalReviewer
 */
export interface ContextAnswers {
  livestreamGoods?: "own_goods" | "consignment";
  privateDomainSize?: "lt500" | "500_to_5000" | "gt5000";
  hasLegalReviewer?: "yes" | "no";
}

export interface WorksheetStep {
  title: string;
  action: string;
  owner?: string;
  handoff?: string;
  proof: string;
}

export interface CadenceItem {
  rhythm: string;
  actions: string;
}

export interface ScaleAdaptation {
  position: string;
  focus: string;
  add: string;
  remove: string;
}

export interface RoleWorksheet {
  id: string;
  operationType: OperationType;
  category: string;
  name: string;
  northStar: string;
  output: string;
  cycle: string;
  steps: WorksheetStep[];
  cadence: CadenceItem[];
  deliverables: string[];
  collaboration: string[];
  kpis: string[];
  guardrails: string[];
}

export interface SubFlow {
  subcategory: Subcategory;
  worksheet: RoleWorksheet;
}

export interface QuestionnaireSelection {
  company: CompanyProfile;
  situation: SituationProfile;
  operationTypes: OperationType[];
  subcategoryIds: string[];
  customSubcategories: CustomSubcategory[];
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
  customPrimaryProblem?: string;
  contextAnswers?: ContextAnswers;
}

export interface SopOutput {
  company: CompanyProfile;
  situation: SituationProfile;
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
  customPrimaryProblem?: string;
  contextAnswers?: ContextAnswers;
  emphasis: PrimaryEmphasis;
  overview: RoleWorksheet[];
  subFlows: SubFlow[];
}
