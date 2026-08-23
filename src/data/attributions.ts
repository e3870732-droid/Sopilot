import type { OperationType, PrimaryProblem } from "@/types/user-profile";
import type { AttributionKey, SopOutput } from "@/types/workflow";

export type AttributableProblem = Exclude<PrimaryProblem, "other">;

export interface AttributionDef {
  key: AttributionKey;
  problem: AttributableProblem;
  /** 归因类型名（各分类通用） */
  label: string;
  /** 通用描述（分类未覆盖时的兜底） */
  description: string;
  /** 优化动作模板：与分类链路组合成「优化重点」 */
  action: string;
}

export const ATTRIBUTION_DEFS: Record<AttributableProblem, AttributionDef[]> = {
  unclear_process: [
    {
      key: "not_documented",
      problem: "unclear_process",
      label: "没写下来",
      description: "靠口头和记忆传，新人来了没人教。",
      action: "先把每一步的动作、负责人和留痕写成文"
    },
    {
      key: "documented_but_ignored",
      problem: "unclear_process",
      label: "有文档没人按",
      description: "流程躺在文档里，实际各干各的。",
      action: "用检查和复盘机制确保流程被真正执行"
    },
    {
      key: "wrong_sequence",
      problem: "unclear_process",
      label: "顺序本身不对",
      description: "环节先后或衔接有问题，经常返工。",
      action: "重排环节顺序，明确前后衔接与出入口标准"
    },
    {
      key: "unclear_ownership",
      problem: "unclear_process",
      label: "没人认领",
      description: "环节边界模糊，出了问题互相推。",
      action: "明确每个环节的负责人与边界"
    }
  ],
  low_efficiency: [
    {
      key: "approval_overhead",
      problem: "low_efficiency",
      label: "审批层级太多",
      description: "事事要等人批，时间耗在沟通上。",
      action: "压缩审批层级，能并行不串行"
    },
    {
      key: "handoff_churn",
      problem: "low_efficiency",
      label: "交接反复确认",
      description: "交一遍说不清楚，来回问。",
      action: "把交接内容标准化，一次交清"
    },
    {
      key: "no_templates",
      problem: "low_efficiency",
      label: "没有模板重复劳动",
      description: "每次都从零开始。",
      action: "把高频动作模板化、批量处理"
    },
    {
      key: "priority_chaos",
      problem: "low_efficiency",
      label: "优先级混乱",
      description: "总被临时事情打断，正事推不动。",
      action: "固定排期与优先级规则，减少临时打断"
    }
  ],
  frequent_errors: [
    {
      key: "missing_checks",
      problem: "frequent_errors",
      label: "检查遗漏",
      description: "凭感觉做，少了核对环节。",
      action: "在关键节点加检查清单与 Review"
    },
    {
      key: "handoff_info_loss",
      problem: "frequent_errors",
      label: "交接信息丢失",
      description: "上一步的信息到下一步就缺了。",
      action: "交接必带字段清单，信息不丢"
    },
    {
      key: "unskilled_operation",
      problem: "frequent_errors",
      label: "操作不熟",
      description: "新人上手慢，靠试错。",
      action: "用模板与培训降低操作门槛"
    },
    {
      key: "inconsistent_standards",
      problem: "frequent_errors",
      label: "口径不一致",
      description: "每个人标准不一样，结果对不上。",
      action: "统一口径与验收标准"
    }
  ],
  lack_of_metrics: [
    {
      key: "no_metrics_defined",
      problem: "lack_of_metrics",
      label: "没有指标",
      description: "做了很多事，但不知道看什么数。",
      action: "先定义指标与口径"
    },
    {
      key: "no_review_rhythm",
      problem: "lack_of_metrics",
      label: "没有复盘节奏",
      description: "有数据但没人定期看。",
      action: "固定复盘节奏，用数据说话"
    },
    {
      key: "no_benchmark",
      problem: "lack_of_metrics",
      label: "不知道对标什么",
      description: "不知道做到什么程度算好。",
      action: "建立对标与停止条件"
    },
    {
      key: "data_scattered",
      problem: "lack_of_metrics",
      label: "数据太分散",
      description: "数在各个平台里，凑不齐。",
      action: "统一数据来源与看板"
    }
  ]
};

