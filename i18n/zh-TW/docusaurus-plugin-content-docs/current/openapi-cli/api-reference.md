---
sidebar_position: 4
title: "API 參考"
description: "@powerduck/openapi-cli 的批次執行器、情境執行器、設定、斷言與報告產生器參考。下列匯出皆可從套件根路徑使用。"
---

# API 參考

`@powerduck/openapi-cli` 的批次執行器、情境執行器、設定、斷言與報告產生器參考。下列匯出皆可從套件根路徑使用。

## 匯出概覽

| 匯出 | 類別 | 說明 |
|--------|------|-------------|
| `runTests` | 函式 | 執行收集到的所有操作並傳回 `TestReport` |
| `resolveConfig` | 函式 | 依引數、設定檔與預設值解析 `CliConfig` |
| `loadSpec` | 非同步函式 | 從本機路徑或遠端 URL 載入規範並解析參照 |
| `isRemoteSpec` | 函式 | 判斷規範路徑是否以 `http(s)://` 開頭 |
| `DEFAULT_CONFIG` | 常數 | 內建預設值 |
| `runDeclarativeAssertions` | 函式 | 針對回應計算 `DeclarativeAssertion` 陣列 |
| `extractAssertions` | 函式 | 從操作擷取 `x-tests` 宣告式斷言 |
| `extractPostmanScripts` | 函式 | 從操作擷取 Postman 測試指令碼字串 |
| `resolveJsonPath` | 函式 | 精簡 JSONPath 解析器，支援點號與陣列索引 |
| `generateJsonReport` | 函式 | 將 `report.json` 寫入磁碟並傳回檔案路徑 |
| `generateCliReport` | 函式 | 產生彩色 CLI 報告字串，不列印 |
| `printCliReport` | 函式 | 將 CLI 報告列印至標準輸出並傳回字串 |
| `generateHtmlReport` | 函式 | 將 `report.html` 寫入磁碟並傳回檔案路徑 |
| `CliArgs` | 型別 | CLI 與設定解析的輸入結構 |
| `DeclarativeAssertion` | 型別 | 單一宣告式斷言物件 |
| `CliConfig` | 型別 | 核心設定介面 |
| `TestReport` | 型別 | `runTests` 傳回的完整報告 |
| `TestResult` | 型別 | 單一操作的測試結果 |
| `TestSummary` | 型別 | 彙整通過與失敗數量 |
| `AssertionResult` | 型別 | 單一斷言的結果 |
| `ReportFormat` | 型別 | `"json" \| "cli" \| "html"` |
| `ProtocolName` | 型別 | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | 型別 | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | 型別 | 驗證設定 |
| `TlsConfig` | 型別 | TLS 與憑證設定 |
| `FilterConfig` | 型別 | 操作篩選器 |
| `collectOperations` | 函式 | 套用批次篩選條件並收集操作 |
| `executeStep` | 非同步函式 | 執行單一操作，支援步驟層級覆寫 |
| `buildSummary` | 函式 | 依測試結果計算數量與通過率 |
| `formatAssertionError` | 函式 | 將斷言錯誤轉為可讀文字 |
| `buildImplicitAssertions` | 函式 | 產生通訊協定對應的預設斷言 |
| `runScenario` | 非同步函式 | 依序執行步驟，支援共用變數與資料驅動的迭代 |
| `resolveSteps` | 函式 | 傳送請求前解析所有情境參照 |
| `applyExtracts` | 函式 | 將回應值擷取為字串變數 |
| `stepRef` | 函式 | 正規化步驟參照 |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | 型別 | 情境輸入與擷取規則定義 |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | 型別 | 情境結果、即時事件與執行選項 |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

使用 `loadSpec` 載入規範，依 `config.filter` 收集操作，以有限並行數 `min(config.concurrency ?? 5, queue.length)` 執行，並執行宣告式與 Postman 斷言；未定義使用者斷言時，加入通訊協定對應的隱含斷言。結果依路徑與方法排序，以 `TestReport` 傳回。

傳回的 `TestReport` 結構如下：

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

合併 `args`（CLI 引數）、選用的 JSON 設定檔 `args.config` 與 `DEFAULT_CONFIG`。若解析後的 `envFile` 存在，就載入它，並展開 `serverUrl`、`proxy`、標頭值、`auth.token` 與變數值中的 `${ENV_VAR}`。未提供規範時擲回 `"No OpenAPI spec path provided..."`；`proxy` 無法解析時擲回 `Invalid proxy URL: <url>`。

`CliArgs` 對應 CLI 選項：

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

讀取 `config.specPath`。若 `isRemoteSpec` 為真，透過 HTTP(S) 取得，最多跟隨 5 次重新導向，套用 `config.timeout`，並傳送 `User-Agent: @powerduck/openapi-cli`；否則讀取本機檔案。內容必須是包含 `paths` 物件的 JSON 物件。之後盡可能解析內部 `$ref` 參照，失敗時保留原規範。

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

