---
sidebar_position: 4
title: "API 레퍼런스"
description: "@powerduck/openapi-cli의 배치 실행기, 시나리오 실행기, 설정, 검증 및 보고서 생성 API입니다. 아래 항목은 패키지 루트에서 가져올 수 있습니다."
---

# API 레퍼런스

`@powerduck/openapi-cli`의 배치 실행기, 시나리오 실행기, 설정, 검증 및 보고서 생성 API입니다. 아래 항목은 패키지 루트에서 가져올 수 있습니다.

## 내보내기 목록

| 내보내기 항목 | 종류 | 설명 |
|--------|------|-------------|
| `runTests` | 함수 | 수집한 모든 작업을 실행하고 `TestReport`를 반환합니다 |
| `resolveConfig` | 함수 | 인수, 설정 파일, 기본값으로 `CliConfig`를 구성합니다 |
| `loadSpec` | 비동기 함수 | 로컬 경로나 원격 URL에서 명세를 읽고 참조를 해석합니다 |
| `isRemoteSpec` | 함수 | 명세 경로가 `http(s)://`로 시작하는지 확인합니다 |
| `DEFAULT_CONFIG` | 상수 | 내장 기본값 |
| `runDeclarativeAssertions` | 함수 | 응답을 대상으로 `DeclarativeAssertion` 배열을 평가합니다 |
| `extractAssertions` | 함수 | 작업에서 `x-tests` 선언적 검증을 추출합니다 |
| `extractPostmanScripts` | 함수 | 작업에서 Postman 테스트 스크립트 문자열을 추출합니다 |
| `resolveJsonPath` | 함수 | 기본 JSONPath 해석기(점 표기법과 배열 인덱스 지원) |
| `generateJsonReport` | 함수 | `report.json`을 디스크에 쓰고 파일 경로를 반환합니다 |
| `generateCliReport` | 함수 | 색상이 적용된 CLI 보고서 문자열을 생성하며 출력하지는 않습니다 |
| `printCliReport` | 함수 | CLI 보고서를 표준 출력에 표시하고 문자열을 반환합니다 |
| `generateHtmlReport` | 함수 | `report.html`을 디스크에 쓰고 파일 경로를 반환합니다 |
| `CliArgs` | 타입 | CLI 인수와 설정을 해석하는 입력 구조 |
| `DeclarativeAssertion` | 타입 | 선언적 검증 한 개의 객체 |
| `CliConfig` | 타입 | 핵심 설정 인터페이스 |
| `TestReport` | 타입 | `runTests`가 반환하는 전체 보고서 |
| `TestResult` | 타입 | 작업 한 개의 테스트 결과 |
| `TestSummary` | 타입 | 성공 및 실패 집계 |
| `AssertionResult` | 타입 | 검증 한 개의 결과 |
| `ReportFormat` | 타입 | `"json" \| "cli" \| "html"` |
| `ProtocolName` | 타입 | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | 타입 | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | 타입 | 인증 설정 |
| `TlsConfig` | 타입 | TLS 및 인증서 설정 |
| `FilterConfig` | 타입 | 작업 필터 |
| `collectOperations` | 함수 | 배치 필터를 적용하여 작업을 수집합니다 |
| `executeStep` | 비동기 함수 | 단계별 설정을 적용하여 작업 한 개를 실행합니다 |
| `buildSummary` | 함수 | 테스트 결과에서 건수와 성공률을 계산합니다 |
| `formatAssertionError` | 함수 | 검증 오류를 읽기 쉬운 문자열로 변환합니다 |
| `buildImplicitAssertions` | 함수 | 프로토콜별 기본 검증을 생성합니다 |
| `runScenario` | 비동기 함수 | 공유 변수와 데이터 기반 반복을 사용하여 단계를 순서대로 실행합니다 |
| `resolveSteps` | 함수 | 요청을 보내기 전에 시나리오의 모든 참조를 해석합니다 |
| `applyExtracts` | 함수 | 응답 값을 문자열 변수로 추출합니다 |
| `stepRef` | 함수 | 단계 참조를 정규화합니다 |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | 타입 | 시나리오 입력 및 추출 정의 |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | 타입 | 시나리오 결과, 실시간 이벤트, 실행 옵션 |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

