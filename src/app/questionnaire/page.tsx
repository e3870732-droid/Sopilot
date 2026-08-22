"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { QuestionnaireProgress } from "@/components/questionnaire/Progress";
import { Button } from "@/components/ui/button";
import { OPERATION_CATEGORIES, getOperationCategory } from "@/data/categories";
import { getOptionLabel, questions } from "@/data/questions";
import { findSubcategory, getSubcategories } from "@/data/subcategories";
import { mapSelectionToSop } from "@/lib/workflow-mapper";
import { EMPHASIS_FOCUS } from "@/lib/workflow-customizer";
import { cn } from "@/lib/utils";
import { isPrimaryProblem, isTeamSize } from "@/types/user-profile";
import type { OperationType, PrimaryProblem, TeamSize } from "@/types/user-profile";

const TOTAL_STEPS = 3;

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<OperationType[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [primaryProblem, setPrimaryProblem] = useState<PrimaryProblem | null>(null);

  const isConfirmStep = step >= TOTAL_STEPS;

  const selection = useMemo(() => {
    if (!teamSize || !primaryProblem || selectedOperationTypes.length === 0) {
      return null;
    }

    return {
      operationTypes: selectedOperationTypes,
      subcategoryIds: selectedSubcategoryIds,
      teamSize,
      primaryProblem
    };
  }, [primaryProblem, selectedOperationTypes, selectedSubcategoryIds, teamSize]);

  const output = useMemo(() => (selection ? mapSelectionToSop(selection) : null), [selection]);

  function toggleOperationType(id: OperationType) {
    const exists = selectedOperationTypes.includes(id);
    const next = exists
      ? selectedOperationTypes.filter((item) => item !== id)
      : [...selectedOperationTypes, id];

    setSelectedOperationTypes(next);

    if (exists) {
      const removedSubcategoryIds = getSubcategories(id).map((item) => item.id);
      setSelectedSubcategoryIds((subs) => subs.filter((sub) => !removedSubcategoryIds.includes(sub)));
    }
  }

  function toggleSubcategory(id: string) {
    setSelectedSubcategoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function goToResult() {
    if (!selection) {
      return;
    }

    const params = new URLSearchParams();
    selection.operationTypes.forEach((id) => params.append("operationType", id));
    selection.subcategoryIds.forEach((id) => params.append("subcategoryId", id));
    params.set("teamSize", selection.teamSize);
    params.set("primaryProblem", selection.primaryProblem);

    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
          <div className="flex-1">
            <QuestionnaireProgress current={Math.min(step + 1, TOTAL_STEPS)} total={TOTAL_STEPS} />
          </div>
          <span className="text-sm text-muted-foreground">{isConfirmStep ? "确认" : `第 ${step + 1} 步`}</span>
        </div>

        {step === 0 ? (
          <QuestionCard
            title="你现在最想规范哪些运营工作？"
            subtitle="选择大类后会自动展开对应子类，子类也可多选。"
          >
            <div className="space-y-3">
              {OPERATION_CATEGORIES.map((category) => {
                const selected = selectedOperationTypes.includes(category.id);
                const subcategories = getSubcategories(category.id);

                return (
                  <div
                    key={category.id}
                    className={cn(
                      "overflow-hidden rounded-xl border bg-card shadow-sm transition-colors",
                      selected ? "border-primary ring-1 ring-primary/15" : "hover:border-primary/50"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleOperationType(category.id)}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium">{category.name}</span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {category.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                        )}
                      >
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                    </button>

                    {selected ? (
                      <div className="border-t p-5">
                        <div className="mb-3 text-sm font-medium text-muted-foreground">选择子类（可多选）</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {subcategories.map((subcategory) => {
                            const subSelected = selectedSubcategoryIds.includes(subcategory.id);
                            return (
                              <button
                                key={subcategory.id}
                                type="button"
                                onClick={() => toggleSubcategory(subcategory.id)}
                                className={cn(
                                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                                  subSelected
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-input hover:border-primary/50"
                                )}
                              >
                                {subcategory.name}
                                {subSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={selectedOperationTypes.length === 0} onClick={() => setStep(1)}>
                下一步
                <ArrowRight />
              </Button>
            </div>
          </QuestionCard>
        ) : null}

        {step === 1 ? (
          <QuestionCard title={questions[0].title} subtitle={questions[0].subtitle}>
            <div className="grid gap-3 sm:grid-cols-2">
              {questions[0].options.map((option) => (
                <OptionCard
                  key={option.id}
                  selected={teamSize === option.id}
                  onClick={() => {
                    if (isTeamSize(option.id)) {
                      setTeamSize(option.id);
                      window.setTimeout(() => setStep(2), 160);
                    }
                  }}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
          </QuestionCard>
        ) : null}

        {step === 2 ? (
          <QuestionCard title={questions[1].title} subtitle={questions[1].subtitle}>
            <div className="grid gap-3 sm:grid-cols-2">
              {questions[1].options.map((option) => (
                <OptionCard
                  key={option.id}
                  selected={primaryProblem === option.id}
                  onClick={() => {
                    if (isPrimaryProblem(option.id)) {
                      setPrimaryProblem(option.id);
                      window.setTimeout(() => setStep(3), 160);
                    }
                  }}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
          </QuestionCard>
        ) : null}

        {isConfirmStep ? (
          <QuestionCard title="确认你的选择" subtitle="确认无误后，我们会为你生成岗位工作纸与子流程。">
            <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">已选大类</div>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedOperationTypes.map((id) => getOperationCategory(id)?.name ?? id).join(" · ")}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">已选子类</div>
                  <p className="mt-1">
                    {selectedSubcategoryIds.length > 0
                      ? selectedSubcategoryIds
                          .map((id) => findSubcategory(id)?.name ?? id)
                          .join(" · ")
                      : "未选择子类"}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">团队规模与优先问题</div>
                  <p className="mt-1">
                    {teamSize ? getOptionLabel("teamSize", teamSize) : ""} ·{" "}
                    {primaryProblem ? getOptionLabel("primaryProblem", primaryProblem) : ""}
                  </p>
                </div>
                {primaryProblem ? (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">本次优化重点</div>
                    <p className="mt-1 text-muted-foreground">{EMPHASIS_FOCUS[primaryProblem]}</p>
                  </div>
                ) : null}
              </div>
              <Button size="lg" className="w-full" disabled={!output} onClick={goToResult}>
                生成我的 SOP
                <ArrowRight />
              </Button>
            </div>
          </QuestionCard>
        ) : null}
      </div>
    </main>
  );
}
