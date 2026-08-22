import { cn } from "@/lib/utils";

interface QuestionnaireProgressProps {
  current: number;
  total: number;
}

export function QuestionnaireProgress({ current, total }: QuestionnaireProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const step = index + 1;
        const isActive = step === current;
        const isComplete = step < current;

        return (
          <div
            key={step}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              isActive || isComplete ? "bg-primary" : "bg-muted"
            )}
          />
        );
      })}
      <span className="ml-2 text-sm tabular-nums text-muted-foreground">
        {current} / {total}
      </span>
    </div>
  );
}