`loadSpec`으로 명세를 읽고 `config.filter`에 따라 작업을 수집한 뒤, 동시 실행 수를 제한하여 실행합니다(`min(config.concurrency ?? 5, queue.length)`). 선언적 검증과 Postman 검증을 실행하고, 사용자 검증이 없으면 프로토콜별 암시적 검증을 추가합니다. 결과를 경로, 메서드 순으로 정렬한 다음 `TestReport`를 반환합니다.

반환되는 `TestReport`의 구조는 다음과 같습니다.

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

`args`(CLI 옵션), 선택적 JSON 설정 파일(`args.config`), `DEFAULT_CONFIG`를 병합합니다. 해석된 `envFile`이 있으면 읽고, `serverUrl`, `proxy`, 헤더 값, `auth.token`, 변수 값의 `${ENV_VAR}` 참조를 확장합니다. 명세가 없으면 `"No OpenAPI spec path provided..."`를, `proxy`를 해석할 수 없으면 `Invalid proxy URL: <url>`을 던집니다.

`CliArgs`는 CLI 옵션에 대응합니다.

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

`config.specPath`를 읽습니다. `isRemoteSpec`이 참이면 HTTP(S)로 가져오며 최대 5회의 리디렉션을 따르고, `config.timeout`을 적용하고, `User-Agent: @powerduck/openapi-cli`를 전송합니다. 그렇지 않으면 로컬 파일을 읽습니다. 내용은 JSON으로 파싱되며 `paths` 객체를 포함한 객체여야 합니다. 이후 내부 `$ref` 해석을 시도하며, 실패하면 명세를 변경하지 않습니다.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

앞뒤 공백을 제거한 `specPath`가 `/^https?:\/\//i`와 일치하면 `true`를 반환합니다.

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

## 검증 엔진

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

응답 컨텍스트에서 각 선언적 검증을 평가합니다. 평가 중 발생한 오류는 실패한 `AssertionResult`로 기록됩니다.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

경로 항목과 작업의 `x-tests` 배열을 순서대로 수집하고, `name`과 `assert`가 모두 있는 객체만 남깁니다.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

`operation["x-postman-scripts"].test`가 있으면 해당 문자열을 반환합니다.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

앞부분의 `$.` 또는 `$`, 점 표기법, 숫자 배열 인덱스(예: `$.data.items[0].id`)를 지원하는 기본 해석기입니다. 경로의 일부가 존재하지 않으면 `undefined`를 반환합니다.

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

## 보고서 생성기

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

보고서에는 요청 헤더, 본문, 변수, 인증 설정이 포함될 수 있습니다. 공유하거나 저장하기 전에 민감한 값을 제거하세요.

`outputDir`을 재귀적으로 만들고 `JSON.stringify(report, null, 2)`로 `report.json`을 씁니다. 절대 경로를 반환합니다.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

ANSI 이스케이프 시퀀스를 사용하여 색상이 적용된 CLI 보고서 문자열을 생성합니다. 헤더, 요약, 진행률 표시줄, 결과별 행, 검증 세부 정보를 포함하며 출력하지는 않습니다.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

`generateCliReport`를 호출하고 `console.log`로 결과를 출력한 뒤 문자열을 반환합니다.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

`outputDir`을 만들고 요약, 진행률 표시줄, 필터 버튼, 펼칠 수 있는 행, 밝은 모드와 어두운 모드를 포함한 독립형 `report.html`을 씁니다. 파일 경로를 반환합니다.

## 결과 타입

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

## 시나리오 실행기

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

시나리오 반복마다 공유 변수 범위를 사용하여 단계를 순서대로 실행합니다. 실행 전에 모든 작업 참조를 해석하고 배치 필터를 무시하므로 명세의 어떤 작업이든 대상으로 지정할 수 있습니다. 변수는 설정과 시나리오의 값으로 초기화되며 추출한 값은 이후 단계에서 사용할 수 있습니다. `stopOnFailure`의 기본값은 `true`입니다. `options.signal`로 실행을 취소하면 남은 단계는 건너뛴 것으로 기록됩니다. `onEvent` 리스너의 예외는 실행을 중단하지 않습니다.

