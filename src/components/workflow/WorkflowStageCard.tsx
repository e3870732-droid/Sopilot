import { Check, Handshake, User } from "lucide-react";
import type { StepPriority } from "@/data/attributions";
import { cn } from "@/lib/utils";
import type { WorksheetStep } from "@/types/workflow";

interface WorkflowStageCardProps {
  index: number;
  step: WorksheetStep;
  isLast?: boolean;
  priority?: StepPriority;
}

export function WorkflowStageCard({ index, step, isLast = false, priority }: WorkflowStageCardProps) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {index}
        </div>
        {!isLast ? <div className="mt-2 w-px flex-1 bg-border" /> : null}
      </div>
      <div className={cn("min-w-0 flex-1 space-y-3", isLast ? "pb-0" : "pb-6")}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">{step.title}</div>
          {priority === "P0" ? (
            <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              P0 · 重点改造
            </span>
          ) : null}
          {priority === "P1" ? (
            <span className="inline-flex items-center rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary">
              P1 · 次要关注
            </span>
          ) : null}
          {step.owner ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {step.owner}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{step.action}</p>
        {step.handoff ? (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Handshake className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>交接：{step.handoff}</span>
          </div>
        ) : null}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>完成留痕：{step.proof}</span>
        </div>
      </div>
    </div>
  );
}
