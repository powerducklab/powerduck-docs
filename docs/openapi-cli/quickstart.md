---
sidebar_position: 3
title: Quick Start
description: "Run your first batch test with @powerduck/openapi-cli from the CLI and from Node.js."
---

# Quick Start

This guide walks you through testing your first OpenAPI document.

## Prerequisites

- Node.js `>= 18.17`.
- An OpenAPI 3.2 **JSON** document (YAML is not accepted — convert it to JSON
  first). The document must contain a top-level `paths` object.

## 1. Run from the CLI

The simplest possible run loads a local spec and tests every operation against
the first server URL declared in the document:

```bash
openapi-cli --spec openapi.json
```

Override the target server and write reports to a custom directory:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Test a remote spec with only `GET` operations, using 10 concurrent workers:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Use a JSON config file for complex setups:

```bash
openapi-cli --config openapi-cli.config.json
```

See the [Commands](./commands) page for every flag.

## 2. Write a minimal spec to test

A minimal OpenAPI document with declarative assertions:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

When an operation defines **no** assertions, the runner adds an implicit
protocol success check (for HTTP, an implicit `2xx` status assertion) so that
4xx/5xx responses are not silently marked as passed.

## 3. Run from Node.js (programmatic API)

The library exposes the same pipeline as functions. The typical flow is
`resolveConfig` → `runTests` → reporters:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` accepts the same shape as the CLI (see
[Configuration](./configuration)). `runTests` returns a `TestReport`
containing `summary`, `results`, `config`, `generatedAt`, and `version`.

## 4. Exit codes for CI

| Code | Meaning |
|------|---------|
| `0` | All tests passed (or `--no-fail-on-error` is set) |
| `1` | One or more tests failed or errored |
| `2` | Configuration error, spec load failure, or fatal runtime error |

## What's next?

- [Configuration](./configuration) — every `CliConfig` field and default.
- [Commands](./commands) — every CLI flag.
- [Examples](./examples) — auth, filtering, reports, and assertions.
- [API Reference](./api-reference) — every exported function and type.
