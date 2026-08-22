# Sopilot

企业运营 SOP 智能生成平台。

当前为 Hackathon MVP，实现从「多选运营方向」到「岗位工作纸」的基础链路，并可选接入 LLM 做定制建议。暂不含数据库、登录注册或用户历史记录。

## 技术栈

- Next.js（App Router）
- TypeScript
- Tailwind CSS
- shadcn/ui 风格组件
- npm

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 构建

```bash
npm run build
npm start
```

## AI 定制（可选）

复制 `.env.example` 为 `.env` 并填写：

```bash
LLM_BASE_URL=https://aiping.cn/api/v1
LLM_API_KEY=你的_key
LLM_MODEL=deepseek-v4-pro
```

未配置 `LLM_API_KEY` 或调用失败时，结果页会自动回退到确定性建议，不会影响主流程。

## 目录结构

```text
src/
├── app/
│   ├── page.tsx
│   ├── questionnaire/page.tsx
│   ├── result/page.tsx
│   └── api/generate/route.ts
├── components/
│   ├── questionnaire/
│   ├── workflow/
│   └── ui/
├── data/
│   ├── categories.ts
│   ├── questions.ts
│   ├── subcategories.ts
│   └── workflows/
├── lib/
│   ├── workflow-mapper.ts
│   └── workflow-customizer.ts
└── types/
```

## 数据流

```text
Questionnaire（企业画像 → 岗位职责 → 团队规模 → 现状与卡点）
→ QuestionnaireSelection
→ Mapping Engine
→ Workflow Registry
→ Role Worksheet（总纲 + 子流程）
```

## Mapping 规则

- 前置输入：`company`（行业 / 业务模式 / 企业规模）与 `situation`（阶段 / 平台 / 预算）决定输出上下文。
- Layer 1：多选 `operationType` 决定输出哪些岗位工作纸总纲。
- Layer 2：多选子类（含自定义子类）决定输出哪些子流程，子流程先复用所属大类工作流。
- Layer 3：`teamSize` 决定团队规模适配（5 档）。
- Layer 4：`primaryProblem` 决定本次优化重点。

## 当前范围

第一阶段已完成：

- 企业画像页（行业 / 业务模式 / 企业规模）
- 8 大类多选 + 子类多选 + 每大类自定义子类问卷
- 团队规模（5 档）与现状卡点（阶段 / 平台 / 预算 / 首要问题）
- 8 个岗位工作纸与子类 Registry
- 确定性 Mapping Engine
- 统一「岗位工作纸」输出结构
- 生成前确认页与 Debug Preview 页

下一阶段建议：

- 接入 `/api/generate`，基于 Template + User Profile 调用 LLM 生成定制 SOP。
- 完善 6 个 Workflow Template 的实际工作流内容。
