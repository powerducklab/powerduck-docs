---
sidebar_position: 3
title: "快速开始"
description: "使用 @powerduck/openapi-cli，从 CLI 和 Node.js 运行第一组批量测试。"
---

# 快速开始

本指南带你完成第一个 OpenAPI 文档的测试。

## 前提条件

- Node.js `>= 22.12.0`.
- 一份 OpenAPI 3.2 **JSON** 文档。不接受 YAML，请先转换为 JSON。文档顶层必须包含 `paths` 对象。

## 1. 从 CLI 运行

最简单的运行方式会加载本地规范，并针对文档声明的第一个服务器 URL 测试全部操作：

```bash
openapi-cli --spec openapi.json
```

覆盖目标服务器，并将报告写入自定义目录：

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

测试远程规范中的 `GET` 操作，使用 10 个并发工作单元：

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

复杂设置可以使用 JSON 配置文件：

```bash
openapi-cli --config openapi-cli.config.json
```

所有命令行参数见 [命令参考](/docs/zh-CN/openapi-cli/commands/).

## 2. 编写最小测试规范

带有声明式断言的最小 OpenAPI 文档：

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

如果操作**没有**定义断言，运行器会补充隐式的协议成功检查。对于 HTTP，会要求 `2xx` 状态，避免把 4xx/5xx 响应静默标记为通过。

## 3. 从 Node.js 运行（编程 API）

库以函数形式提供同一套流程，通常为 `resolveConfig` → `runTests` → 报告生成器。

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

`resolveConfig` 接受与 CLI 相同结构的选项。`runTests` 返回 `TestReport`，包含 `summary`、`results`、`config`、`generatedAt` 和 `version`。 [配置](/docs/zh-CN/openapi-cli/configuration/).

## 4. CI 退出码

| 退出码 | 含义 |
|---|---|
| `0` | 全部测试通过，或已设置 `--no-fail-on-error`。 |
| `1` | 一个或多个测试失败或出现错误。 |
| `2` | 配置错误、规范加载失败或致命运行时错误。 |

## 下一步

- [配置](/docs/zh-CN/openapi-cli/configuration/) — `CliConfig` 的所有字段及默认值。
- [命令参考](/docs/zh-CN/openapi-cli/commands/) — 全部 CLI 参数。
- [示例](/docs/zh-CN/openapi-cli/examples/) — 身份验证、筛选、报告和断言。
- [API 参考](/docs/zh-CN/openapi-cli/api-reference/) — 全部导出的函数和类型。
