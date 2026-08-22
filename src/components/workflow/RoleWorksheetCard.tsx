import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoleWorksheet } from "@/types/workflow";
import { WorkflowStageCard } from "./WorkflowStageCard";

interface RoleWorksheetCardProps {
  worksheet: RoleWorksheet;
}

export function RoleWorksheetCard({ worksheet }: RoleWorksheetCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <CardTitle>{worksheet.name}</CardTitle>
          <Badge variant="secondary">{worksheet.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{worksheet.northStar}</p>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="font-medium text-muted-foreground">核心交付物：</span>
            {worksheet.output}
          </div>
          <div>
            <span className="font-medium text-muted-foreground">工作节奏：</span>
            {worksheet.cycle}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">标准流程</h3>
          <div>
            {worksheet.steps.map((step, index) => (
              <WorkflowStageCard
                key={step.title}
                index={index + 1}
                step={step}
                isLast={index === worksheet.steps.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">运营节奏</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {worksheet.cadence.map((item) => (
              <div key={item.rhythm} className="rounded-lg border p-4">
                <div className="font-medium">{item.rhythm}</div>
                <p className="mt-1 text-sm text-muted-foreground">{item.actions}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">必须留下的东西</h3>
          <div className="flex flex-wrap gap-2">
            {worksheet.deliverables.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">关键协同</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {worksheet.collaboration.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">典型衡量指标</h3>
          <div className="flex flex-wrap gap-2">
            {worksheet.kpis.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">执行护栏</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {worksheet.guardrails.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
