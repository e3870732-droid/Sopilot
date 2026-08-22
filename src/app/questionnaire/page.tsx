"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { QuestionnaireProgress } from "@/components/questionnaire/Progress";
import { Button } from "@/components/ui/button";
import { findOption, questions, type QuestionnaireKey } from "@/data/questions";
import { mapUserProfileToWorkflow } from "@/lib/workflow-mapper";
import { isOperationType, isPrimaryProblem, isTeamSize, type UserProfile } from "@/types/user-profile";

type Answers = Partial<Record<QuestionnaireKey, string>>;

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isConfirmStep = step >= questions.length;
  const currentQuestion = questions[step];

  const profile = useMemo<UserProfile | null>(() => {
    const operationType = answers.operationType;
    const teamSize = answers.teamSize;
    const primaryProblem = answers.primaryProblem;

    if (!isOperationType(operationType) || !isTeamSize(teamSize) || !isPrimaryProblem(primaryProblem)) {
      return null;
    }

    return { operationType, teamSize, primaryProblem };
  }, [answers]);

  const mapping = useMemo(() => (profile ? mapUserProfileToWorkflow(profile) : null), [profile]);

  function selectAnswer(key: QuestionnaireKey, value: string) {
    setAnswers((previous) => ({ ...previous, [key]: value }));

    window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, questions.length));
    }, 160);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function goToResult() {
    if (!profile) {
      return;
    }

    const params = new URLSearchParams({
      operationType: profile.operationType,
      teamSize: profile.teamSize,
      primaryProblem: profile.primaryProblem
    });

    router.push(`/result?${params.toString()}`);
  }

  const operationLabel = profile ? findOption("operationType", profile.operationType)?.label : "";
  const teamLabel = profile ? findOption("teamSize", profile.teamSize)?.label : "";
  const problemLabel = profile ? findOption("primaryProblem", profile.primaryProblem)?.label : "";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
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
            <QuestionnaireProgress current={Math.min(step + 1, questions.length)} total={questions.length} />
          </div>
          <span className="text-sm text-muted-foreground">{isConfirmStep ? "确认" : `问题 ${step + 1}`}</span>
        </div>

        {!isConfirmStep && currentQuestion ? (
          <QuestionCard title={currentQuestion.title} subtitle={currentQuestion.subtitle}>
            <div className="grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <OptionCard
                  key={option.id}
                  selected={answers[currentQuestion.key] === option.id}
                  onClick={() => selectAnswer(currentQuestion.key, option.id)}
                  label={option.label}
                  description={option.description}
                  flow={option.flow}
                />
              ))}
            </div>
          </QuestionCard>
        ) : (
          <QuestionCard title="确认你的情况" subtitle="确认无误后，我们会为你匹配最合适的运营工作流。">
            <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">你的情况</div>
                  <p className="mt-1 text-lg font-semibold">
                    {operationLabel} · {teamLabel}团队 · 优先解决{problemLabel}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">系统将重点为你建立</div>
                  <p className="mt-1">{mapping?.customization.highlights.join("、")}流程</p>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={goToResult}>
                生成我的 SOP
                <ArrowRight />
              </Button>
            </div>
          </QuestionCard>
        )}
      </div>
    </main>
  );
}
