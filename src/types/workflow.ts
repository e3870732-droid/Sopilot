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

/** 痛点归因 key：每个首要问题下各 4 个归因方向 */
export type AttributionKey =
  | "not_documented"
  | "documented_but_ignored"
  | "wrong_sequence"
  | "unclear_ownership"
  | "approval_overhead"
  | "handoff_churn"
  | "no_templates"
  | "priority_chaos"
  | "missing_checks"
  | "handoff_info_loss"
  | "unskilled_operation"
  | "inconsistent_standards"
  | "no_metrics_defined"
  | "no_review_rhythm"
  | "no_benchmark"
  | "data_scattered";

/** 归因按所选大类逐个回答：operationType → attribution */
export type AttributionSelection = Partial<Record<OperationType, AttributionKey[]>>;

/** 归因「其他」自填内容：按大类存放 */
export type CustomAttributionSelection = Partial<Record<OperationType, string>>;

export interface WorksheetStep {
  title: string;
  action: string;
  owner?: string;
  handoff?: string;
  proof: string;
  /** 该步骤能解决的归因（痛点归因 key），用于按用户卡点标注 P0/P1 */
  tags?: AttributionKey[];
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
  attributions?: AttributionSelection;
  customAttributions?: CustomAttributionSelection;
}

export interface SopOutput {
  company: CompanyProfile;
  situation: SituationProfile;
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
  customPrimaryProblem?: string;
  contextAnswers?: ContextAnswers;
  attributions?: AttributionSelection;
  customAttributions?: CustomAttributionSelection;
  emphasis: PrimaryEmphasis;
  overview: RoleWorksheet[];
  subFlows: SubFlow[];
}
