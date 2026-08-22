import { mapSelectionToSop } from "@/lib/workflow-mapper";
import { isCompanyScale, isIndustry } from "@/types/company";
import { isBudgetTier, isPlatform, isStage } from "@/types/situation";
import { isOperationType, isPrimaryProblem, isTeamSize } from "@/types/user-profile";
import type { CustomSubcategory, SopOutput } from "@/types/workflow";

export type SearchParams = { [key: string]: string | string[] | undefined };

function readParams(params: SearchParams, key: string): string[] {
  const value = params[key];
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

export function parseSopOutputFromSearchParams(params: SearchParams): SopOutput | null {
  const operationTypes = readParams(params, "operationType").filter(isOperationType);
  const subcategoryIds = readParams(params, "subcategoryId");
  const teamSize = readParams(params, "teamSize").find(isTeamSize);
  const primaryProblem = readParams(params, "primaryProblem").find(isPrimaryProblem);
  const customPrimaryProblem = readParams(params, "customPrimaryProblem")[0]?.trim();
  const industry = readParams(params, "industry").find(isIndustry);
  const companyScale = readParams(params, "companyScale").find(isCompanyScale);
  const businessModel = readParams(params, "businessModel")[0]?.trim();
  const stage = readParams(params, "stage").find(isStage);
  const platforms = readParams(params, "platform").filter(isPlatform);
  const budgetTier = readParams(params, "budgetTier").find(isBudgetTier);

  const customSubcategories = readParams(params, "customSubcategoryType")
    .map((operationType, index) => ({
      operationType,
      name: readParams(params, "customSubcategoryName")[index]?.trim() ?? ""
    }))
    .filter((item): item is CustomSubcategory => isOperationType(item.operationType) && item.name.length > 0);

  if (
    operationTypes.length === 0 ||
    !teamSize ||
    !primaryProblem ||
    (primaryProblem === "other" && !customPrimaryProblem) ||
    !industry ||
    !companyScale ||
    !businessModel ||
    !stage ||
    platforms.length === 0 ||
    !budgetTier
  ) {
    return null;
  }

  return mapSelectionToSop({
    company: { industry, businessModel, companyScale },
    situation: { stage, platforms, budgetTier },
    operationTypes,
    subcategoryIds,
    customSubcategories,
    teamSize,
    primaryProblem,
    customPrimaryProblem
  });
}
