---
sidebar_position: 4
title: "API 参考"
description: "@powerduck/openapi-cli 的批量运行器、场景运行器、配置、断言及报告生成器参考。下列导出均可从包根路径使用。"
---

# API 参考

`@powerduck/openapi-cli` 的批量运行器、场景运行器、配置、断言及报告生成器参考。下列导出均可从包根路径使用。

## 导出概览

| 导出 | 类别 | 说明 |
|--------|------|-------------|
| `runTests` | 函数 | 运行收集到的全部操作并返回 `TestReport` |
| `resolveConfig` | 函数 | 根据参数、配置文件和默认值解析 `CliConfig` |
| `loadSpec` | 异步函数 | 从本地路径或远程 URL 加载规范并解析引用 |
| `isRemoteSpec` | 函数 | 判断规范路径是否以 `http(s)://` 开头 |
| `DEFAULT_CONFIG` | 常量 | 内置默认值 |
| `runDeclarativeAssertions` | 函数 | 针对响应计算 `DeclarativeAssertion` 数组 |
| `extractAssertions` | 函数 | 从操作中提取 `x-tests` 声明式断言 |
| `extractPostmanScripts` | 函数 | 从操作中提取 Postman 测试脚本字符串 |
| `resolveJsonPath` | 函数 | 精简 JSONPath 解析器，支持点号与数组下标 |
| `generateJsonReport` | 函数 | 将 `report.json` 写入磁盘并返回文件路径 |
| `generateCliReport` | 函数 | 生成彩色 CLI 报告字符串，不打印 |
| `printCliReport` | 函数 | 将 CLI 报告打印到标准输出并返回字符串 |
| `generateHtmlReport` | 函数 | 将 `report.html` 写入磁盘并返回文件路径 |
| `CliArgs` | 类型 | CLI 与配置解析的输入结构 |
| `DeclarativeAssertion` | 类型 | 单个声明式断言对象 |
| `CliConfig` | 类型 | 核心配置接口 |
| `TestReport` | 类型 | `runTests` 返回的完整报告 |
| `TestResult` | 类型 | 单个操作的测试结果 |
| `TestSummary` | 类型 | 汇总通过和失败数量 |
| `AssertionResult` | 类型 | 单个断言的结果 |
| `ReportFormat` | 类型 | `"json" \| "cli" \| "html"` |
| `ProtocolName` | 类型 | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | 类型 | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | 类型 | 鉴权配置 |
| `TlsConfig` | 类型 | TLS 与证书配置 |
| `FilterConfig` | 类型 | 操作筛选器 |
| `collectOperations` | 函数 | 应用批量筛选条件并收集操作 |
| `executeStep` | 异步函数 | 执行单个操作，支持步骤级覆盖 |
| `buildSummary` | 函数 | 根据测试结果计算数量和通过率 |
| `formatAssertionError` | 函数 | 将断言错误转为可读文本 |
| `buildImplicitAssertions` | 函数 | 生成协议对应的默认断言 |
| `runScenario` | 异步函数 | 按顺序运行步骤，支持共享变量和数据驱动迭代 |
| `resolveSteps` | 函数 | 发送请求前解析所有场景引用 |
| `applyExtracts` | 函数 | 将响应值提取为字符串变量 |
| `stepRef` | 函数 | 规范化步骤引用 |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | 类型 | 场景输入和提取规则定义 |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | 类型 | 场景结果、实时事件及执行选项 |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

使用 `loadSpec` 加载规范，按 `config.filter` 收集操作，以有界并发数 `min(config.concurrency ?? 5, queue.length)` 执行，运行声明式和 Postman 断言；未定义用户断言时添加协议对应的隐式断言。结果按路径、方法排序后，以 `TestReport` 返回。

返回的 `TestReport` 结构如下：

```ts
interface TestReport {
  summary: TestSummary;
  results: TestResult[];
  config: CliConfig;
  generatedAt: string; // ISO timestamp
  version: string;     // runner version string
}
```

## resolveConfig

```ts
resolveConfig(args: CliArgs): CliConfig
```

合并 `args`（CLI 参数）、可选 JSON 配置文件 `args.config` 和 `DEFAULT_CONFIG`。如果解析后的 `envFile` 存在，则加载它，并展开 `serverUrl`、`proxy`、请求头值、`auth.token` 和变量值中的 `${ENV_VAR}`。未提供规范时抛出 `"No OpenAPI spec path provided..."`；`proxy` 无法解析时抛出 `Invalid proxy URL: <url>`。

`CliArgs` 与 CLI 选项对应：

