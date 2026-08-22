"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CategorySelector } from "@/components/questionnaire/CategorySelector";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { QuestionnaireProgress } from "@/components/questionnaire/Progress";
import { Button } from "@/components/ui/button";
import { COMPANY_SCALE_OPTIONS, INDUSTRY_OPTIONS } from "@/data/company";
import { getOperationCategory } from "@/data/categories";
import { getOptionLabel, questions } from "@/data/questions";
import { BUDGET_OPTIONS, PLATFORM_OPTIONS, STAGE_OPTIONS } from "@/data/situation";
import { findSubcategory, getSubcategories } from "@/data/subcategories";
import { mapSelectionToSop } from "@/lib/workflow-mapper";
import { EMPHASIS_FOCUS } from "@/lib/workflow-customizer";
import { cn } from "@/lib/utils";
import { isCompanyScale, isIndustry, type CompanyProfile, type CompanyScale, type Industry } from "@/types/company";
import { isBudgetTier, isPlatform, isStage, type BudgetTier, type Platform, type SituationProfile, type Stage } from "@/types/situation";
import { isPrimaryProblem, isTeamSize } from "@/types/user-profile";
import type { OperationType, PrimaryProblem, TeamSize } from "@/types/user-profile";
import type { CustomSubcategory } from "@/types/workflow";

