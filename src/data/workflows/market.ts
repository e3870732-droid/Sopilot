import type { RoleWorksheet } from "@/types/workflow";

export const marketWorkflow: RoleWorksheet = {
  id: "market_operations_v1",
  operationType: "market_operations",
  category: "获客",
  name: "市场运营",
  northStar: "用更低的获客成本，持续带来有效线索与品牌曝光。",
  output: "渠道台账、投放复盘、合作续签建议",
  cycle: "周监控，月复盘，季度重做渠道组合",
  steps: [
    {
      title: "盘点与立项",
      action: "按客户来源、决策链和转化周期，筛出 2—3 个最值得验证的渠道；写清目标、预算、素材与停止条件。",
      owner: "市场运营",
      handoff: "与销售确认线索定义、跟进时限和回传字段。",
      proof: "渠道实验单 + 预算审批记录"
    },
    {
      title: "拓展与测试",
      action: "完成媒体、平台或异业伙伴触达，先用小预算或小范围合作验证有效流量，不先承诺规模。",
      owner: "市场运营 / BD",
      handoff: "把合作条件、排期和素材需求交给内容与设计。",
      proof: "合作记录 + 测试排期 + 来源码"
    },
    {
      title: "投放与监控",
      action: "上线前检查落地页、表单、埋点和销售承接；上线后看消耗、有效线索、线索质量和异常波动。",
      owner: "市场运营",
      handoff: "异常超过阈值时，联动销售、产品或技术止损。",
      proof: "日监控表 + 异常处理记录"
    },
    {
      title: "复盘与续约",
      action: "按渠道拆 CAC、有效率、转化率、收入贡献与回收周期，保留优质渠道，停掉无法解释的投入。",
      owner: "市场负责人",
      handoff: "与财务核对账单，与 BD 讨论续签或改价。",
      proof: "月度 ROI 复盘 + 续签建议"
    }
  ],
  cadence: [
    { rhythm: "每日", actions: "检查消耗、线索量、来源归因和异常；抽查高意向线索是否按时交接。" },
    { rhythm: "每周", actions: "和销售对齐渠道质量，淘汰无效创意，确定下周测试的一个变量。" },
    { rhythm: "每月", actions: "输出渠道经营表，做 ROI / CAC / 回收周期复盘，形成预算调整结论。" }
  ],
  deliverables: ["渠道地图", "投放/合作实验单", "线索归因台账", "月度 ROI 复盘"],
  collaboration: ["销售：线索定义与回传", "内容/设计：素材与落地页", "财务：对账与成本核算", "产品/技术：埋点与页面"],
  kpis: ["有效线索数", "线索转化率", "CAC / CPA", "渠道 ROI", "品牌曝光量"],
  guardrails: ["没有来源码或埋点不投放", "没有停止条件不做长期合作", "不以曝光替代有效线索质量"]
};
