import type { OperationType, WorkflowTemplate } from "@/types";
import { contentWorkflow } from "./content";
import { ecommerceWorkflow } from "./ecommerce";
import { userWorkflow } from "./user";
import { growthWorkflow } from "./growth";
import { eventWorkflow } from "./event";
import { productWorkflow } from "./product";

export const workflowRegistry: Record<OperationType, WorkflowTemplate> = {
  content_operations: contentWorkflow,
  ecommerce_operations: ecommerceWorkflow,
  user_operations: userWorkflow,
  growth_operations: growthWorkflow,
  event_operations: eventWorkflow,
  product_operations: productWorkflow
};
