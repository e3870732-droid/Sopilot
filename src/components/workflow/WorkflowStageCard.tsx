import type { WorkflowStage } from "@/types/workflow";

interface WorkflowStageCardProps {
  index: number;
  stage: WorkflowStage;
}

export function WorkflowStageCard({ index, stage }: WorkflowStageCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border bg-background p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {index}
      </div>
      <div className="space-y-1">
        <div className="font-medium">{stage.name}</div>
        <div className="text-sm text-muted-foreground">{stage.description}</div>
      </div>
    </div>
  );
}
