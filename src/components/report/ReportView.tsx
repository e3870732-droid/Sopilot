import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleWorksheetCard } from "@/components/workflow/RoleWorksheetCard";
import { getCompanyScaleLabel, getIndustryLabel } from "@/data/company";
import { getOptionLabel } from "@/data/questions";
import { getBudgetTierLabel, getPlatformLabel } from "@/data/situation";
import type { SopReport } from "@/lib/sop-report";

export function ReportView({ report }: { report: SopReport }) {
  const { output } = report;
  const problemLabel =
    output.primaryProblem === "other"
      ? output.customPrimaryProblem || "其他"
      : getOptionLabel("primaryProblem", output.primaryProblem);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>报告信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-medium text-muted-foreground">企业</div>
            <p className="mt-1">
              {getIndustryLabel(output.company.industry)} · {output.company.businessModel} ·{" "}
              {getCompanyScaleLabel(output.company.companyScale)}
            </p>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">现状</div>
            <p className="mt-1">{getBudgetTierLabel(output.situation.budgetTier)}</p>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">平台</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {output.situation.platforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {getPlatformLabel(platform)}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">团队与问题</div>
            <p className="mt-1">
              {getOptionLabel("teamSize", output.teamSize)}团队 · 优先解决{problemLabel}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>执行总览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <p className="text-muted-foreground">{report.overview.executiveBrief}</p>
          <div>
            <div className="font-medium">本周计划</div>
            <ol className="mt-1 space-y-1 text-muted-foreground">
              {report.overview.weeklyPlan.map((item, index) => (
                <li key={index}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </div>
          {report.overview.risks.length > 0 ? (
            <div>
              <div className="font-medium">风险与提醒</div>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                {report.overview.risks.map((item, index) => (
                  <li key={index}>· {item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">岗位工作纸</h2>
        {report.roles.map((role) => (
          <div key={role.operationType} className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <CardTitle>{role.name}</CardTitle>
                  <Badge variant="secondary">{role.source === "ai" ? "AI 定制" : "默认方案"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-medium">岗位定位</div>
                  <p className="mt-1 text-muted-foreground">{role.roleBrief}</p>
                </div>
                <div>
                  <div className="font-medium">本阶段重点任务</div>
                  <ol className="mt-1 space-y-1 text-muted-foreground">
                    {role.priorityTasks.map((item, index) => (
                      <li key={index}>
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <div className="font-medium">关键检查清单</div>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {role.checklist.map((item, index) => (
                      <li key={index}>· {item}</li>
                    ))}
                  </ul>
                </div>
                {role.risks.length > 0 ? (
                  <div>
                    <div className="font-medium">风险与提醒</div>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {role.risks.map((item, index) => (
                        <li key={index}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {role.subFlows.length > 0 ? (
                  <div>
                    <div className="font-medium">涉及子类</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {role.subFlows.map((subFlow) => (
                        <Badge key={subFlow.subcategory.id} variant="outline">
                          {subFlow.subcategory.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <RoleWorksheetCard worksheet={role.worksheet} />
          </div>
        ))}
      </section>

      {report.followUps.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>追问与补充</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {report.followUps.map((item) => (
              <div key={item.id} className="space-y-1">
                <p className="font-medium">Q：{item.question}</p>
                <p className="text-muted-foreground">A：{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
