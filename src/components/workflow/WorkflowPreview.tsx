import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel, getStageLabel } from "@/data/situation";
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
  const companyScaleLabel = getCompanyScaleLabel(output.company.companyScale);
  const stageLabel = getStageLabel(output.situation.stage);
  const budgetLabel = getBudgetTierLabel(output.situation.budgetTier);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>企业画像</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {getIndustryLabel(output.company.industry)} · {output.company.businessModel} ·{" "}
            {companyScaleLabel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>现状与卡点</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            {stageLabel} · {budgetLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {output.situation.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">
                {getPlatformLabel(platform)}
              </Badge>
            ))}
          </div>
          {output.situation.budgetTier === "none" ? (
            <p className="text-muted-foreground">预算为 0，本方案已提示移除付费投放子流程，以自然流量为主。</p>
          ) : null}
          {output.situation.stage === "cold_start" ? (
            <p className="text-muted-foreground">当前为冷启动阶段，建议先使用冷启动轻量版工作流。</p>
          ) : null}
        </CardContent>
      </Card>

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
            <p className="mt-2 text-muted-foreground">企业规模：{companyScaleLabel}</p>
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
