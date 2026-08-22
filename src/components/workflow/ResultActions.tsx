"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardCopy, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  markdown: string;
}

export function ResultActions({ markdown }: ResultActionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <Button asChild variant="ghost">
        <Link href="/questionnaire">
          <ArrowLeft />
          返回问卷
        </Link>
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">开发阶段 Preview</Badge>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check /> : <ClipboardCopy />}
          {copied ? "已复制" : "复制 Markdown"}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer />
          打印 / 导出 PDF
        </Button>
      </div>
    </div>
  );
}
