---
sidebar_position: 4
title: API Reference
description: "Every export of @powerduck/openapi-cli: functions, types, and the assertion engine."
---

# API Reference

Complete API documentation for `@powerduck/openapi-cli` v0.2.3. All exports are
available from the package root.

## Exports overview

| Export | Kind | Description |
|--------|------|-------------|
| `runTests` | function | Run all collected operations and return a `TestReport` |
| `resolveConfig` | function | Resolve a `CliConfig` from args / config file / defaults |
| `loadSpec` | async function | Load and dereference a spec from a local path or remote URL |
| `isRemoteSpec` | function | Whether a spec path starts with `http(s)://` |
| `DEFAULT_CONFIG` | const | Built-in default values |
| `runDeclarativeAssertions` | function | Evaluate an array of `DeclarativeAssertion` against a response |
| `extractAssertions` | function | Pull `x-tests` declarative assertions from an operation |
| `extractPostmanScripts` | function | Pull the Postman test script string from an operation |
| `resolveJsonPath` | function | Minimal JSONPath resolver (dot notation + array indices) |
| `generateJsonReport` | function | Write `report.json` to disk, returning the file path |
| `generateCliReport` | function | Build the colored CLI report string (without printing) |
| `printCliReport` | function | Print the CLI report to stdout and return the string |
| `generateHtmlReport` | function | Write `report.html` to disk, returning the file path |
| `CliArgs` | type | Shape of the CLI/config resolution input |
| `DeclarativeAssertion` | type | One declarative assertion object |
| `CliConfig` | type | The central configuration interface |
| `TestReport` | type | The full report returned by `runTests` |
| `TestResult` | type | One operation's test outcome |
| `TestSummary` | type | Aggregate pass/fail counts |
| `AssertionResult` | type | One assertion outcome |
| `ReportFormat` | type | `"json" \| "cli" \| "html"` |
| `ProtocolName` | type | `"http" \| "sse" \| "websocket" \| "graphql" \| "grpc" \| "mcp"` |
| `TestStatus` | type | `"passed" \| "failed" \| "skipped" \| "error"` |
| `AuthConfig` | type | Authentication configuration |
| `TlsConfig` | type | TLS / certificate configuration |
| `FilterConfig` | type | Operation filter |

## runTests

```ts
runTests(config: CliConfig): Promise<TestReport>
```

Loads the spec with `loadSpec`, collects operations (honoring `config.filter`),
executes them with bounded concurrency (`min(config.concurrency ?? 5,
queue.length)`), runs declarative and Postman assertions, adds implicit protocol
assertions when no user assertions exist, sorts results by path then method,
and returns a `TestReport`.

The returned `TestReport` has shape:

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

Merges `args` (CLI flags), an optional JSON config file (`args.config`), and
`DEFAULT_CONFIG`. Loads `args.env` if present, then expands `${ENV_VAR}`
references in `serverUrl`, `proxy`, header values, `auth.token`, and variable
values. Throws `"No OpenAPI spec path provided..."` when no spec is given, and
`Invalid proxy URL: <url>` when `proxy` is unparseable.

`CliArgs` mirrors the CLI flags:

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

Reads `config.specPath`. If `isRemoteSpec` is true, it fetches over HTTP(S)
(following up to 5 redirects, enforcing `config.timeout`, with
`User-Agent: @powerduck/openapi-cli`); otherwise it reads the local file. The
body is parsed as JSON and must be an object with a `paths` object. Internal
`$ref`s are then best-effort dereferenced; failures leave the spec untouched.

## isRemoteSpec

```ts
isRemoteSpec(specPath: string): boolean
```

Returns `true` when `specPath` matches `/^https?:\/\//i`.

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

## Assertion engine

### runDeclarativeAssertions

```ts
runDeclarativeAssertions(
  assertions: DeclarativeAssertion[],
  ctx: { status?: number; headers?: Record<string,string>; body?: unknown; bodyText?: string; durationMs: number },
): AssertionResult[]
```

Evaluates every declarative assertion against a response context. Errors during
evaluation are captured as a failed `AssertionResult`.

### extractAssertions

```ts
extractAssertions(operation: any, pathItem?: any): DeclarativeAssertion[]
```

Collects `x-tests` arrays from both the path item and the operation (path-item
first, then operation), keeping only entries that are objects with both `name`
and `assert`.

### extractPostmanScripts

```ts
extractPostmanScripts(operation: any): string | undefined
```

Returns the string at `operation["x-postman-scripts"].test`, if present.

### resolveJsonPath

```ts
resolveJsonPath(obj: unknown, path: string): unknown
```

Minimal resolver supporting leading `$.` or `$`, dot notation, and numeric
array indices (e.g. `$.data.items[0].id`). Returns `undefined` when a segment
does not exist.

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

## Reporters

### generateJsonReport

```ts
generateJsonReport(report: TestReport, outputDir: string): string
```

Creates `outputDir` (recursively) and writes `report.json` as
`JSON.stringify(report, null, 2)`. Returns the absolute file path.

### generateCliReport

```ts
generateCliReport(report: TestReport): string
```

Builds the colored, ANSI-escape CLI report string (header, summary bar,
progress bar, per-result rows, assertion details) without printing it.

### printCliReport

```ts
printCliReport(report: TestReport): string
```

Calls `generateCliReport`, prints the result with `console.log`, and returns
the string.

### generateHtmlReport

```ts
generateHtmlReport(report: TestReport, outputDir: string): string
```

Creates `outputDir` and writes a self-contained `report.html` (summary strip,
progress bar, filter buttons, expandable rows, light/dark mode). Returns the
file path.

## Result types

### TestResult

```ts
interface TestResult {
  operationId: string;
  path: string;
  method: string;
  protocol: ProtocolName | string;
  status: TestStatus;
  durationMs: number;
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

## Implicit assertions

When an operation defines neither `x-tests` nor a Postman script, the runner
adds one protocol-specific implicit assertion:

| Protocol | Implicit check |
|----------|----------------|
| `http`, `sse` | HTTP status is `2xx` |
| `graphql` | HTTP status `2xx` **and** no top-level `errors` array |
| `grpc` | gRPC status code is `0` (OK) |
| `mcp` | JSON-RPC response has `result` and no `error` |
| `websocket` | Connection reached `open` with no error event |
