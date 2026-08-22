export const OPERATION_TYPES = [
  "market_operations",
  "content_operations",
  "user_operations",
  "event_operations",
  "growth_operations",
  "ecommerce_operations",
  "product_operations",
  "enterprise_operations"
] as const;

export const TEAM_SIZES = ["solo", "small_team", "mid_team", "large_team", "xlarge_team"] as const;

export const PRIMARY_PROBLEMS = [
  "unclear_process",
  "low_efficiency",
  "frequent_errors",
  "lack_of_metrics",
  "other"
] as const;

export const PRIMARY_EMPHASES = [
  "strategy_and_process",
  "execution_efficiency",
  "quality_control",
  "data_review"
] as const;

export type OperationType = (typeof OPERATION_TYPES)[number];
export type TeamSize = (typeof TEAM_SIZES)[number];
export type PrimaryProblem = (typeof PRIMARY_PROBLEMS)[number];
export type PrimaryEmphasis = (typeof PRIMARY_EMPHASES)[number];

export interface UserProfile {
  operationType: OperationType;
  teamSize: TeamSize;
  primaryProblem: PrimaryProblem;
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

export function isOperationType(value: unknown): value is OperationType {
  return isOneOf(value, OPERATION_TYPES);
}

export function isTeamSize(value: unknown): value is TeamSize {
  return isOneOf(value, TEAM_SIZES);
}

export function isPrimaryProblem(value: unknown): value is PrimaryProblem {
  return isOneOf(value, PRIMARY_PROBLEMS);
}
