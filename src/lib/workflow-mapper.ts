import { workflowRegistry } from "@/data/workflows/registry";
import type { UserProfile } from "@/types/user-profile";
import type { MappingResult } from "@/types/workflow";
import { customizeWorkflow } from "./workflow-customizer";

export function mapUserProfileToWorkflow(profile: UserProfile): MappingResult {
  const workflow = workflowRegistry[profile.operationType];

  if (!workflow) {
    throw new Error(`未找到运营类型对应的 Workflow Template: ${profile.operationType}`);
  }

  return {
    templateId: workflow.id,
    workflow,
    customization: customizeWorkflow(workflow, profile.teamSize, profile.primaryProblem)
  };
}
