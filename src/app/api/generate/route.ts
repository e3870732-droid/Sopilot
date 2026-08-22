import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Not implemented",
      message: "SOP 生成将在第二阶段接入 LLM，当前仅提供 Workflow Mapping Preview。"
    },
    { status: 501 }
  );
}