const TOTAL_STEPS = 4;

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [businessModel, setBusinessModel] = useState("");
  const [companyScale, setCompanyScale] = useState<CompanyScale | null>(null);
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<OperationType[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);
  const [customSubcategories, setCustomSubcategories] = useState<CustomSubcategory[]>([]);
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier | null>(null);
  const [primaryProblem, setPrimaryProblem] = useState<PrimaryProblem | null>(null);

  const isConfirmStep = step >= TOTAL_STEPS;

  const company = useMemo<CompanyProfile | null>(() => {
    if (!industry || !companyScale || !businessModel.trim()) {
      return null;
    }

    return {
      industry,
      businessModel: businessModel.trim(),
      companyScale
    };
  }, [businessModel, companyScale, industry]);

  const situation = useMemo<SituationProfile | null>(() => {
    if (!stage || !budgetTier || platforms.length === 0) {
      return null;
    }

    return {
      stage,
      platforms,
      budgetTier
    };
  }, [budgetTier, platforms, stage]);

  const selection = useMemo(() => {
    if (!company || !situation || !teamSize || !primaryProblem || selectedOperationTypes.length === 0) {
      return null;
    }

    return {
      company,
      situation,
      operationTypes: selectedOperationTypes,
      subcategoryIds: selectedSubcategoryIds,
      customSubcategories,
      teamSize,
      primaryProblem
    };
  }, [company, customSubcategories, primaryProblem, selectedOperationTypes, selectedSubcategoryIds, situation, teamSize]);

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
      setCustomSubcategories((custom) => custom.filter((item) => item.operationType !== id));
    }
  }

  function toggleSubcategory(id: string) {
    setSelectedSubcategoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function togglePlatform(id: Platform) {
    setPlatforms((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function selectAllSubcategories(operationType: OperationType) {
    const ids = getSubcategories(operationType).map((item) => item.id);
    setSelectedSubcategoryIds((current) => Array.from(new Set([...current, ...ids])));
  }

  function clearSubcategories(operationType: OperationType) {
    const ids = getSubcategories(operationType).map((item) => item.id);
    setSelectedSubcategoryIds((current) => current.filter((id) => !ids.includes(id)));
  }

  function addCustomSubcategory(operationType: OperationType, name: string) {
    setCustomSubcategories((current) => {
      const withoutCurrent = current.filter((item) => item.operationType !== operationType);
      return [...withoutCurrent, { operationType, name }];
    });
  }

  function removeCustomSubcategory(operationType: OperationType) {
    setCustomSubcategories((current) => current.filter((item) => item.operationType !== operationType));
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function goToResult() {
    if (!selection) {
      return;
    }

    const params = new URLSearchParams();
    params.set("industry", selection.company.industry);
    params.set("businessModel", selection.company.businessModel);
    params.set("companyScale", selection.company.companyScale);
    selection.operationTypes.forEach((id) => params.append("operationType", id));
    selection.subcategoryIds.forEach((id) => params.append("subcategoryId", id));
    selection.customSubcategories.forEach((custom) => {
      params.append("customSubcategoryType", custom.operationType);
      params.append("customSubcategoryName", custom.name);
    });
    params.set("teamSize", selection.teamSize);
    params.set("stage", selection.situation.stage);
    selection.situation.platforms.forEach((platform) => params.append("platform", platform));
    params.set("budgetTier", selection.situation.budgetTier);
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
            title="先了解一下你的企业"
            subtitle="这些信息会用于生成更贴合你企业情况的工作纸。"
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">企业所在的行业</label>
                <select
                  value={industry ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setIndustry(isIndustry(value) ? value : null);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>
                    请选择行业
                  </option>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">主要的业务模式</label>
                <input
                  type="text"
                  value={businessModel}
                  onChange={(event) => setBusinessModel(event.target.value)}
                  placeholder="例如：SaaS 订阅、电商零售、项目制服务"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">企业当前的规模</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {COMPANY_SCALE_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={companyScale === option.id}
                      onClick={() => {
                        if (isCompanyScale(option.id)) {
                          setCompanyScale(option.id);
                        }
                      }}
                      label={option.label}
                      description={option.description ?? ""}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={!company} onClick={() => setStep(1)}>
                下一步
                <ArrowRight />
              </Button>
            </div>
          </QuestionCard>
        ) : null}

        {step === 1 ? (
          <QuestionCard
            title="你现在的岗位职责是哪些？"
            subtitle="选择大类后会自动展开对应子类，子类也可多选。"
          >
            <CategorySelector
              selectedOperationTypes={selectedOperationTypes}
              selectedSubcategoryIds={selectedSubcategoryIds}
              customSubcategories={customSubcategories}
              onToggleOperationType={toggleOperationType}
              onToggleSubcategory={toggleSubcategory}
              onAddCustomSubcategory={addCustomSubcategory}
              onRemoveCustomSubcategory={removeCustomSubcategory}
              onSelectAll={selectAllSubcategories}
              onClear={clearSubcategories}
              onNext={() => setStep(2)}
            />
          </QuestionCard>
        ) : null}

        {step === 2 ? (
          <QuestionCard title={questions[0].title} subtitle={questions[0].subtitle}>
            <div className="space-y-3">
              {questions[0].options.map((option) => (
                <OptionCard
                  key={option.id}
                  selected={teamSize === option.id}
                  onClick={() => {
                    if (isTeamSize(option.id)) {
                      setTeamSize(option.id);
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

        {step === 3 ? (
          <QuestionCard
            title="你现在处在什么阶段？"
            subtitle="这些问题决定你的工作流是冷启动版还是完整版。"
          >
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="text-sm font-semibold">运营阶段</h2>
                <div className="space-y-3">
                  {STAGE_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={stage === option.id}
                      onClick={() => {
                        if (isStage(option.id)) {
                          setStage(option.id);
                        }
                      }}
                      label={option.label}
                      description={option.description ?? ""}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">主要在哪些平台做？</h2>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_OPTIONS.map((option) => {
                    const selected = platforms.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          if (isPlatform(option.id)) {
                            togglePlatform(option.id);
                          }
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-input bg-background text-foreground hover:border-primary/50"
                        )}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : null}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">每个月愿意在推广投放上花多少钱？</h2>
                <div className="space-y-3">
                  {BUDGET_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={budgetTier === option.id}
                      onClick={() => {
                        if (isBudgetTier(option.id)) {
                          setBudgetTier(option.id);
                        }
                      }}
                      label={option.label}
                      description=""
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">{questions[1].title}</h2>
                <p className="text-sm text-muted-foreground">{questions[1].subtitle}</p>
                <div className="space-y-3">
                  {questions[1].options.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={primaryProblem === option.id}
                      onClick={() => {
                        if (isPrimaryProblem(option.id)) {
                          setPrimaryProblem(option.id);
                        }
                      }}
                      label={option.label}
                      description={option.description}
                    />
                  ))}
                </div>
              </section>
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={!situation || !primaryProblem} onClick={() => setStep(4)}>
                下一步
                <ArrowRight />
              </Button>
            </div>
          </QuestionCard>
        ) : null}

        {isConfirmStep ? (
          <QuestionCard title="确认你的选择" subtitle="确认无误后，我们会为你生成岗位工作纸与子流程。">
            <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                {company ? (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">企业信息</div>
                    <p className="mt-1">
                      {INDUSTRY_OPTIONS.find((item) => item.id === company.industry)?.label} ·{" "}
                      {company.businessModel} ·{" "}
                      {COMPANY_SCALE_OPTIONS.find((item) => item.id === company.companyScale)?.label}
                    </p>
                  </div>
                ) : null}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">已选大类</div>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedOperationTypes.map((id) => getOperationCategory(id)?.name ?? id).join(" · ")}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">已选子类</div>
                  <p className="mt-1">
                    {selectedSubcategoryIds.length > 0 || customSubcategories.length > 0
                      ? [
                          ...selectedSubcategoryIds.map((id) => findSubcategory(id)?.name ?? id),
                          ...customSubcategories.map((item) => item.name)
                        ].join(" · ")
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
                {situation ? (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">现状与卡点</div>
                    <p className="mt-1">
                      {STAGE_OPTIONS.find((item) => item.id === situation.stage)?.label} ·{" "}
                      {situation.platforms
                        .map((id) => PLATFORM_OPTIONS.find((item) => item.id === id)?.label ?? id)
                        .join("、")} ·{" "}
                      {BUDGET_OPTIONS.find((item) => item.id === situation.budgetTier)?.label}
                    </p>
                  </div>
                ) : null}
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
