import type { OperationType } from "@/types/user-profile";
import type { RoleWorksheet } from "@/types/workflow";
import { marketWorkflow } from "./market";
import { contentWorkflow } from "./content";
import { userWorkflow } from "./user";
import { eventWorkflow } from "./event";
import { growthWorkflow } from "./growth";
import { ecommerceWorkflow } from "./ecommerce";
import { productWorkflow } from "./product";
import { enterpriseWorkflow } from "./enterprise";

export const workflowRegistry: Record<OperationType, RoleWorksheet> = {
  market_operations: marketWorkflow,
  content_operations: contentWorkflow,
  user_operations: userWorkflow,
  event_operations: eventWorkflow,
  growth_operations: growthWorkflow,
  ecommerce_operations: ecommerceWorkflow,
  product_operations: productWorkflow,
  enterprise_operations: enterpriseWorkflow
};
