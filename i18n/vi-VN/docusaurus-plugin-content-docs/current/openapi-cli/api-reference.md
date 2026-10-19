---
sidebar_position: 4
title: "Tham chiếu API"
description: "Tham chiếu API cho trình chạy hàng loạt, trình chạy kịch bản, cấu hình, kiểm định và trình tạo báo cáo trong @powerduck/openapi-cli. Các mục xuất dưới đây có thể được nhập từ gốc gói."
---

# Tham chiếu API

Tham chiếu API cho trình chạy hàng loạt, trình chạy kịch bản, cấu hình, kiểm định và trình tạo báo cáo trong `@powerduck/openapi-cli`. Các mục xuất dưới đây có thể được nhập từ gốc gói.

## Tổng quan các mục xuất

| Mục xuất | Loại | Mô tả |
|--------|------|-------------|
| `runTests` | hàm | Chạy tất cả thao tác đã thu thập và trả về `TestReport` |
| `resolveConfig` | hàm | Tạo `CliConfig` từ đối số, tệp cấu hình và giá trị mặc định |
| `loadSpec` | hàm bất đồng bộ | Tải đặc tả từ đường dẫn cục bộ hoặc URL từ xa và phân giải tham chiếu |
| `isRemoteSpec` | hàm | Kiểm tra đường dẫn đặc tả có bắt đầu bằng `http(s)://` hay không |
| `DEFAULT_CONFIG` | hằng số | Các giá trị mặc định tích hợp |
| `runDeclarativeAssertions` | hàm | Đánh giá mảng `DeclarativeAssertion` dựa trên phản hồi |
| `extractAssertions` | hàm | Lấy các kiểm định khai báo `x-tests` từ thao tác |
| `extractPostmanScripts` | hàm | Lấy chuỗi mã kiểm thử Postman từ thao tác |
| `resolveJsonPath` | hàm | Bộ phân giải JSONPath cơ bản (ký pháp dấu chấm và chỉ mục mảng) |
| `generateJsonReport` | hàm | Ghi `report.json` ra đĩa và trả về đường dẫn tệp |
| `generateCliReport` | hàm | Tạo chuỗi báo cáo CLI có màu mà không in ra |
| `printCliReport` | hàm | In báo cáo CLI ra đầu ra chuẩn và trả về chuỗi |
| `generateHtmlReport` | hàm | Ghi `report.html` ra đĩa và trả về đường dẫn tệp |
| `CliArgs` | kiểu | Cấu trúc đầu vào để phân giải đối số CLI và cấu hình |
| `DeclarativeAssertion` | kiểu | Đối tượng của một kiểm định khai báo |
| `CliConfig` | kiểu | Giao diện cấu hình chính |
| `TestReport` | kiểu | Báo cáo đầy đủ do `runTests` trả về |
| `TestResult` | kiểu | Kết quả kiểm thử một thao tác |
| `TestSummary` | kiểu | Tổng số kiểm thử đạt và không đạt |
| `AssertionResult` | kiểu | Kết quả một kiểm định |
| `ReportFormat` | kiểu | `"json" \| "cli" \| "html"` |
| `ProtocolName` | kiểu | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | kiểu | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | kiểu | Cấu hình xác thực |
| `TlsConfig` | kiểu | Cấu hình TLS và chứng chỉ |
| `FilterConfig` | kiểu | Bộ lọc thao tác |
| `collectOperations` | hàm | Thu thập thao tác sau khi áp dụng bộ lọc chạy hàng loạt |
| `executeStep` | hàm bất đồng bộ | Chạy một thao tác với các giá trị ghi đè theo bước |
| `buildSummary` | hàm | Tính số lượng và tỷ lệ đạt từ kết quả kiểm thử |
| `formatAssertionError` | hàm | Chuyển lỗi kiểm định thành văn bản dễ đọc |
| `buildImplicitAssertions` | hàm | Tạo các kiểm định mặc định theo giao thức |
| `runScenario` | hàm bất đồng bộ | Chạy các bước theo thứ tự với biến dùng chung và vòng lặp dựa trên dữ liệu |
| `resolveSteps` | hàm | Phân giải mọi tham chiếu trong kịch bản trước khi gửi yêu cầu |
| `applyExtracts` | hàm | Trích xuất giá trị phản hồi vào biến chuỗi |
| `stepRef` | hàm | Chuẩn hóa tham chiếu bước |
| `ScenarioDefinition`, `ScenarioStep`, `ScenarioStepRequest`, `ScenarioExtract` | kiểu | Định nghĩa đầu vào và trích xuất của kịch bản |
| `ScenarioStatus`, `ScenarioStepResult`, `ScenarioEvent`, `ScenarioEventType`, `ScenarioReport`, `RunScenarioOptions` | kiểu | Kết quả, sự kiện trực tiếp và tùy chọn chạy kịch bản |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Tải đặc tả bằng `loadSpec`, thu thập thao tác theo `config.filter` và chạy với mức đồng thời giới hạn (`min(config.concurrency ?? 5, queue.length)`). Chạy các kiểm định khai báo và Postman, thêm kiểm định ngầm định theo giao thức khi không có kiểm định của người dùng, sắp xếp kết quả theo đường dẫn rồi phương thức và trả về `TestReport`.