시나리오의 `data`는 행마다 새 변수 범위로 전체 순서를 실행합니다. `iterations`로 추가 반복을 요청할 수 있으며 실제 횟수는 선언한 횟수와 행 수 중 큰 값이고 최대 1000입니다. 단계의 `request.data`는 해당 단계를 반복하며 마지막 실행에서 추출한 값만 공유 범위에 남습니다.

### 시나리오 타입

아래 선언은 시나리오의 입력과 출력을 설명합니다. `ScenarioDataRow`와 `ScenarioIterations`는 이해를 돕기 위한 보조 구조이며 패키지 루트의 이름 있는 내보내기 항목이 아닙니다. 해당 구조는 공개 인터페이스를 통해 참조할 수 있습니다.

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

### stepRef와 resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef`는 명시적인 `method`와 `path`를 우선하며, 그렇지 않으면 접두사 없는 operationId를 유지하면서 `ref`를 정규화합니다. `resolveSteps`는 `step`, `op`, 정규화된 `ref`가 포함된 항목을 반환합니다. 건너뛰는 단계라도 참조를 찾지 못하면 예외를 던집니다.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

JSONPath로 본문 값을 읽거나, 대소문자를 구분하지 않고 헤더를 읽거나, 응답 상태를 읽습니다. 누락된 값과 null은 제외하고 나머지는 문자열로 변환하며 객체는 JSON으로 직렬화합니다.

## 실행기 보조 함수

보조 함수 시그니처에는 루트에서 이름으로 내보내지 않는 타입이 사용됩니다. 내부 파일을 가져오는 대신 공개 함수에서 타입을 추론하세요.

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

표준 작업과 추가 작업을 수집하고 필요하면 대체 operationId를 지정하며, 프로토콜을 추론하고 `config.filter`를 적용합니다. 각 항목에는 `path`, `method`, `operation`, `pathItem`, `operationId`, `protocol`이 포함됩니다.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client`는 `@powerduck/openapi-request`의 `createClient`로 만듭니다. 옵션에서 `config`와 `spec`은 필수이며 `signal`, `variables`, `values`, `serverUrl`, `extraAssertions`는 선택 사항입니다. 반환값에는 `result`, 정규화된 `response`, 선택적 `request`, 스크립트가 생성한 변수 범위 `env`가 포함됩니다. 배치 실행기와 시나리오 실행기는 이 실행 경로를 공유합니다.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

성공, 실패, 오류, 건너뛴 결과의 수를 집계합니다. 성공률은 성공 건수를 전체 건수로 나눈 값을 소수점 한 자리로 반올림한 값이며, 결과가 없으면 0입니다.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

문자열, Error, `message` 또는 `msg` 필드에서 읽기 쉬운 메시지를 가져오며, 사용할 수 없으면 직렬화합니다. 불리언 문맥에서 거짓인 입력에는 `undefined`를 반환합니다.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

[암시적 검증](#implicit-assertions)에 나열된 검사를 생성합니다. 알 수 없는 프로토콜에는 암시적 검사를 생성하지 않습니다.

## 암시적 검증 {#implicit-assertions}

작업에 `x-tests`도 Postman 스크립트도 정의되어 있지 않으면 실행기는 프로토콜별 암시적 검증을 하나 추가합니다.

| 프로토콜 | 암시적 검사 |
|----------|----------------|
| `http`, `sse` | HTTP 상태가 `2xx` |
| `graphql` | HTTP 상태가 `2xx`**이고** 최상위에 비어 있지 않은 `errors` 배열이 없음 |
| `grpc` | gRPC 상태 코드가 `0`(OK) |
| `mcp` | JSON-RPC 응답에 `result`가 있고 `error`가 없음 |
| `websocket` | 오류 이벤트 없이 연결이 `open` 상태에 도달함 |