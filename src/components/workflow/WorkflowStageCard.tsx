import type { WorksheetStep } from "@/types/workflow";

interface WorkflowStageCardProps {
  index: number;
  step: WorksheetStep;
}

export function WorkflowStageCard({ index, step }: WorkflowStageCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border bg-background p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {index}
      </div>
      <div className="space-y-2">
        <div className="font-medium">{step.title}</div>
        <p className="text-sm text-muted-foreground">{step.action}</p>
        <div className="text-xs text-muted-foreground">完成留痕：{step.proof}</div>
      </div>
    </div>
  );
}