```ts
interface CliArgs {
  spec?: string;
  server?: string;
  output?: string;
  format?: string;
  method?: string;
  path?: string;
  tag?: string;
  operationId?: string;
  concurrency?: number;
  timeout?: number;
  proxy?: string;
  ca?: string;
  cert?: string;
  key?: string;
  insecure?: boolean;
  header?: string[];
  bearer?: string;
  variable?: string[];
  config?: string;
  env?: string;
  failOnError?: boolean;
  grpcReflection?: boolean;
  grpcProto?: string[];
  mcpTransport?: string;
  mcpCommand?: string;
  mcpArgs?: string;
  mcpCwd?: string;
}
```

## loadSpec

```ts
loadSpec(config: CliConfig): Promise<unknown>
```

读取 `config.specPath`。当 `isRemoteSpec` 为真时，通过 HTTP(S) 获取，最多跟随 5 次重定向，应用 `config.timeout`，并发送 `User-Agent: @powerduck/openapi-cli`；否则读取本地文件。内容必须是包含 `paths` 对象的 JSON 对象。随后尽力解析内部 `$ref` 引用，解析失败时保留原规范。

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

去掉两侧空白后的 `specPath` 匹配 `/^https?:\/\//i` 时返回 `true`。

## DEFAULT_CONFIG

```ts
const DEFAULT_CONFIG = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## 断言引擎

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

针对响应上下文计算所有声明式断言。计算错误会记录为失败的 `AssertionResult`。

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

从路径项和操作中收集 `x-tests` 数组，路径项在前、操作在后；只保留同时包含 `name` 和 `assert` 的对象。

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

如果存在，返回 `operation["x-postman-scripts"].test` 处的字符串。

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

精简解析器，支持前导 `$.` 或 `$`、点号路径和数字数组下标，例如 `$.data.items[0].id`。路径片段不存在时返回 `undefined`。

### DeclarativeAssertion

```ts
interface DeclarativeAssertion {
  name: string;
  assert: "status" | "header" | "bodyContains" | "jsonPath" | "responseTime" | "bodyEquals";
  value?: number;     // assert=status
  key?: string;       // assert=header
  contains?: string;  // assert=header / bodyContains
  path?: string;      // assert=jsonPath
  equals?: unknown;   // assert=jsonPath
  exists?: boolean;   // assert=jsonPath
  max?: number;       // assert=responseTime
  body?: string;      // assert=bodyEquals
}
```

## 报告生成器

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

报告可能包含请求头、请求体、变量和鉴权配置；分享或持久化前应移除敏感值。

递归创建 `outputDir`，按 `JSON.stringify(report, null, 2)` 写入 `report.json`，并返回绝对文件路径。

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

生成带 ANSI 颜色转义的 CLI 报告字符串，包括标题、概要栏、进度条、各结果行和断言详情，但不打印。

### printCliReport

```ts
printCliReport(report: TestReport): string
```

调用 `generateCliReport`，通过 `console.log` 打印结果并返回该字符串。

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

创建 `outputDir`，写入独立的 `report.html`，包含概要栏、进度条、筛选按钮、可展开行和明暗模式，返回文件路径。

## 结果类型

### TestResult

```ts
interface TestResult {
  operationId: string;
  path: string;
  method: string;
  protocol: ProtocolName | string;
  status: TestStatus;
  durationMs: number;
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: unknown;
    target?: string;
  };
  response?: {
    status?: number;
    statusText?: string;
    contentType?: string;
    sizeBytes?: number;
    body?: unknown;
    text?: string;
    headers?: Record<string, string>;
    events?: unknown[];
    streaming?: boolean;
  };
  assertions?: AssertionResult[];
  error?: string;
  timestamp: string;
}
```

### TestSummary

```ts
interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  durationMs: number;
  passRate: number; // rounded to one decimal
}
```

### AssertionResult

```ts
interface AssertionResult {
  name: string;
  passed: boolean;
  error?: string;
}
```

## 场景运行器

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

每次场景迭代按顺序运行步骤，并共享变量作用域。执行前解析所有操作引用，且忽略批量筛选条件，因此可以引用规范中的任意操作。变量从配置和场景初始值开始，提取出的值供后续步骤使用。`stopOnFailure` 默认为 `true`。`options.signal` 可取消运行，其余步骤记为跳过；`onEvent` 监听器抛出的异常不会中断执行。

场景级 `data` 为每行数据使用全新的作用域运行整个步骤序列。`iterations` 可指定额外重复次数；实际次数取声明次数与数据行数的较大值，上限为 1000。步骤级 `request.data` 会重复该步骤，只有最后一次执行的提取值会保留到共享作用域。

### 场景类型

以下声明描述场景的输入和输出。为便于理解，这里也列出了辅助结构 `ScenarioDataRow` 和 `ScenarioIterations`；它们不是包根的具名导出，可通过公开接口获取其结构。

```ts
import type { RequestValues } from "@powerduck/openapi-request";

interface ScenarioExtract {
  name: string;
  from: "body" | "header" | "status";
  path?: string;
  key?: string;
}

type ScenarioDataRow = Record<string, string>;

