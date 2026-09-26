---
sidebar_position: 1
title: Introduction
description: "Introduction to @powerduck/openapi-cli, a CI-ready CLI for batch-testing OpenAPI 3.2 documents across six protocols."
---

# Introduction

`@powerduck/openapi-cli` is a command-line tool that batch-tests an
OpenAPI 3.2 document against a live server. Point it at a spec file or URL,
and it exercises every operation in the document, runs assertions against each
response, and produces three report formats.

It is built on top of [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request)
for request execution and [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser)
for `$ref` dereferencing.

## Why openapi-cli

- **CI-ready** — a non-zero exit code signals test failure, so the tool drops
  straight into GitHub Actions, GitLab CI, or any pipeline.
- **Multi-protocol out of the box** — one spec can describe HTTP, SSE,
  WebSocket, GraphQL, gRPC, and MCP operations; the same runner handles all of
  them.
- **Two assertion styles** — declarative `x-tests` arrays for simple checks,
  and full Postman `pm.test()` / `pm.expect()` scripts for complex ones.
- **Three report formats** — machine-readable JSON, colored human-readable CLI
  output, and a self-contained interactive HTML report.
- **Local or remote specs** — load a document from a file path or an
  `http(s)://` URL (with redirect following and timeout enforcement).
- **Flexible filtering** — run a subset of operations by method, path, tag, or
  operationId, with bounded concurrency.

## Supported protocols

The runner detects the protocol for each operation from OpenAPI vendor
extensions or response content types:

| Protocol | Identifier | How it is selected |
|----------|-----------|--------------------|
| HTTP | `http` | Default for every standard operation |
| Server-Sent Events | `sse` | `text/event-stream` response content type, or `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Protocol can also be forced with the `x-protocol` extension on either the
operation or the path item.

## Reports

After a run, the tool writes (by default into `./openapi-cli-report`):

- `report.json` — the complete `TestReport` object as pretty-printed JSON.
- `report.html` — a self-contained, dependency-free HTML report with a summary
  strip, progress bar, filter buttons, and expandable test rows.
- stdout — a colored CLI summary with a progress bar and per-test assertions.

## Programmatic use

The same pipeline is available as a library. Resolve a config, run the tests,
then pick the reporters you want:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Next steps

- [Installation](./installation.md) — install globally or as a dev dependency.
- [Quick Start](./quickstart.md) — run your first test suite.
- [Configuration](./configuration.md) — the complete `CliConfig` reference.
- [Commands](./commands.md) — every CLI flag and exit code.
- [API Reference](./api-reference.md) — every exported function and type.
- [Examples](./examples.md) — ready-to-run recipes.
