import type { RoleWorksheet } from "@/types/workflow";

export const ecommerceWorkflow: RoleWorksheet = {
  id: "ecommerce_operations_v1",
  operationType: "ecommerce_operations",
  category: "交易",
  name: "电商运营",
  northStar: "提升店铺和直播间的流量、转化与 GMV。",
  output: "月度选品清单、直播复盘、售后复盘",
  cycle: "日监控，周复盘，月度选品与库存规划",
  steps: [
    {
      title: "选品与定价",
      action: "分析市场趋势与品类结构，规划引流款、利润款与形象款，完成定价与备货。",
      owner: "品类运营",
      handoff: "与供应链确认供货与补货。",
      proof: "月度选品清单 + 备货记录"
    },
    {
      title: "店铺与货架",
      action: "完成店铺装修、详情页优化、SKU 管理和活动报名。",
      owner: "店铺运营",
      handoff: "与设计确认素材，与平台确认活动。",
      proof: "详情页 + 活动报名记录"
    },
    {
      title: "流量与直播",
      action: "通过付费推广、自然搜索、达人合作与直播排期获取流量。",
      owner: "投放 / 运营",
      handoff: "与主播和场控对齐直播脚本。",
      proof: "投放报表 + 直播排期"
    },
    {
      title: "转化与履约",
      action: "跟进客服转化、订单处理、物流跟踪与售后评价，守住成交与口碑。",
      owner: "客服 / 履约",
      handoff: "异常订单与投诉升级给运营。",
      proof: "发货台账 + 售后记录"
    },
    {
      title: "复盘与补货",
      action: "分析 GMV、UV 价值、转化率与库存周转，沉淀爆款并安排补货。",
      owner: "数据运营",
      handoff: "补货计划交给供应链执行。",
      proof: "复盘报告 + 补货计划"
    }
  ],
  cadence: [
    { rhythm: "每日", actions: "监控店铺、直播和履约数据。" },
    { rhythm: "每周", actions: "复盘转化与售后，优化页面与话术。" },
    { rhythm: "每月", actions: "调整选品结构、库存与推广预算。" }
  ],
  deliverables: ["选品清单", "详情页", "直播脚本", "发货台账", "复盘报告"],
  collaboration: ["供应链：备货与补货", "设计：详情页与素材", "主播/场控：直播执行", "客服：履约与售后"],
  kpis: ["GMV", "UV 价值", "转化率", "客单价", "退货率", "直播间停留/互动"],
  guardrails: ["直播断线立即重连并安抚", "库存不可超卖", "差评与售后 48 小时内处理"]
};