`TestReport` trả về có cấu trúc sau:

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

Hợp nhất `args` (tùy chọn CLI), tệp cấu hình JSON tùy chọn (`args.config`) và `DEFAULT_CONFIG`. Tải `envFile` đã phân giải nếu có, rồi thay thế các tham chiếu `${ENV_VAR}` trong `serverUrl`, `proxy`, giá trị tiêu đề, `auth.token` và giá trị biến. Ném `"No OpenAPI spec path provided..."` nếu không có đặc tả và `Invalid proxy URL: <url>` nếu không phân tích được `proxy`.

`CliArgs` tương ứng với các tùy chọn CLI:

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

Đọc `config.specPath`. Nếu `isRemoteSpec` là đúng, tải qua HTTP(S), theo tối đa 5 lần chuyển hướng, áp dụng `config.timeout` và gửi `User-Agent: @powerduck/openapi-cli`; nếu không thì đọc tệp cục bộ. Nội dung được phân tích dưới dạng JSON và phải là đối tượng chứa đối tượng `paths`. Sau đó hàm cố gắng phân giải các `$ref` nội bộ; nếu thất bại, đặc tả được giữ nguyên.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Trả về `true` khi `specPath`, sau khi bỏ khoảng trắng đầu và cuối, khớp với `/^https?:\/\//i`.

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

