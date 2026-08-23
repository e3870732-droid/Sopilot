"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questions } from "@/data/questions";
import { BUDGET_OPTIONS, PLATFORM_OPTIONS } from "@/data/situation";
import { cn } from "@/lib/utils";
import type { BudgetTier, Platform } from "@/types/situation";
import type { PrimaryProblem, TeamSize } from "@/types/user-profile";
import type { SopOutput } from "@/types/workflow";

interface ReportAdjustPanelProps {
  output: SopOutput;
  onApply: (next: SopOutput) => void;
}

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";

export function ReportAdjustPanel({ output, onApply }: ReportAdjustPanelProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(output.situation.platforms);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(output.situation.budgetTier);
  const [teamSize, setTeamSize] = useState<TeamSize>(output.teamSize);
  const [primaryProblem, setPrimaryProblem] = useState<PrimaryProblem>(output.primaryProblem);
  const [customPrimaryProblem, setCustomPrimaryProblem] = useState(output.customPrimaryProblem ?? "");

  const teamSizeOptions = questions.find((question) => question.key === "teamSize")?.options ?? [];
  const problemOptions = questions.find((question) => question.key === "primaryProblem")?.options ?? [];

  function togglePlatform(id: Platform) {
    setPlatforms((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  }

  function handleApply() {
    if (platforms.length === 0) {
      return;
    }
    if (primaryProblem === "other" && !customPrimaryProblem.trim()) {
      return;
    }

    onApply({
      ...output,
      situation: {
        ...output.situation,
        platforms,
        budgetTier
      },
      teamSize,
      primaryProblem,
      // 换了首要问题后旧的归因答案失效，需要重新走问卷才能再标注
      attributions: primaryProblem === output.primaryProblem ? output.attributions : undefined,
      customPrimaryProblem: primaryProblem === "other" ? customPrimaryProblem.trim() : undefined
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>调整生成参数</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">月投放预算</label>
            <select
              value={budgetTier}
              onChange={(event) => setBudgetTier(event.target.value as BudgetTier)}
              className={selectClassName}
            >
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">团队规模</label>
            <select
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value as TeamSize)}
              className={selectClassName}
            >
              {teamSizeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">首要问题</label>
            <select
              value={primaryProblem}
              onChange={(event) => setPrimaryProblem(event.target.value as PrimaryProblem)}
              className={selectClassName}
            >
              {problemOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {primaryProblem === "other" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">自定义问题</label>
            <textarea
              value={customPrimaryProblem}
              onChange={(event) => setCustomPrimaryProblem(event.target.value)}
              placeholder="请描述你最想先解决的问题"
              className="min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium">主要平台</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((option) => {
              const selected = platforms.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => togglePlatform(option.id)}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-input bg-background text-foreground hover:border-primary/50"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleApply} disabled={platforms.length === 0}>
            <RefreshCw />
            应用并重新生成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