去除前後空白的 `specPath` 符合 `/^https?:\/\//i` 時傳回 `true`。

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

## 斷言引擎

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

針對回應內容計算所有宣告式斷言。計算錯誤會記錄為失敗的 `AssertionResult`。

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

從路徑項目與操作收集 `x-tests` 陣列，路徑項目在前、操作在後；只保留同時包含 `name` 與 `assert` 的物件。

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

若存在，傳回 `operation["x-postman-scripts"].test` 的字串。

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

精簡解析器，支援前導 `$.` 或 `$`、點號路徑與數字陣列索引，例如 `$.data.items[0].id`。路徑區段不存在時傳回 `undefined`。

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

## 報告產生器

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

報告可能包含請求標頭、本文、變數與驗證設定；分享或永久儲存前，應移除敏感值。

遞迴建立 `outputDir`，以 `JSON.stringify(report, null, 2)` 寫入 `report.json`，並傳回絕對檔案路徑。

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

產生含 ANSI 色彩逸出碼的 CLI 報告字串，包括標題、摘要列、進度列、各結果列與斷言詳細資訊，但不列印。

### printCliReport

```ts
printCliReport(report: TestReport): string
```

呼叫 `generateCliReport`，使用 `console.log` 列印結果並傳回該字串。

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

建立 `outputDir`，寫入獨立的 `report.html`，包含摘要列、進度列、篩選按鈕、可展開列及明暗模式，並傳回檔案路徑。

## 結果型別

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

## 情境執行器

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

每次情境迭代依序執行步驟，並共用變數範圍。執行前解析所有操作參照，且忽略批次篩選條件，因此可指定規範中的任意操作。變數從設定與情境初始值開始，擷取的值可供後續步驟使用。`stopOnFailure` 預設為 `true`。`options.signal` 可取消執行，其餘步驟標記為略過；`onEvent` 監聽器擲回的例外狀況不會中止執行。

情境層級 `data` 為每列資料使用全新的變數範圍執行整個步驟序列。`iterations` 可指定額外重複次數；實際次數取宣告次數與資料列數的較大值，上限為 1000。步驟層級 `request.data` 會重複該步驟，僅最後一次執行擷取的值會保留至共用範圍。

### 情境型別

以下宣告描述情境的輸入與輸出。為便於理解，也列出輔助結構 `ScenarioDataRow` 與 `ScenarioIterations`；它們不是套件根的具名匯出，可透過公開介面取得其結構。

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

### stepRef 與 resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` 優先採用明確的 `method` 與 `path`，否則正規化 `ref`，並保留單獨的 operationId。`resolveSteps` 傳回包含 `step`、`op` 與正規化 `ref` 的項目；任一參照不存在時會擲回例外狀況，包括標記為略過的步驟。

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

透過 JSONPath 讀取回應本文值，以不區分大小寫的方式讀取標頭，或讀取回應狀態。缺少的值與 null 會略過；其他值轉為字串，物件則序列化為 JSON。

## 執行器輔助函式

輔助函式簽章包含未從套件根具名匯出的型別。請從公開函式推導型別，而非匯入內部檔案：

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

收集標準與附加操作，補上缺少的 operationId，推斷通訊協定，並套用 `config.filter`。每個項目包含 `path`、`method`、`operation`、`pathItem`、`operationId` 與 `protocol`。

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` 來自 `@powerduck/openapi-request` 的 `createClient`。選項必須包含 `config` 與 `spec`，可選項為 `signal`、`variables`、`values`、`serverUrl` 與 `extraAssertions`。結果包含 `result`、正規化的 `response`、選用的 `request`，以及指令碼產生的變數範圍 `env`。批次與情境執行器共用此執行流程。

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

統計通過、失敗、錯誤與略過的結果。通過率為通過數除以總數，四捨五入至一位小數；空結果集的通過率為零。

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

從字串、Error、`message` 或 `msg` 欄位取得可讀資訊，最後改用序列化。假值輸入傳回 `undefined`。

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

產生[隱含斷言](#implicit-assertions)列出的檢查。未知通訊協定不產生隱含檢查。

## 隱含斷言 {#implicit-assertions}

操作未定義 `x-tests` 或 Postman 指令碼時，執行器會加入一項通訊協定專屬的隱含斷言：

| 通訊協定 | 隱含檢查 |
|----------|----------------|
| `http`, `sse` | HTTP 狀態碼為 `2xx` |
| `graphql` | HTTP 狀態碼為 `2xx`，**且**沒有非空的頂層 `errors` 陣列 |
| `grpc` | gRPC 狀態碼為 `0`（OK） |
| `mcp` | JSON-RPC 回應包含 `result` 且沒有 `error` |
| `websocket` | 連線達到 `open` 狀態，且沒有錯誤事件 |