## Bộ máy kiểm định

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Đánh giá từng kiểm định khai báo trong ngữ cảnh phản hồi. Lỗi khi đánh giá được ghi thành `AssertionResult` không đạt.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Thu thập các mảng `x-tests` từ mục đường dẫn rồi đến thao tác, chỉ giữ các đối tượng có cả `name` và `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Trả về chuỗi tại `operation["x-postman-scripts"].test` nếu có.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Bộ phân giải cơ bản hỗ trợ tiền tố `$.` hoặc `$`, ký pháp dấu chấm và chỉ mục mảng bằng số, chẳng hạn `$.data.items[0].id`. Trả về `undefined` nếu một thành phần không tồn tại.

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

## Trình tạo báo cáo

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Báo cáo có thể chứa tiêu đề, nội dung yêu cầu, biến và cấu hình xác thực; hãy xóa giá trị nhạy cảm trước khi chia sẻ hoặc lưu.

Tạo `outputDir` đệ quy và ghi `report.json` bằng `JSON.stringify(report, null, 2)`. Trả về đường dẫn tuyệt đối.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Tạo chuỗi báo cáo CLI có màu bằng mã thoát ANSI, gồm tiêu đề, tóm tắt, thanh tiến trình, từng dòng kết quả và chi tiết kiểm định. Không in chuỗi ra.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Gọi `generateCliReport`, in kết quả bằng `console.log` rồi trả về chuỗi.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Tạo `outputDir` và ghi tệp `report.html` độc lập, gồm tóm tắt, thanh tiến trình, nút lọc, dòng có thể mở rộng và chế độ sáng/tối. Trả về đường dẫn tệp.

## Kiểu kết quả

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

## Trình chạy kịch bản

### runScenario

```ts
runScenario(definition: ScenarioDefinition, options: RunScenarioOptions): Promise<ScenarioReport>
```

Chạy các bước theo thứ tự, với phạm vi biến dùng chung cho mỗi vòng lặp kịch bản. Mọi tham chiếu thao tác được phân giải trước khi chạy và bộ lọc hàng loạt bị bỏ qua, nên có thể chọn bất kỳ thao tác nào trong đặc tả. Biến ban đầu lấy từ cấu hình và kịch bản; giá trị trích xuất dùng được ở các bước sau. `stopOnFailure` mặc định là `true`. `options.signal` hủy lượt chạy và các bước còn lại được ghi là bỏ qua; ngoại lệ từ bộ lắng nghe `onEvent` không dừng lượt chạy.

`data` ở cấp kịch bản chạy toàn bộ chuỗi với phạm vi mới cho mỗi dòng. `iterations` có thể yêu cầu lặp thêm; số vòng thực tế là giá trị lớn hơn giữa số khai báo và số dòng, tối đa 1000. `request.data` ở cấp bước lặp lại bước đó, và chỉ các giá trị trích xuất của lần chạy cuối được giữ trong phạm vi chung.

### Kiểu kịch bản

Các khai báo sau mô tả đầu vào và đầu ra của kịch bản. `ScenarioDataRow` và `ScenarioIterations` là cấu trúc phụ được trình bày để dễ hiểu; chúng không phải mục xuất có tên từ gốc gói. Có thể truy cập cấu trúc của chúng qua giao diện công khai.

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

### stepRef và resolveSteps

```ts
stepRef(step: ScenarioStep): string
resolveSteps(definition: ScenarioDefinition, operations: OperationInfo[]): ResolvedStep[]
```

`stepRef` ưu tiên `method` và `path` tường minh; nếu không có, hàm chuẩn hóa `ref` nhưng giữ nguyên operationId không có tiền tố. `resolveSteps` trả về các mục chứa `step`, `op` và `ref` đã chuẩn hóa; hàm ném ngoại lệ nếu không tìm thấy bất kỳ tham chiếu nào, kể cả ở bước bị bỏ qua.

### applyExtracts

```ts
applyExtracts(extracts: ScenarioExtract[] | undefined, response: TestResult["response"]): Record<string, string>
```

Đọc giá trị nội dung bằng JSONPath, tiêu đề không phân biệt hoa thường hoặc trạng thái phản hồi. Bỏ qua giá trị thiếu và null; chuyển các giá trị khác thành chuỗi, tuần tự hóa đối tượng thành JSON.

## Hàm hỗ trợ trình chạy

Chữ ký các hàm hỗ trợ dùng những kiểu không được xuất có tên từ gốc gói. Hãy suy ra kiểu từ hàm công khai thay vì nhập tệp nội bộ:

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

Thu thập thao tác chuẩn và bổ sung, gán operationId thay thế nếu cần, suy ra giao thức và áp dụng `config.filter`. Mỗi mục chứa `path`, `method`, `operation`, `pathItem`, `operationId` và `protocol`.

### executeStep

```ts
executeStep(client: ReturnType<typeof createClient>, op: OperationInfo, options: StepExecutionOptions): Promise<StepExecution>
```

`client` được tạo bằng `createClient` trong `@powerduck/openapi-request`. Tùy chọn bắt buộc là `config` và `spec`; `signal`, `variables`, `values`, `serverUrl` và `extraAssertions` là tùy chọn. Kết quả chứa `result`, `response` đã chuẩn hóa, `request` tùy chọn và phạm vi biến `env` do script tạo. Trình chạy hàng loạt và trình chạy kịch bản dùng chung luồng thực thi này.

### buildSummary

```ts
buildSummary(results: TestResult[], durationMs: number): TestSummary
```

Đếm kết quả đạt, không đạt, lỗi và bỏ qua. Tỷ lệ đạt bằng số đạt chia tổng số, làm tròn đến một chữ số thập phân; nếu không có kết quả thì tỷ lệ bằng 0.

### formatAssertionError

```ts
formatAssertionError(error: unknown): string | undefined
```

Lấy thông báo dễ đọc từ chuỗi, Error hoặc trường `message` hay `msg`; nếu không được thì tuần tự hóa giá trị. Đầu vào được coi là sai trong ngữ cảnh boolean trả về `undefined`.

### buildImplicitAssertions

```ts
buildImplicitAssertions(protocol: string, response: TestResult["response"]): AssertionResult[]
```

Tạo các kiểm tra trong [Kiểm định ngầm định](#implicit-assertions). Giao thức không xác định không tạo kiểm tra ngầm định.

## Kiểm định ngầm định {#implicit-assertions}

Khi thao tác không định nghĩa `x-tests` cũng như script Postman, trình chạy thêm một kiểm định ngầm định theo giao thức:

| Giao thức | Kiểm tra ngầm định |
|----------|----------------|
| `http`, `sse` | Trạng thái HTTP là `2xx` |
| `graphql` | Trạng thái HTTP là `2xx` **và** không có mảng `errors` khác rỗng ở cấp cao nhất |
| `grpc` | Mã trạng thái gRPC là `0` (OK) |
| `mcp` | Phản hồi JSON-RPC có `result` và không có `error` |
| `websocket` | Kết nối đạt trạng thái `open` mà không có sự kiện lỗi |