export const ATTRIBUTION_KEYS_BY_PROBLEM: Record<AttributableProblem, AttributionKey[]> = {
  unclear_process: ATTRIBUTION_DEFS.unclear_process.map((def) => def.key),
  low_efficiency: ATTRIBUTION_DEFS.low_efficiency.map((def) => def.key),
  frequent_errors: ATTRIBUTION_DEFS.frequent_errors.map((def) => def.key),
  lack_of_metrics: ATTRIBUTION_DEFS.lack_of_metrics.map((def) => def.key)
};

const ALL_ATTRIBUTION_KEYS: AttributionKey[] = Object.values(ATTRIBUTION_DEFS)
  .flat()
  .map((def) => def.key);

export function isAttributionKey(value: unknown): value is AttributionKey {
  return typeof value === "string" && (ALL_ATTRIBUTION_KEYS as string[]).includes(value);
}

export function getAttributionDef(key: AttributionKey): AttributionDef {
  return Object.values(ATTRIBUTION_DEFS)
    .flat()
    .find((def) => def.key === key)!;
}

/** 各分类的关键链路：优化重点文案的落点 */
export const CATEGORY_CHAINS: Record<OperationType, string> = {
  market_operations: "渠道盘点 → 拓展测试 → 投放监控 → 复盘续约",
  content_operations: "选题 → 制作 → 发布 → 数据迭代",
  user_operations: "分层建档 → 拉新承接 → 活跃留存 → 转化召回",
  event_operations: "立项 → 方案排期 → 筹备上线 → 监控复盘",
  growth_operations: "增长模型 → 漏损定位 → 实验设计 → 验证放量",
  ecommerce_operations: "选品定价 → 店铺货架 → 流量直播 → 转化履约 → 复盘补货",
  product_operations: "需求澄清 → 方案排期 → 上线验收 → 教育采用 → 监控迭代",
  enterprise_operations: "品牌资产 → 私域经营 → 数据口径 → 经营决策"
};

