import { workflowRegistry } from "@/data/workflows/registry";
import { findSubcategory } from "@/data/subcategories";
import type { OperationType } from "@/types/user-profile";
import type { QuestionnaireSelection, RoleWorksheet, SopOutput, SubFlow } from "@/types/workflow";
import { PROBLEM_EMPHASIS } from "./workflow-customizer";

function getWorksheet(operationType: OperationType): RoleWorksheet {
  const worksheet = workflowRegistry[operationType];

  if (!worksheet) {
    throw new Error(`未找到运营类型对应的岗位工作纸: ${operationType}`);
  }

  return worksheet;
}

export function mapSelectionToSop(selection: QuestionnaireSelection): SopOutput {
  const overview = selection.operationTypes.map((operationType) => getWorksheet(operationType));

  const subFlows: SubFlow[] = selection.subcategoryIds
    .map((id) => {
      const subcategory = findSubcategory(id);
      if (!subcategory) {
        return null;
      }

      return {
        subcategory,
        worksheet: getWorksheet(subcategory.operationType)
      };
    })
    .filter((item): item is SubFlow => item !== null);

  return {
    teamSize: selection.teamSize,
    primaryProblem: selection.primaryProblem,
    emphasis: PROBLEM_EMPHASIS[selection.primaryProblem],
    overview,
    subFlows
  };
}
