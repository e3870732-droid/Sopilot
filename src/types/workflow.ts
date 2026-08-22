import type { OperationType, PrimaryEmphasis, PrimaryProblem, TeamSize } from "./user-profile";

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  objective?: string;
  defaultRoles?: string[];
  checkpoints?: string[];
  metrics?: string[];
  exceptionHandling?: string[];
}

export interface TeamVariantConfig {
  label: string;
  description: string;
  roles?: string[];
  checkpoints?: string[];
  metrics?: string[];
}

export interface WorkflowTemplate {
  id: string;
  operationType: OperationType;
  name: string;
  description: string;
  stages: WorkflowStage[];
  supportedProblems: PrimaryProblem[];
  teamVariants?: Partial<Record<TeamSize, TeamVariantConfig>>;
}

export interface WorkflowCustomization {
  teamMode: TeamSize;
  emphasis: PrimaryEmphasis;
  emphasisLabel: string;
  roles: string[];
  checkpoints: string[];
  metrics: string[];
  highlights: string[];
}

export interface MappingResult {
  templateId: string;
  workflow: WorkflowTemplate;
  customization: WorkflowCustomization;
}
