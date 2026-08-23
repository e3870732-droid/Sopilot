import type { RoleWorksheet } from "@/types/workflow";

export const contentWorkflow: RoleWorksheet = {
  id: "content_operations_v1",
  operationType: "content_operations",
  category: "触达",
  name: "内容运营",
  northStar: "持续生产优质内容，建立认知并推动用户向下一步移动。",
  output: "内容日历、素材库、数据迭代结论",
  cycle: "周排期，日发布，月度内容方向复盘",
  steps: [
    {
      title: "选题策划",
      action: "从用户痛点、关键词、热点和业务节点中筛选选题，明确受众、场景、主张、证据与 CTA。",
      owner: "内容运营",
      handoff: "涉及专业内容时，提前拉业务专家审口径。",
      proof: "周内容日历 + 选题卡",
      tags: ["not_documented", "priority_chaos"]
    },
    {
      title: "生产与审核",
      action: "按模板完成脚本、图文或视频，先自检事实、版权、敏感表述和转化入口，再提交审核。",
      owner: "内容运营 / 设计",
      handoff: "审核通过后才进入排期。",
      proof: "成稿 + 审核记录 + 素材归档",
      tags: ["approval_overhead", "missing_checks"]
    },
    {
      title: "分发与互动",
      action: "根据平台用户习惯调整标题、封面、时长和首屏；发布后及时回复评论，识别高频问题。",
      owner: "内容运营",
      handoff: "高意向咨询交给客服或销售。",
      proof: "发布链接 + 评论处理表",
      tags: ["inconsistent_standards", "handoff_info_loss"]
    },
    {
      title: "数据迭代",
      action: "看完播、阅读、互动、收藏、关注和点击；拆解高低表现，沉淀下一轮可复用的做法。",
      owner: "数据 / 策划",
      handoff: "把结论写入选题库与模板库。",
      proof: "内容周报 + 爆款/失效拆解",
      tags: ["no_review_rhythm", "documented_but_ignored"]
    }
  ],
  cadence: [
    { rhythm: "每日", actions: "按内容日历发布，处理评论与高意向线索。" },
    { rhythm: "每周", actions: "排期下周内容，复盘本周选题与素材。" },
    { rhythm: "每月", actions: "复盘内容方向，沉淀爆款与失效经验。" }
  ],
  deliverables: ["周内容日历", "选题卡", "素材库", "内容周报", "爆款/失效拆解"],
  collaboration: ["业务专家：口径审核", "设计/剪辑：成稿制作", "客服/销售：高意向线索承接", "产品：平台与工具"],
  kpis: ["阅读/播放量", "完播率", "互动率", "粉丝增长", "内容转化率"],
  guardrails: ["发布前检查清单 100% 通过", "敏感与版权内容不发", "高意向线索及时交接"]
};
