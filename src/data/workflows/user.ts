import type { RoleWorksheet } from "@/types/workflow";

export const userWorkflow: RoleWorksheet = {
  id: "user_operations_v1",
  operationType: "user_operations",
  category: "留存",
  name: "用户运营",
  northStar: "提升用户生命周期价值，把一次交易变成持续关系。",
  output: "用户分层表、触达计划、留存复购复盘",
  cycle: "日常维护，周触达复盘，月度留存/复购分析",
  steps: [
    {
      title: "分层建档",
      action: "按新老、活跃度、价值、意向和使用阶段打标签，确保标签能被团队理解和执行。",
      owner: "用户运营",
      handoff: "与产品、销售确认字段来源。",
      proof: "用户标签字典 + 分层台账",
      tags: ["not_documented", "inconsistent_standards"]
    },
    {
      title: "拉新承接",
      action: "设计社群、公众号、企微或会员入口，首触达给出明确价值、规则和下一步。",
      owner: "用户运营 / 活动",
      handoff: "新用户异常交客服，高意向交销售。",
      proof: "承接话术 + 新人欢迎流程",
      tags: ["no_templates", "handoff_info_loss"]
    },
    {
      title: "活跃与留存",
      action: "按用户阶段提供内容、任务、权益或服务提醒，持续观察参与、使用和复购。",
      owner: "社群运营",
      handoff: "权益或服务变化提前通知产品/交付。",
      proof: "月度触达计划 + 社群记录",
      tags: ["no_metrics_defined", "no_templates"]
    },
    {
      title: "转化与召回",
      action: "对沉默、流失、待复购用户区分原因和价值，设计分层触达并记录结果。",
      owner: "用户运营",
      handoff: "把流失原因回传产品、销售和交付团队。",
      proof: "召回名单 + 触达结果 + 流失原因表",
      tags: ["documented_but_ignored", "handoff_info_loss"]
    }
  ],
  cadence: [
    { rhythm: "每日", actions: "承接新用户，处理社群互动和异常问题。" },
    { rhythm: "每周", actions: "执行触达计划，复盘活跃与留存数据。" },
    { rhythm: "每月", actions: "输出留存、复购与流失分析，调整分层策略。" }
  ],
  deliverables: ["用户标签字典", "分层台账", "承接话术", "触达计划", "召回名单", "流失原因表"],
  collaboration: ["产品/销售：字段来源", "客服：异常承接", "交付：权益同步", "活动：裂变与社群"],
  kpis: ["社群活跃度", "会员转化率", "复购率", "留存率", "LTV", "流失率"],
  guardrails: ["社群违规内容立即处理", "投诉集中 24 小时内响应", "会员权益纠纷按规则处理"]
};
