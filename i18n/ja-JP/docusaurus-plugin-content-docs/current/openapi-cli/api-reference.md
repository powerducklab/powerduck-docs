---
sidebar_position: 4
title: "API リファレンス"
description: "@powerduck/openapi-cli のバッチランナー、シナリオランナー、設定、アサーション、レポート生成機能の API リファレンスです。以下のエクスポートはパッケージのルートから利用できます。"
---

# API リファレンス

`@powerduck/openapi-cli` のバッチランナー、シナリオランナー、設定、アサーション、レポート生成機能の API リファレンスです。以下のエクスポートはパッケージのルートから利用できます。

## エクスポート一覧

| エクスポート | 種別 | 説明 |
|--------|------|-------------|
| `runTests` | 関数 | 収集したすべての操作を実行し、`TestReport` を返します |
| `resolveConfig` | 関数 | 引数、設定ファイル、既定値から `CliConfig` を構築します |
| `loadSpec` | 非同期関数 | ローカルパスまたはリモート URL から仕様を読み込み、参照を解決します |
| `isRemoteSpec` | 関数 | 仕様のパスが `http(s)://` で始まるかを判定します |
| `DEFAULT_CONFIG` | 定数 | 組み込みの既定値 |
| `runDeclarativeAssertions` | 関数 | レスポンスに対して `DeclarativeAssertion` の配列を評価します |
| `extractAssertions` | 関数 | 操作から `x-tests` の宣言的アサーションを取り出します |
| `extractPostmanScripts` | 関数 | 操作から Postman テストスクリプトの文字列を取り出します |
| `resolveJsonPath` | 関数 | 簡易 JSONPath リゾルバー（ドット記法と配列インデックスに対応） |
| `generateJsonReport` | 関数 | `report.json` をディスクに書き込み、ファイルパスを返します |
| `generateCliReport` | 関数 | 色付きの CLI レポート文字列を生成します（出力はしません） |
| `printCliReport` | 関数 | CLI レポートを標準出力に表示し、その文字列を返します |
| `generateHtmlReport` | 関数 | `report.html` をディスクに書き込み、ファイルパスを返します |
| `CliArgs` | 型 | CLI 引数と設定の解決に使用する入力の構造 |
| `DeclarativeAssertion` | 型 | 1 件の宣言的アサーションのオブジェクト |
| `CliConfig` | 型 | 中心となる設定インターフェース |
| `TestReport` | 型 | `runTests` が返す完全なレポート |
| `TestResult` | 型 | 1 操作のテスト結果 |
| `TestSummary` | 型 | 成功・失敗の集計 |
| `AssertionResult` | 型 | 1 件のアサーションの結果 |
| `ReportFormat` | 型 | `"json" \| "cli" \| "html"` |
| `ProtocolName` | 型 | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | 型 | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | 型 | 認証設定 |
| `TlsConfig` | 型 | TLS・証明書の設定 |
| `FilterConfig` | 型 | 操作フィルター |
| `collectOperations` | 関数 | バッチフィルターを適用して操作を収集します |
| `executeStep` | 非同期関数 | ステップごとの設定を適用して 1 操作を実行します |
| `buildSummary` | 関数 | テスト結果から件数と成功率を計算します |
| `formatAssertionError` | 関数 | アサーションエラーを読みやすい文字列に変換します |
| `buildImplicitAssertions` | 関数 | プロトコル別の既定のアサーションを生成します |
| `runScenario` | 非同期関数 | 共有変数とデータ駆動の反復を使って、ステップを順番に実行します |
| `resolveSteps` | 関数 | リクエスト送信前にシナリオ内のすべての参照を解決します |
| `applyExtracts` | 関数 | レスポンスの値を文字列変数に抽出します |
| `stepRef` | 関数 | ステップの参照を正規化します |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | 型 | シナリオの入力と抽出の定義 |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | 型 | シナリオの結果、リアルタイムイベント、実行オプション |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

`loadSpec` で仕様を読み込み、`config.filter` に従って操作を収集し、同時実行数を制限して実行します（`min(config.concurrency ?? 5, queue.length)`）。宣言的アサーションと Postman アサーションを実行し、ユーザー定義のアサーションがない場合はプロトコルに応じた暗黙のアサーションを追加します。結果をパス、メソッドの順に並べ替え、`TestReport` を返します。

返される `TestReport` の構造は次のとおりです。

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

`args`（CLI オプション）、任意の JSON 設定ファイル（`args.config`）、`DEFAULT_CONFIG` を統合します。解決後の `envFile` があれば読み込み、`serverUrl`、`proxy`、ヘッダーの値、`auth.token`、変数の値に含まれる `${ENV_VAR}` 参照を展開します。仕様が指定されていない場合は `"No OpenAPI spec path provided..."`、`proxy` を解析できない場合は `Invalid proxy URL: <url>` をスローします。

`CliArgs` は CLI オプションに対応します。

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

`config.specPath` を読み取ります。`isRemoteSpec` が真なら HTTP(S) で取得し、最大 5 回のリダイレクトに追従して `config.timeout` を適用し、`User-Agent: @powerduck/openapi-cli` を送信します。それ以外はローカルファイルを読み込みます。内容は JSON として解析され、`paths` オブジェクトを持つオブジェクトである必要があります。その後、内部の `$ref` の解決を試みます。失敗した場合、仕様は変更されません。

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

