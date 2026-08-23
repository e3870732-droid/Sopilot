import type { RoleWorksheet } from "@/types/workflow";

export const growthWorkflow: RoleWorksheet = {
  id: "growth_operations_v1",
  operationType: "growth_operations",
  category: "增长",
  name: "渠道增长运营",
  northStar: "数据驱动的全链路获客与转化漏斗优化。",
  output: "增长模型、实验台账、增长周报",
  cycle: "周实验排期，月漏斗复盘",
  steps: [
    {
      title: "定义增长模型",
      action: "用 AARRR 漏斗拆解关键环节，定义北极星指标与增长假设。",
      owner: "增长负责人",
      handoff: "与产品、市场、销售对齐指标口径。",
      proof: "增长模型文档 + 指标定义",
      tags: ["no_metrics_defined", "inconsistent_standards"]
    },
    {
      title: "定位漏损",
      action: "通过漏斗与用户路径数据，定位流失最严重的转化节点。",
      owner: "增长运营",
      handoff: "与数据团队确认埋点和归因。",
      proof: "漏斗分析 + 漏损节点清单",
      tags: ["data_scattered", "no_benchmark"]
    },
    {
      title: "设计实验",
      action: "针对漏损节点提出假设，设计小规模 A/B 测试与验证方案。",
      owner: "增长运营",
      handoff: "实验方案同步产品与研发排期。",
      proof: "实验方案 + 排期记录",
      tags: ["no_templates", "priority_chaos"]
    },
    {
      title: "验证与规模化",
      action: "验证有效后放量，搭建自动化投放与承接链路，并沉淀方法论。",
      owner: "增长运营",
      handoff: "规模化方案同步市场、产品和销售。",
      proof: "实验结论 + 增长周报",
      tags: ["no_review_rhythm", "not_documented"]
    }
  ],
  cadence: [
    { rhythm: "每周", actions: "排期并复盘增长实验。" },
    { rhythm: "每渠道", actions: "监控转化率、CAC 与渠道归因。" },
    { rhythm: "每月", actions: "输出漏斗与实验胜率复盘。" }
  ],
  deliverables: ["增长模型文档", "渠道归因方案", "实验台账", "增长周报", "方法论沉淀"],
  collaboration: ["产品：落地页与路径", "数据：埋点与归因", "市场：渠道素材", "销售：线索承接"],
  kpis: ["北极星指标", "各环节转化率", "获客成本", "渠道归因占比", "实验胜率"],
  guardrails: ["核心指标骤降 24 小时内归因", "实验数据污染立即停止实验", "预算耗尽时保核心渠道"]
};
