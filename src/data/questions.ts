import type { PrimaryEmphasis } from "@/types/user-profile";

export type QuestionnaireKey = "operationType" | "teamSize" | "primaryProblem";

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  flow?: string;
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
    key: "operationType",
    title: "你现在最想规范哪类运营工作？",
    subtitle: "选择你现在最希望建立标准流程的一类工作，之后可以继续创建其他 SOP。",
    options: [
      {
        id: "content_operations",
        label: "内容与账号",
        description: "公众号、小红书、抖音、视频号、图文和短视频内容运营",
        flow: "选题 → 创作 → 审核 → 发布 → 数据复盘"
      },
      {
        id: "ecommerce_operations",
        label: "电商与直播",
        description: "店铺运营、商品管理、直播带货、电商转化",
        flow: "选品 → 上架 → 直播 → 转化 → 售后"
      },
      {
        id: "user_operations",
        label: "用户与私域",
        description: "社群、会员、私域用户、用户留存和复购",
        flow: "拉新 → 承接 → 活跃 → 转化 → 复购"
      },
      {
        id: "growth_operations",
        label: "市场与增长",
        description: "渠道拓展、广告投放、BD、增长实验和获客",
        flow: "渠道 → 获客 → 转化 → ROI分析 → 优化"
      },
      {
        id: "event_operations",
        label: "活动运营",
        description: "线上活动、线下活动、营销活动和节点活动",
        flow: "立项 → 策划 → 准备 → 执行 → 复盘"
      },
      {
        id: "product_operations",
        label: "产品运营",
        description: "产品功能上线、用户教育、用户反馈和产品协同",
        flow: "上线准备 → 发布 → 用户触达 → 反馈 → 优化"
      }
    ]
  },
  {
    key: "teamSize",
    title: "实际参与这类工作的人员有多少？",
    subtitle: "这里只统计参与这项工作的团队成员，不是整个公司的员工人数。",
    options: [
      {
        id: "solo",
        label: "1 人",
        description: "我自己基本负责全部工作"
      },
      {
        id: "small_team",
        label: "2–3 人",
        description: "有简单分工，但经常互相补位"
      },
      {
        id: "structured_team",
        label: "4–8 人",
        description: "已经有比较明确的岗位分工"
      },
      {
        id: "large_team",
        label: "8 人以上",
        description: "已经存在负责人、执行人员和审批关系"
      }
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
