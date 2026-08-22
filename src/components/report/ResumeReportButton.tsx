"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportSignature, loadReportDraft } from "@/lib/report-draft";
import type { SopOutput } from "@/types/workflow";

export function ResumeReportButton({ output }: { output: SopOutput }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const draft = loadReportDraft();
    setVisible(Boolean(draft && draft.signature === getReportSignature(output)));
  }, [output]);

  if (!visible) {
    return null;
  }

  return (
    <Button variant="outline" size="lg" onClick={() => router.push(`/report${window.location.search}`)}>
      <FileText />
      继续查看已生成报告
      <ArrowRight />
    </Button>
  );
}