前後の空白を除いた `specPath` が `/^https?:\/\//i` に一致すると `true` を返します。

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

## アサーションエンジン

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

レスポンスのコンテキストに対して各宣言的アサーションを評価します。評価中のエラーは失敗した `AssertionResult` として記録されます。

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

パス項目、操作の順で両方の `x-tests` 配列を収集し、`name` と `assert` の両方を持つオブジェクトだけを残します。

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

`operation["x-postman-scripts"].test` があれば、その文字列を返します。

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

先頭の `$.` または `$`、ドット記法、数値の配列インデックス（例：`$.data.items[0].id`）に対応する簡易リゾルバーです。途中の要素が存在しない場合は `undefined` を返します。

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

## レポート生成

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

レポートにはリクエストヘッダー、本文、変数、認証設定が含まれる場合があります。共有または保存する前に機密値を取り除いてください。

`outputDir` を再帰的に作成し、`JSON.stringify(report, null, 2)` を使って `report.json` を書き込みます。絶対パスを返します。

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

ANSI エスケープシーケンスを使った色付きの CLI レポート文字列を生成します。ヘッダー、集計、進捗バー、結果ごとの行、アサーションの詳細を含みますが、出力はしません。

### printCliReport

```ts
printCliReport(report: TestReport): string
```

`generateCliReport` を呼び出し、結果を `console.log` で出力して、その文字列を返します。

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

`outputDir` を作成し、集計、進捗バー、フィルターボタン、展開可能な行、ライト・ダークモードを備えた単体で表示できる `report.html` を書き込みます。ファイルパスを返します。

## 結果の型

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

## シナリオランナー

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

シナリオの反復ごとに共有変数スコープを使い、ステップを順番に実行します。実行前にすべての操作参照を解決し、バッチフィルターは無視するため、仕様内の任意の操作を対象にできます。変数は設定とシナリオの値で初期化され、抽出した値は後続のステップで利用できます。`stopOnFailure` の既定値は `true` です。`options.signal` で実行をキャンセルすると、残りのステップはスキップとして記録されます。`onEvent` リスナーの例外は実行を中断しません。

シナリオの `data` は、行ごとに新しいスコープでシーケンス全体を実行します。`iterations` で追加の反復を指定できます。実際の反復数は指定回数と行数の大きい方で、上限は 1000 です。ステップの `request.data` はそのステップを繰り返し実行し、最後の実行で抽出した値だけが共有スコープに残ります。

### シナリオの型

以下の宣言はシナリオの入力と出力を示します。`ScenarioDataRow` と `ScenarioIterations` は説明のために掲載した補助的な構造で、パッケージルートの名前付きエクスポートではありません。これらの構造は公開インターフェースを通じて参照できます。

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

### stepRef と resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` は明示的な `method` と `path` を優先し、それ以外では単独の operationId を保持したまま `ref` を正規化します。`resolveSteps` は `step`、`op`、正規化した `ref` を含む項目を返します。スキップ対象のステップも含め、参照が 1 つでも見つからなければ例外をスローします。

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

JSONPath で本文の値を、大文字小文字を区別せずにヘッダーを、またはレスポンスステータスを読み取ります。存在しない値と null は除外し、それ以外は文字列に変換します。オブジェクトは JSON にシリアライズします。

## ランナーの補助関数

補助関数のシグネチャには、ルートから名前付きでエクスポートされない型が含まれます。内部ファイルをインポートせず、公開関数から型を推論してください。

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

標準および追加の操作を収集し、必要に応じて代替の operationId を割り当て、プロトコルを推定して `config.filter` を適用します。各項目には `path`、`method`、`operation`、`pathItem`、`operationId`、`protocol` が含まれます。

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` は `@powerduck/openapi-request` の `createClient` で作成します。オプションでは `config` と `spec` が必須で、`signal`、`variables`、`values`、`serverUrl`、`extraAssertions` は任意です。戻り値には `result`、正規化した `response`、任意の `request`、スクリプトが生成した変数スコープ `env` が含まれます。バッチランナーとシナリオランナーはこの実行処理を共有します。

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

成功、失敗、エラー、スキップの件数を集計します。成功率は成功件数を総件数で割り、小数点以下 1 桁に丸めた値です。結果が空の場合は 0 になります。

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

文字列、Error、`message` または `msg` フィールドから読みやすいメッセージを取得し、いずれも使えない場合はシリアライズします。偽と評価される入力には `undefined` を返します。

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

[暗黙のアサーション](#implicit-assertions)に記載したチェックを生成します。不明なプロトコルには暗黙のチェックを生成しません。

## 暗黙のアサーション {#implicit-assertions}

操作に `x-tests` も Postman スクリプトも定義されていない場合、ランナーはプロトコルに応じた暗黙のアサーションを 1 件追加します。

| プロトコル | 暗黙のチェック |
|----------|----------------|
| `http`, `sse` | HTTP ステータスが `2xx` |
| `graphql` | HTTP ステータスが `2xx` **かつ**トップレベルに空でない `errors` 配列がない |
| `grpc` | gRPC ステータスコードが `0`（OK） |
| `mcp` | JSON-RPC レスポンスに `result` があり、`error` がない |
| `websocket` | エラーイベントなしで接続が `open` に到達した |