import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkflowPreview } from "@/components/workflow/WorkflowPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mapSelectionToSop } from "@/lib/workflow-mapper";
import { isOperationType, isPrimaryProblem, isTeamSize } from "@/types/user-profile";

type SearchParams = { [key: string]: string | string[] | undefined };

function readParams(params: SearchParams, key: string): string[] {
  const value = params[key];
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

export default async function ResultPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const operationTypes = readParams(params, "operationType").filter(isOperationType);
  const subcategoryIds = readParams(params, "subcategoryId");
  const teamSizeValues = readParams(params, "teamSize");
  const problemValues = readParams(params, "primaryProblem");
  const teamSize = teamSizeValues.find(isTeamSize);
  const primaryProblem = problemValues.find(isPrimaryProblem);

  if (operationTypes.length === 0 || !teamSize || !primaryProblem) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">缺少有效的问卷答案</h1>
          <p className="text-muted-foreground">请重新回答问卷，以生成岗位工作纸。</p>
          <Button asChild>
            <Link href="/questionnaire">返回问卷</Link>
          </Button>
        </div>
      </main>
    );
  }

  const output = mapSelectionToSop({
    operationTypes,
    subcategoryIds,
    teamSize,
    primaryProblem
  });

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost">
            <Link href="/questionnaire">
              <ArrowLeft />
              返回问卷
            </Link>
          </Button>
          <Badge variant="outline">开发阶段 Preview</Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">你的岗位工作纸</h1>
          <p className="text-muted-foreground">
            当前已验证「问卷 → 多选映射 → 岗位工作纸」链路，LLM SOP 生成将在第二阶段接入。
          </p>
        </div>

        <WorkflowPreview output={output} />
      </div>
    </main>
  );
}