/** 分类场景化的归因描述（覆盖通用 description，label 沿用通用归因名） */
export const CATEGORY_ATTRIBUTION_TEXT: Record<OperationType, Partial<Record<AttributionKey, string>>> = {
  market_operations: {
    not_documented: "渠道怎么试、试完怎么办，全凭经验。",
    documented_but_ignored: "有投放规范，但执行时还是随意上计划。",
    wrong_sequence: "没定线索口径就投放，销售接不住。",
    unclear_ownership: "渠道、素材、承接没人明确负责。",
    approval_overhead: "预算和素材层层审批，错过投放窗口。",
    handoff_churn: "线索给销售后，跟进情况没人回传。",
    no_templates: "每个渠道的实验单、复盘都从头写。",
    priority_chaos: "临时需求插队，渠道测试半途而废。",
    missing_checks: "上线前不检查落地页和埋点。",
    handoff_info_loss: "线索来源、画像到销售手里就丢了。",
    unskilled_operation: "新人不懂投放后台，靠试错烧钱。",
    inconsistent_standards: "「有效线索」的定义每次都不一样。",
    no_metrics_defined: "只看曝光和消耗，不看 CAC 和回收周期。",
    no_review_rhythm: "投完不复盘，下个月照旧。",
    no_benchmark: "不知道 CAC 多少算贵。",
    data_scattered: "各平台后台数据各自为战。"
  },
  content_operations: {
    not_documented: "选题、写作、发布全靠个人感觉。",
    documented_but_ignored: "有内容规范，但写法还是各凭喜好。",
    wrong_sequence: "没定选题就先写，写完没人用。",
    unclear_ownership: "选题会、审核、发布没人明确负责。",
    approval_overhead: "一篇内容层层审，热点都过了。",
    handoff_churn: "文案和设计来回改，需求说不清。",
    no_templates: "每篇都从零想结构、起标题。",
    priority_chaos: "临时热点一插，内容日历全乱。",
    missing_checks: "不检查事实、版权和敏感词就发。",
    handoff_info_loss: "高意向评论没转给销售就沉了。",
    unskilled_operation: "新人不知道平台调性，写啥扑啥。",
    inconsistent_standards: "各平台标题封面口径随手改。",
    no_metrics_defined: "只看阅读量，不看转化。",
    no_review_rhythm: "发完就发完了，从不拆爆款。",
    no_benchmark: "不知道同类账号什么水平算好。",
    data_scattered: "各平台数据分散，汇总靠手抄。"
  },
  user_operations: {
    not_documented: "分层、触达全凭运营个人手感。",
    documented_but_ignored: "有分层规则，但触达还是一刀切。",
    wrong_sequence: "用户还没承接好就急着做转化。",
    unclear_ownership: "社群、会员、召回没人认领。",
    approval_overhead: "发个权益要层层审批，用户都流失了。",
    handoff_churn: "高意向用户给销售，上下文断档。",
    no_templates: "每个社群的欢迎语、话术都现想。",
    priority_chaos: "被客服消息牵着走，计划触达完不成。",
    missing_checks: "群发前不检查名单和内容。",
    handoff_info_loss: "用户标签和记录交接时丢失。",
    unskilled_operation: "新人不知道什么用户该说什么话。",
    inconsistent_standards: "分层标准每人一套，数据对不上。",
    no_metrics_defined: "只看群人数，不看活跃和复购。",
    no_review_rhythm: "触达发了就发了，从不复盘效果。",
    no_benchmark: "不知道复购率多少算健康。",
    data_scattered: "用户在企微、公众号、社群里数据割裂。"
  },
  event_operations: {
    not_documented: "活动怎么办全靠老手记忆。",
    documented_but_ignored: "有活动 SOP，执行时还是漏环节。",
    wrong_sequence: "物料没验收就先推广。",
    unclear_ownership: "策划、设计、客服职责交叉没人兜底。",
    approval_overhead: "预算和方案审批慢，错过节点。",
    handoff_churn: "策划和设计对需求反复拉扯。",
    no_templates: "每场活动的方案、清单都重写。",
    priority_chaos: "多场活动撞期，资源互相抢。",
    missing_checks: "上线前不测流程，活动中出故障。",
    handoff_info_loss: "客服拿到的活动规则是旧版。",
    unskilled_operation: "新人控场没经验，异常不会处理。",
    inconsistent_standards: "奖品发放、数据口径每场都不一样。",
    no_metrics_defined: "只看参与人数，不算 ROI。",
    no_review_rhythm: "活动结束不复盘，经验留不住。",
    no_benchmark: "不知道转化率多少算达标。",
    data_scattered: "报名、核销、传播数据各在一处。"
  },
  growth_operations: {
    not_documented: "增长假设和实验全靠脑记。",
    documented_but_ignored: "有实验流程，但大家还是拍脑袋上。",
    wrong_sequence: "没定位漏损就先放量。",
    unclear_ownership: "漏斗各环节没人认领。",
    approval_overhead: "一个 A/B 实验要排期等研发。",
    handoff_churn: "实验结论同步不到投放和内容。",
    no_templates: "每个实验的方案和复盘都重写。",
    priority_chaos: "实验总被业务需求挤掉。",
    missing_checks: "不验证埋点就上实验。",
    handoff_info_loss: "实验上下文换人接手就断。",
    unskilled_operation: "新人不懂漏斗分析，无从下手。",
    inconsistent_standards: "转化率口径各团队不一致。",
    no_metrics_defined: "没有北极星指标，不知道优化什么。",
    no_review_rhythm: "实验跑完不复盘胜率。",
    no_benchmark: "不知道各环节转化率多少算正常。",
    data_scattered: "埋点、投放、成交数据对不起来。"
  },
  ecommerce_operations: {
    not_documented: "选品、上架、直播全靠个人经验。",
    documented_but_ignored: "有运营手册，执行时还是随意。",
    wrong_sequence: "货没备好就先投流。",
    unclear_ownership: "选品、客服、售后责任不清。",
    approval_overhead: "改个价、报个活动层层审批。",
    handoff_churn: "直播脚本和库存信息对不齐。",
    no_templates: "每场直播、每个详情页都从零做。",
    priority_chaos: "被平台活动节奏牵着走，自己的规划全乱。",
    missing_checks: "上架前不检查价格和库存。",
    handoff_info_loss: "售后问题没沉淀，反复踩坑。",
    unskilled_operation: "新人不懂平台规则，违规踩雷。",
    inconsistent_standards: "各店铺、各主播口径不统一。",
    no_metrics_defined: "只看 GMV，不看 UV 价值和退货率。",
    no_review_rhythm: "直播完不复盘，下一场照旧。",
    no_benchmark: "不知道转化率多少算合格。",
    data_scattered: "店铺、直播、私域数据各看各的。"
  },
  product_operations: {
    not_documented: "需求和上线流程靠口头同步。",
    documented_but_ignored: "有需求管理流程，但大家还是群里喊。",
    wrong_sequence: "没澄清需求就进开发。",
    unclear_ownership: "需求、培训、反馈没人认领。",
    approval_overhead: "需求评审链条长，响应慢。",
    handoff_churn: "运营和产品对需求理解反复对齐。",
    no_templates: "需求单、验收单每次都重写。",
    priority_chaos: "优先级天天变，排期形同虚设。",
    missing_checks: "上线前不做真实路径验收。",
    handoff_info_loss: "用户反馈到产品手里丢了场景。",
    unskilled_operation: "一线不会用新功能，培训缺失。",
    inconsistent_standards: "验收标准每次都不一样。",
    no_metrics_defined: "不看渗透率和留存，凭感觉说好坏。",
    no_review_rhythm: "上线后不跟踪 7/30 天数据。",
    no_benchmark: "不知道功能渗透率多少算合格。",
    data_scattered: "埋点、客服、调研数据分散。"
  },
  enterprise_operations: {
    not_documented: "品牌口径、私域规则靠口头传。",
    documented_but_ignored: "有品牌手册，对外物料还是各做各的。",
    wrong_sequence: "私域没承接好就先做品牌投放。",
    unclear_ownership: "品牌、私域、数据三块没人统筹。",
    approval_overhead: "对外发声层层审批，错过时效。",
    handoff_churn: "公域线索进私域时信息断层。",
    no_templates: "经营分析、复盘报告每次重写。",
    priority_chaos: "老板临时想法多，长期项目推不动。",
    missing_checks: "对外发布前不做合规与口径检查。",
    handoff_info_loss: "用户状态在销售、客服间不同步。",
    unskilled_operation: "新人不懂数据口径，报表做错。",
    inconsistent_standards: "同一个指标各部门算法不同。",
    no_metrics_defined: "经营会凭感觉，没有统一看板。",
    no_review_rhythm: "经营分析开了会没行动跟踪。",
    no_benchmark: "不知道私域复购率多少算好。",
    data_scattered: "财务、销售、私域数据各自为政。"
  }
};

