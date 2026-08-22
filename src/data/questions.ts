import type { PrimaryEmphasis } from "@/types/user-profile";

export type QuestionnaireKey = "teamSize" | "primaryProblem";

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  emphasis?: PrimaryEmphasis;
}

export interface Question {
  key: QuestionnaireKey;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    key: "teamSize",
    title: "实际参与这类工作的人员有多少？",
    subtitle: "这里只统计参与所选工作的团队成员，不是整个公司的员工人数。",
    options: [
      { id: "solo", label: "1 人", description: "我自己基本负责全部工作" },
      { id: "small_team", label: "2–5 人", description: "有简单分工，但经常互相补位" },
      { id: "mid_team", label: "6–10 人", description: "已经有比较明确的岗位分工" },
      { id: "large_team", label: "11–20 人", description: "已经形成负责人、执行人员和审批关系" },
      { id: "xlarge_team", label: "20 人以上", description: "多个团队协作，流程与层级更复杂" }
    ]
  },
  {
    key: "primaryProblem",
    title: "这次你最想先解决哪个问题？",
    subtitle: "我们会根据这个选择调整 SOP 的重点。",
    options: [
      {
        id: "unclear_process",
        label: "工作没有明确流程",
        description: "大家知道要做事情，但经常不知道标准步骤和下一步是什么。",
        emphasis: "strategy_and_process"
      },
      {
        id: "low_efficiency",
        label: "效率太低",
        description: "一个任务经常推进很久，重复沟通和返工比较多。",
        emphasis: "execution_efficiency"
      },
      {
        id: "frequent_errors",
        label: "容易出错",
        description: "经常因为遗漏检查、交接不清或操作失误导致问题。",
        emphasis: "quality_control"
      },
      {
        id: "lack_of_metrics",
        label: "不知道做得好不好",
        description: "工作做了很多，但缺少明确指标和复盘标准。",
        emphasis: "data_review"
      },
      {
        id: "other",
        label: "其他",
        description: "填写你真正想先解决的问题。"
      }
    ]
  }
];

export function findOption(key: QuestionnaireKey, id: string): QuestionOption | undefined {
  return questions.find((question) => question.key === key)?.options.find((option) => option.id === id);
}

export function getOptionLabel(key: QuestionnaireKey, id: string): string {
  return findOption(key, id)?.label ?? id;
}
