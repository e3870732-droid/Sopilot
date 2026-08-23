import { mapSelectionToSop } from "@/lib/workflow-mapper";
import { ATTRIBUTION_KEYS_BY_PROBLEM, isAttributionKey, type AttributableProblem } from "@/data/attributions";
import { isCompanyScale, isIndustry } from "@/types/company";
import { isBudgetTier, isPlatform } from "@/types/situation";
import { isOperationType, isPrimaryProblem, isTeamSize } from "@/types/user-profile";
import type { AttributionSelection, ContextAnswers, CustomSubcategory, SopOutput } from "@/types/workflow";

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
  const platforms = readParams(params, "platform").filter(isPlatform);
  const budgetTier = readParams(params, "budgetTier").find(isBudgetTier);

  const customSubcategories = readParams(params, "customSubcategoryType")
    .map((operationType, index) => ({
      operationType,
      name: readParams(params, "customSubcategoryName")[index]?.trim() ?? ""
    }))
    .filter((item): item is CustomSubcategory => isOperationType(item.operationType) && item.name.length > 0);

  // 条件追问：只在命中条件时要求答案
  const contextAnswers: ContextAnswers = {};
  if (subcategoryIds.includes("ecommerce_livestream")) {
    const value = readParams(params, "livestreamGoods")[0];
    if (value === "own_goods" || value === "consignment") {
      contextAnswers.livestreamGoods = value;
    } else {
      return null;
    }
  }
  if (subcategoryIds.includes("user_private_domain")) {
    const value = readParams(params, "privateDomainSize")[0];
    if (value === "lt500" || value === "500_to_5000" || value === "gt5000") {
      contextAnswers.privateDomainSize = value;
    } else {
      return null;
    }
  }
  if (industry && ["healthcare", "finance", "education"].includes(industry)) {
    const value = readParams(params, "hasLegalReviewer")[0];
    if (value === "yes" || value === "no") {
      contextAnswers.hasLegalReviewer = value;
    } else {
      return null;
    }
  }

  if (
    operationTypes.length === 0 ||
    !teamSize ||
    !primaryProblem ||
    (primaryProblem === "other" && !customPrimaryProblem) ||
    !industry ||
    !companyScale ||
    !businessModel ||
    platforms.length === 0 ||
    !budgetTier
  ) {
    return null;
  }

  // 归因追问：选了非「其他」的首要问题时，每个已选大类都必须有对应归因
  const attributions: AttributionSelection = {};
  if (primaryProblem !== "other") {
    const allowedKeys = ATTRIBUTION_KEYS_BY_PROBLEM[primaryProblem as AttributableProblem];
    for (const operationType of operationTypes) {
      const value = readParams(params, `attr_${operationType}`)[0];
      if (isAttributionKey(value) && allowedKeys.includes(value)) {
        attributions[operationType] = value;
      } else {
        return null;
      }
    }
  }

  return mapSelectionToSop({
    company: { industry, businessModel, companyScale },
    situation: { platforms, budgetTier },
    operationTypes,
    subcategoryIds,
    customSubcategories,
    teamSize,
    primaryProblem,
    customPrimaryProblem,
    contextAnswers,
    attributions: primaryProblem === "other" ? undefined : attributions
  });
}
