import type { RoleWorksheet } from "@/types/workflow";

export const productWorkflow: RoleWorksheet = {
  id: "product_operations_v1",
  operationType: "product_operations",
  category: "产品",
  name: "产品运营",
  northStar: "连接用户与产品，提升产品使用深度与商业价值。",
  output: "需求池、上线清单、培训手册、版本复盘",
  cycle: "版本周期 + 上线后 7/30 天数据复盘",
  steps: [
    {
      title: "需求收集与澄清",
      action: "统一收集用户、经销商和内部反馈，区分问题、需求、建议与培训缺口。",
      owner: "产品运营",
      handoff: "用场景、频次和证据整理后交产品评审。",
      proof: "需求池 + 优先级"
    },
    {
      title: "方案与排期",
      action: "把需求转成用户故事、验收标准、上线影响和培训计划，跟进评审与排期。",
      owner: "产品运营 / 产品",
      handoff: "对外承诺前确认开发、测试与运营交付时间。",
      proof: "需求单 + 版本排期"
    },
    {
      title: "上线与验收",
      action: "完成测试、权限、配置、灰度、上线通知和回滚预案，按真实用户路径验收。",
      owner: "产品运营",
      handoff: "阻断问题明确升级人与恢复时间。",
      proof: "上线检查单 + 验收记录"
    },
    {
      title: "教育与采用",
      action: "用手册、FAQ、案例、直播或 1v1 培训降低学习成本，跟踪使用情况。",
      owner: "产品运营",
      handoff: "不会用的问题回流需求池。",
      proof: "培训材料 + 使用数据"
    },
    {
      title: "监控与迭代",
      action: "观察渗透率、留存、使用时长、关键路径转化和满意度，形成版本复盘。",
      owner: "数据 / 产品运营",
      handoff: "给产品研发和业务高管一页结论。",
      proof: "版本复盘 + 迭代建议"
    }
  ],
  cadence: [
    { rhythm: "上线前", actions: "确认需求、验收标准与上线材料。" },
    { rhythm: "上线后 7 天", actions: "观察采用率与关键路径转化。" },
    { rhythm: "上线后 30 天", actions: "输出版本复盘与迭代建议。" }
  ],
  deliverables: ["需求池", "需求单", "上线检查单", "培训材料", "版本复盘"],
  collaboration: ["产品：需求与排期", "研发：交付与修复", "客服：一线反馈", "业务：关键客户培训"],
  kpis: ["功能渗透率", "留存率", "使用时长", "NPS", "核心行为转化率"],
  guardrails: ["严重 BUG 启动降级", "负面反馈 48 小时内回应", "核心路径转化骤降协同排查"]
};