export function getAttributionOptionText(
  operationType: OperationType,
  key: AttributionKey
): { label: string; description: string } {
  const def = getAttributionDef(key);
  return {
    label: def.label,
    description: CATEGORY_ATTRIBUTION_TEXT[operationType]?.[key] ?? def.description
  };
}

/** 组合优化重点文案：归因动作 + 分类链路 */
export function buildFocusLine(operationType: OperationType, key: AttributionKey): string {
  const def = getAttributionDef(key);
  return `在「${CATEGORY_CHAINS[operationType]}」链路上，${def.action}。`;
}

export type StepPriority = "P0" | "P1" | "P2";

/**
 * C 层逻辑：归因反向标注总纲。
 * 命中所选归因的步骤 → P0；命中同痛点其他归因 → P1；其余 → P2。
 * 任务清单本体对所有人唯一，只有标注变。
 */
export function getStepPriority(
  tags: AttributionKey[] | undefined,
  operationType: OperationType,
  output: SopOutput
): StepPriority {
  if (output.primaryProblem === "other") {
    return "P2";
  }

  const stepTags = tags ?? [];
  const selected = output.attributions?.[operationType];
  if (selected && stepTags.includes(selected)) {
    return "P0";
  }

  const problemKeys = ATTRIBUTION_KEYS_BY_PROBLEM[output.primaryProblem as AttributableProblem];
  if (problemKeys && stepTags.some((tag) => problemKeys.includes(tag))) {
    return "P1";
  }

  return "P2";
}
