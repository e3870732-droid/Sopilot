import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildFocusLine, getAttributionDef, getStepPriority, type StepPriority } from "@/data/attributions";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel } from "@/data/situation";
import { EMPHASIS_LABELS, getScaleAdaptation } from "@/lib/workflow-customizer";
import { getContextInjections, getExecutiveSummary, getSevenDayPlan } from "@/lib/workflow-enrichment";
import type { RoleWorksheet, SopOutput } from "@/types/workflow";
import { RoleWorksheetCard } from "./RoleWorksheetCard";

interface WorkflowPreviewProps {
  output: SopOutput;
}

function getWorksheetPriorities(worksheet: RoleWorksheet, output: SopOutput): StepPriority[] | undefined {
  if (!output.attributions || output.primaryProblem === "other") {
    return undefined;
  }
  return worksheet.steps.map((step) => getStepPriority(step.tags, worksheet.operationType, output));
}

export function WorkflowPreview({ output }: WorkflowPreviewProps) {
  const scale = getScaleAdaptation(output.teamSize);
  const teamLabel = getOptionLabel("teamSize", output.teamSize);
  const problemLabel =
    output.primaryProblem === "other"
      ? output.customPrimaryProblem || "其他"
      : getOptionLabel("primaryProblem", output.primaryProblem);
  const summary = getExecutiveSummary(output);
  const sevenDayPlan = getSevenDayPlan(output);
  const injections = getContextInjections(output);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>生成摘要</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-medium text-muted-foreground">企业</div>
            <p className="mt-1">
              {output.company.companyName ? `${output.company.companyName} · ` : ""}
              {getIndustryLabel(output.company.industry)} · {output.company.businessModel} ·{" "}
              {getCompanyScaleLabel(output.company.companyScale)}
            </p>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">现状</div>
            <p className="mt-1">{getBudgetTierLabel(output.situation.budgetTier)}</p>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">团队与问题</div>
            <p className="mt-1">
              {teamLabel}团队 · 优先解决{problemLabel}
            </p>
          </div>
          <div className="sm:col-span-2">
            <div className="font-medium text-muted-foreground">优化重点</div>
            {output.attributions && output.primaryProblem !== "other" ? (
              <div className="mt-1 space-y-1">
                {output.overview.map((worksheet) => {
                  const keys = output.attributions?.[worksheet.operationType] ?? [];
                  const custom = output.customAttributions?.[worksheet.operationType]?.trim();
                  if (keys.length === 0 && !custom) {
                    return null;
                  }
                  return (
                    <p key={worksheet.id} className="text-sm">
                      {keys.map((key) => (
                        <Badge key={key} variant="outline" className="mr-2">
                          {getAttributionDef(key).label}
                        </Badge>
                      ))}
                      {custom ? (
                        <Badge variant="outline" className="mr-2">
                          其他
                        </Badge>
                      ) : null}
                      <span className="font-medium">{worksheet.name}：</span>
                      <span className="text-muted-foreground">
                        {buildFocusLine(worksheet.operationType, keys, custom)}
                      </span>
                    </p>
                  );
                })}
              </div>
            ) : (
              <Badge className="mt-1">{EMPHASIS_LABELS[output.emphasis]}</Badge>
            )}
          </div>
          <div className="sm:col-span-2">
            <div className="font-medium text-muted-foreground">平台</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {output.situation.platforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {getPlatformLabel(platform)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>执行总览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <p className="text-muted-foreground">{summary.headline}</p>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="font-medium">北极星</div>
            <p className="mt-1 text-muted-foreground">{summary.northStar}</p>
          </div>
          <div>
            <div className="font-medium">本周 3 件事</div>
            <ol className="mt-2 space-y-2">
              {summary.priorities.map((priority, index) => (
                <li key={priority.title} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{priority.title}</span>
                    <span className="text-muted-foreground">：{priority.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium">上手路径建议</div>
            <p className="mt-1 text-muted-foreground">{summary.onboardingAdvice}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7 天启动计划</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {sevenDayPlan.map((item) => (
              <li key={item.days} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 font-medium tabular-nums text-muted-foreground">
                  {item.days}
                </span>
                <span className="text-muted-foreground">{item.action}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {injections.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>执行提示</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {injections.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  {item.title}
                </Badge>
                <p className="text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>团队规模适配</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-medium">{scale.position}</div>
            <p className="text-muted-foreground">{scale.focus}</p>
            <p className="mt-2 text-muted-foreground">
              企业规模：{getCompanyScaleLabel(output.company.companyScale)}
            </p>
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
            <RoleWorksheetCard
              key={worksheet.id}
              worksheet={worksheet}
              priorities={getWorksheetPriorities(worksheet, output)}
            />
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
                <RoleWorksheetCard
                  worksheet={subFlow.worksheet}
                  priorities={getWorksheetPriorities(subFlow.worksheet, output)}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
