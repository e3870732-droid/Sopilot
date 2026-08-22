import type { CompanyScale, Industry } from "@/types/company";

export interface IndustryOption {
  id: Industry;
  label: string;
}

export interface CompanyScaleOption {
  id: CompanyScale;
  label: string;
  description: string;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: "internet_software", label: "互联网 / 软件" },
  { id: "ecommerce", label: "电子商务" },
  { id: "retail", label: "消费零售" },
  { id: "education", label: "教育" },
  { id: "healthcare", label: "医疗健康" },
  { id: "finance", label: "金融" },
  { id: "enterprise_services", label: "企业服务" },
  { id: "manufacturing", label: "制造业" },
  { id: "media", label: "文化传媒" },
  { id: "other", label: "其他" }
];

export const COMPANY_SCALE_OPTIONS: CompanyScaleOption[] = [
  {
    id: "micro",
    label: "小微企业",
    description: "≤ 20 人，或年营收 < 500 万"
  },
  {
    id: "small",
    label: "小型企业",
    description: "21–100 人，或 500 万–3000 万"
  },
  {
    id: "medium",
    label: "中型企业",
    description: "101–300 人，或 3000 万–1 亿"
  }
];

export function getIndustryLabel(id: string): string {
  return INDUSTRY_OPTIONS.find((item) => item.id === id)?.label ?? id;
}

export function getCompanyScaleLabel(id: string): string {
  return COMPANY_SCALE_OPTIONS.find((item) => item.id === id)?.label ?? id;
}
