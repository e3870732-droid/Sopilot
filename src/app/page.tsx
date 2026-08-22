import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sopilot</p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            把团队经验，变成标准流程
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            选择你的运营方向，快速获得适配团队的岗位工作纸与标准流程。
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/questionnaire">
            开始生成我的 SOP
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </main>
  );
}
