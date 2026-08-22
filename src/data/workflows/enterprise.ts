import type { RoleWorksheet } from "@/types/workflow";

export const enterpriseWorkflow: RoleWorksheet = {
  id: "enterprise_operations_v1",
  operationType: "enterprise_operations",
  category: "治理",
  name: "企业运营",
  northStar: "让品牌资产可积累、用户关系可经营、经营数据可决策。",
  output: "品牌资产库、私域经营表、经营分析报告",
  cycle: "周数据看板，月经营复盘，季资产盘点",
  steps: [
    {
      title: "品牌资产沉淀",
      action: "明确定位、核心话术与视觉规范，整理 PR、发布会、专家、案例和成果。",
      owner: "运营负责人",
      handoff: "与市场、内容、销售共用品牌口径。",
      proof: "品牌手册 + 资产库"
    },
    {
      title: "私域承接经营",
      action: "把公域、活动、销售和交付用户引入私域触点，打标签、分层并设计触达。",
      owner: "企业运营",
      handoff: "用户状态与销售、客服、交付同步。",
      proof: "触点地图 + 标签体系"
    },
    {
      title: "数据口径治理",
      action: "明确指标定义、数据来源、更新频率和责任人，完成采集、清洗与看板。",
      owner: "企业运营 / 数据",
      handoff: "与财务、销售、产品确认同一指标计算方式。",
      proof: "指标字典 + 数据看板"
    },
    {
      title: "经营分析与决策",
      action: "围绕收入、线索、用户、交付和成本输出结论、风险和建议，跟踪执行。",
      owner: "运营负责人 / 企业运营",
      handoff: "在经营会中明确决策人、动作人和截止时间。",
      proof: "经营分析报告 + 行动表"
    }
  ],
  cadence: [
    { rhythm: "每周", actions: "更新经营数据看板与异常预警。" },
    { rhythm: "每月", actions: "输出经营分析报告与行动项。" },
    { rhythm: "每季度", actions: "盘点品牌资产、私域资产与数据口径。" }
  ],
  deliverables: ["品牌手册", "资产库", "触点地图", "标签体系", "指标字典", "经营分析报告"],
  collaboration: ["市场/内容/销售：统一口径", "财务：指标口径", "数据：采集与看板", "经营会：决策与行动"],
  kpis: ["品牌搜索指数/美誉度", "私域用户数/复购率", "数据看板覆盖率", "报告采纳率"],
  guardrails: ["品牌负面 24 小时内声明、48 小时内出结果", "私域账号封禁启用备用账号", "数据看板异常 72 小时内恢复"]
};
