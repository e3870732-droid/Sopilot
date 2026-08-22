import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionLabel } from "@/data/questions";
import type { UserProfile } from "@/types/user-profile";
import type { MappingResult } from "@/types/workflow";
import { WorkflowStageCard } from "./WorkflowStageCard";

interface WorkflowPreviewProps {
  profile: UserProfile;
  result: MappingResult;
}

export function WorkflowPreview({ profile, result }: WorkflowPreviewProps) {
  const operationLabel = getOptionLabel("operationType", profile.operationType);
  const teamLabel = getOptionLabel("teamSize", profile.teamSize);
  const problemLabel = getOptionLabel("primaryProblem", profile.primaryProblem);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>你的情况</CardTitle>
          <CardDescription>
            {operationLabel} · {teamLabel}团队 · 优先解决{problemLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">系统将重点为你建立</div>
            <p className="mt-1">{result.customization.highlights.join("、")}流程</p>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">匹配结果</div>
            <dl className="mt-2 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Workflow</dt>
                <dd className="mt-1 font-mono text-xs">{result.templateId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Team Variant</dt>
                <dd className="mt-1">
                  <Badge variant="secondary">{result.customization.teamMode}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Emphasis</dt>
                <dd className="mt-1">
                  <Badge>{result.customization.emphasis}</Badge>
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Skeleton</CardTitle>
          <CardDescription>{result.workflow.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.workflow.stages.map((stage, index) => (
            <WorkflowStageCard key={stage.id} index={index + 1} stage={stage} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
