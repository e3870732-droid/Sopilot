import type { OperationType, PrimaryEmphasis, PrimaryProblem, TeamSize } from "./user-profile";

export interface Subcategory {
  id: string;
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
  operationTypes: OperationType[];
  subcategoryIds: string[];
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
}

export interface SopOutput {
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
  emphasis: PrimaryEmphasis;
  overview: RoleWorksheet[];
  subFlows: SubFlow[];
}
