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
}

export interface SopOutput {
  company: CompanyProfile;
  situation: SituationProfile;
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
  customPrimaryProblem?: string;
  emphasis: PrimaryEmphasis;
  overview: RoleWorksheet[];
  subFlows: SubFlow[];
}
