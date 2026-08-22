"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearQuestionnaireDraft } from "@/lib/questionnaire-draft";

export function StartQuestionnaireButton() {
  const router = useRouter();

  function handleStart() {
    clearQuestionnaireDraft();
    router.push("/questionnaire");
  }

  return (
    <Button size="lg" onClick={handleStart}>
      开始生成我的 SOP
      <ArrowRight />
    </Button>
  );
}
