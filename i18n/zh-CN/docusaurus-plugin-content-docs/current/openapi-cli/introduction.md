---
sidebar_position: 1
title: "简介"
description: "@powerduck/openapi-cli 是一个命令行工具，可根据 OpenAPI 3.2 文档对实际服务器进行批量测试。指定规范文件或 URL 后，它会执行文档中的操作，对每个响应运行断言，并生成三种格式的报告。"
---

# 简介

`@powerduck/openapi-cli` 是一个命令行工具，可根据 OpenAPI 3.2 文档对实际服务器进行批量测试。指定规范文件或 URL 后，它会执行文档中的操作，对每个响应运行断言，并生成三种格式的报告。

它使用 [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) 执行请求，使用 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) 解析 `$ref` 引用。

## 为什么使用 openapi-cli

- **适合 CI** — 默认情况下，测试失败或执行出错会返回非零退出码，可直接接入 GitHub Actions、GitLab CI 或其他流水线。
- **开箱即用的多协议支持** — 同一份规范可以描述 HTTP、SSE、WebSocket、GraphQL、gRPC 和 MCP 操作，并由同一个运行器处理。
- **两种断言方式** — 简单检查使用声明式 `x-tests` 数组，复杂检查使用 Postman 风格的 `pm.test()` / `pm.expect()` 脚本。
- **三种报告格式** — 机器可读的 JSON、便于阅读的彩色命令行输出，以及独立的交互式 HTML 报告。
- **本地或远程规范** — 通过文件路径或 `http(s)://` URL 加载文档，支持跟随重定向和超时限制。
- **灵活筛选** — 按方法、路径、标签或 operationId 选择要运行的操作，并限制并发数。

## 支持的协议

运行器根据 OpenAPI 扩展或响应内容类型，识别各操作的协议：

| 协议 | 标识符 | 选择方式 |
|----------|-----------|--------------------|
| HTTP | `http` | 标准操作的默认协议 |
| 服务器发送事件 | `sse` | 响应内容类型为 `text/event-stream`，或设置 `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

也可以在操作或路径项上设置 `x-protocol` 扩展，显式指定协议。

## 报告

运行结束后，工具输出以下内容，文件默认保存到 `./openapi-cli-report`：

- `report.json` — 完整的 `TestReport` 对象，以格式化 JSON 保存。
- `report.html` — 独立、无外部依赖的 HTML 报告，包含概要栏、进度条、筛选按钮和可展开的测试行。
- 标准输出 — 彩色命令行摘要，包含进度条和各测试的断言结果。

## 在代码中使用

同一套流程也可以作为库调用。先解析配置、运行测试，再选择所需的报告生成器：

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## 后续阅读

- [安装](./installation.md) — 全局安装或作为开发依赖安装。
- [快速上手](./quickstart.md) — 运行第一套测试。
- [配置](./configuration.md) — 完整的 `CliConfig` 参考。
- [命令](./commands.md) — 所有命令行选项和退出码。
- [API 参考](./api-reference.md) — 所有导出的函数和类型。
- [示例](./examples.md) — 可直接运行的用法示例。