interface ScenarioStepRequest {
  values?: RequestValues;
  serverUrl?: string;
  extract?: ScenarioExtract[];
  assertions?: DeclarativeAssertion[];
  data?: ScenarioDataRow[];
}

interface ScenarioStep {
  ref?: string;
  method?: string;
  path?: string;
  name?: string;
  request?: ScenarioStepRequest;
  skip?: boolean;
}

interface ScenarioDefinition {
  name: string;
  description?: string;
  steps: ScenarioStep[];
  variables?: Record<string, string>;
  stopOnFailure?: boolean;
  data?: ScenarioDataRow[];
  iterations?: number;
}

type ScenarioStatus = "passed" | "failed" | "error" | "cancelled";

interface ScenarioStepResult extends TestResult {
  index: number;
  ref: string;
  name?: string;
  scenarioIteration?: number;
  scenarioIterations?: number;
  stepIteration?: number;
  stepIterations?: number;
  extracted?: Record<string, string>;
  variablesAfter?: Record<string, string>;
  notRun?: boolean;
  notRunReason?: string;
}

type ScenarioEventType =
  | "scenario:start"
  | "step:start"
  | "step:finish"
  | "step:skip"
  | "scenario:finish"
  | "scenario:cancel";

interface ScenarioEvent {
  type: ScenarioEventType;
  scenario: string;
  stepIndex?: number;
  step?: ScenarioStepResult;
  status?: ScenarioStatus;
  message?: string;
  scenarioIteration?: number;
  scenarioIterations?: number;
  stepIteration?: number;
  stepIterations?: number;
}

interface ScenarioIterations {
  scenarioCount: number;
  stepCounts: number[];
}

interface ScenarioReport {
  name: string;
  description?: string;
  status: ScenarioStatus;
  summary: TestSummary;
  steps: ScenarioStepResult[];
  variables: Record<string, string>;
  iterations?: ScenarioIterations;
  config: CliConfig;
  startedAt: string;
  durationMs: number;
  generatedAt: string;
  version: string;
}

interface RunScenarioOptions {
  config: CliConfig;
  spec?: unknown;
  onEvent?: (event: ScenarioEvent) => void;
  signal?: AbortSignal;
}
```

### stepRef 和 resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` 优先采用显式 `method` 和 `path`，否则规范化 `ref`，并保留单独的 operationId。`resolveSteps` 返回包含 `step`、`op` 和规范化 `ref` 的条目；任意引用不存在时都会抛出异常，包括被标记为跳过的步骤。

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

通过 JSONPath 读取响应体值，以不区分大小写的方式读取响应头，或读取响应状态。缺失值与 null 被忽略；其他值转为字符串，对象则序列化为 JSON。

## 运行器辅助函数

辅助函数签名中包含未从包根具名导出的类型。应从公开函数推导这些类型，而不是导入内部文件：

```ts
import { collectOperations, executeStep, resolveSteps } from "@powerduck/openapi-cli";

type OperationInfo = ReturnType<typeof collectOperations>[number];
type StepExecutionOptions = Parameters<typeof executeStep>[2];
type StepExecution = Awaited<ReturnType<typeof executeStep>>;
type ResolvedStep = ReturnType<typeof resolveSteps>[number];
```

### collectOperations

```ts
collectOperations(spec: any, config: CliConfig): OperationInfo[]
```

收集标准操作和附加操作，补齐缺失的 operationId，推断协议，并应用 `config.filter`。每项包含 `path`、`method`、`operation`、`pathItem`、`operationId` 和 `protocol`。

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` 来自 `@powerduck/openapi-request` 的 `createClient`。选项必须包含 `config` 与 `spec`，可选项为 `signal`、`variables`、`values`、`serverUrl` 和 `extraAssertions`。返回值包含 `result`、规范化的 `response`、可选的 `request`，以及脚本生成的变量作用域 `env`。批量和场景运行器共用这条执行路径。

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

统计通过、失败、错误和跳过的结果。通过率为通过数除以总数，四舍五入到一位小数；空结果集的通过率为零。

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

从字符串、Error、`message` 或 `msg` 字段提取可读信息，之后回退到序列化。假值输入返回 `undefined`。

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

生成[隐式断言](#implicit-assertions)一节列出的检查。未知协议不生成隐式检查。

## 隐式断言 {#implicit-assertions}

当操作既未定义 `x-tests` 也未定义 Postman 脚本时，运行器会添加一个对应协议的隐式断言：

| 协议 | 隐式检查 |
|----------|----------------|
| `http`, `sse` | HTTP 状态码为 `2xx` |
| `graphql` | HTTP 状态码为 `2xx`，**且**没有非空的顶层 `errors` 数组 |
| `grpc` | gRPC 状态码为 `0`（OK） |
| `mcp` | JSON-RPC 响应包含 `result` 且没有 `error` |
| `websocket` | 连接达到 `open` 状态，且没有错误事件 |