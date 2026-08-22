# Sopilot

企业运营 SOP 智能生成平台。

当前为 Hackathon MVP 第一阶段，只实现从问卷到 Workflow Mapping 的基础链路，暂不接入 LLM、数据库、登录注册或用户历史记录。

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
│   ├── questions.ts
│   └── workflows/
├── lib/
│   ├── workflow-mapper.ts
│   └── workflow-customizer.ts
└── types/
```

## 数据流

```text
Questionnaire
→ UserProfile
→ Mapping Engine
→ Workflow Registry
→ Mapping Result
```

## Mapping 规则

- Layer 1：`operationType` 决定使用哪个 Workflow Template。
- Layer 2：`teamSize` 决定 Team Variant，影响 roles、checkpoints、metrics。
- Layer 3：`primaryProblem` 决定 Workflow Emphasis。

## 当前范围

第一阶段已完成：

- 三步用户问卷
- 结构化 `UserProfile`
- 6 个静态 Workflow Template 与 Registry
- 确定性 Mapping Engine 与 Customizer
- 生成前确认页与 Debug Preview 页

下一阶段建议：

- 接入 `/api/generate`，基于 Template + User Profile 调用 LLM 生成定制 SOP。
- 完善 6 个 Workflow Template 的实际工作流内容。
