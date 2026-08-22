import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionLabel } from "@/data/questions";
import { EMPHASIS_FOCUS, EMPHASIS_LABELS, getScaleAdaptation } from "@/lib/workflow-customizer";
import type { SopOutput } from "@/types/workflow";
import { RoleWorksheetCard } from "./RoleWorksheetCard";

interface WorkflowPreviewProps {
  output: SopOutput;
}

export function WorkflowPreview({ output }: WorkflowPreviewProps) {
  const scale = getScaleAdaptation(output.teamSize);
  const teamLabel = getOptionLabel("teamSize", output.teamSize);
  const problemLabel = getOptionLabel("primaryProblem", output.primaryProblem);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <CardTitle>本次优化重点</CardTitle>
            <Badge>{EMPHASIS_LABELS[output.emphasis]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {teamLabel}团队 · 优先解决{problemLabel}
          </p>
          <p className="text-muted-foreground">{EMPHASIS_FOCUS[output.primaryProblem]}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>团队规模适配</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-medium">{scale.position}</div>
            <p className="text-muted-foreground">{scale.focus}</p>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium">应增加：</span>
              {scale.add}
            </div>
            <div>
              <span className="font-medium">先删掉：</span>
              {scale.remove}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">总纲</h2>
        <div className="space-y-6">
          {output.overview.map((worksheet) => (
            <RoleWorksheetCard key={worksheet.id} worksheet={worksheet} />
          ))}
        </div>
      </section>

      {output.subFlows.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">子流程</h2>
          <div className="space-y-6">
            {output.subFlows.map((subFlow) => (
              <div key={subFlow.subcategory.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{subFlow.subcategory.name}</h3>
                  <Badge variant="outline">{subFlow.worksheet.name}</Badge>
                </div>
                <RoleWorksheetCard worksheet={subFlow.worksheet} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
