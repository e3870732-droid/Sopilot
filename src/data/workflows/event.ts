import type { RoleWorksheet } from "@/types/workflow";

export const eventWorkflow: RoleWorksheet = {
  id: "event_operations_v1",
  operationType: "event_operations",
  category: "转化",
  name: "活动运营",
  northStar: "短期活动实现拉新、促活、转化或品牌的爆发式增长。",
  output: "立项文档、活动方案、结案报告",
  cycle: "项目制，按活动周期推进",
  steps: [
    {
      title: "目标立项",
      action: "明确目标类型、KPI 设定、预算申请和时间节点。",
      owner: "策划 / 负责人",
      handoff: "立项文档审批后进入方案阶段。",
      proof: "立项文档 + 审批记录"
    },
    {
      title: "方案与排期",
      action: "设计玩法、规则、奖品与风险预案，并与跨部门对齐执行排期。",
      owner: "活动策划",
      handoff: "方案评审通过，各部门需求确认。",
      proof: "活动方案 + 排期表"
    },
    {
      title: "筹备上线",
      action: "完成页面与物料设计开发、测试验收、推广排期和客服话术培训。",
      owner: "策划 / 设计 / 技术",
      handoff: "物料验收通过，客服完成培训。",
      proof: "物料验收单 + 培训记录"
    },
    {
      title: "监控与复盘",
      action: "用实时数据看板监控关键节点，处理异常，活动结束后输出结案报告。",
      owner: "活动运营",
      handoff: "复盘结论沉淀进 SOP 和经验库。",
      proof: "数据看板 + 结案报告"
    }
  ],
  cadence: [
    { rhythm: "活动前", actions: "完成立项、方案与上线准备。" },
    { rhythm: "活动中", actions: "小时级监控数据与异常，动态调整。" },
    { rhythm: "活动后", actions: "3 天内输出结案报告与 ROI 核算。" }
  ],
  deliverables: ["立项文档", "活动方案", "物料验收单", "数据看板", "结案报告"],
  collaboration: ["设计/技术：页面与开发", "客服：话术培训", "市场/销售：推广与线索", "财务：预算与结算"],
  kpis: ["参与人数", "转化率", "GMV", "ROI", "新增用户", "传播量"],
  guardrails: ["技术故障 1 小时内响应", "奖品或库存不足启用备用方案", "舆情或规则争议暂停活动"]
};
