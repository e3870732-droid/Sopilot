"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenerateReportButton() {
  const router = useRouter();

  function handleClick() {
    router.push(`/report${window.location.search}`);
  }

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={handleClick}>
      <FileText />
      生成完整 SOP 报告
      <ArrowRight />
    </Button>
  );
}
