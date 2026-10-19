---
sidebar_position: 5
title: "示例"
description: "以下是 @powerduck/openapi-cli 的实用示例，使用实际支持的命令行选项和编程接口。"
---

# 示例

以下是 `@powerduck/openapi-cli` 的实用示例，使用实际支持的命令行选项和编程接口。

## 1. 基本 CLI 测试

指定本地 OpenAPI 文档，执行其中的所有操作：

```bash
openapi-cli --spec openapi.json
```

覆盖服务器地址，并将报告保存到自定义目录：

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

测试远程 URL 上的规范：

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. 在代码中运行并配置鉴权

使用库 API，设置 Bearer 令牌、自定义请求头和并发数：

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. 筛选测试范围

按方法、标签、路径正则表达式或 operationId，只运行部分操作：

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

在代码中组合这些筛选条件：不同类别之间为 AND 关系，同一类别中的标签为 OR 关系。

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. 生成 JSON 和 HTML 报告

用 `--format` 选择输出格式，默认输出全部三种格式：

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

对应的代码写法：

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` 写入 `report.json`；`generateHtmlReport` 写入 `report.html`。两者都会在输出目录不存在时创建目录，并返回文件路径。

## 5. 在规范中声明断言

向任意操作添加 `x-tests` 数组。每项都需要 `name` 和 `assert` 类型：

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

断言类型：

| `assert` | 必填字段 | 用途 |
|----------|-----------------|---------|
| `status` | `value` | HTTP 状态码等于 `value` |
| `header` | `key`；`contains` 可选 | 响应头存在，并可进一步检查是否包含指定子串 |
| `bodyContains` | `contains` | 响应体包含指定子串 |
| `bodyEquals` | `body` | 响应体与 `body` 完全相等 |
| `jsonPath` | `path`；`equals` / `exists` 可选 | 解析 JSONPath，并比较值或检查是否存在 |
| `responseTime` | `max` | 耗时必须满足 `<= max`，单位为毫秒 |

## 6. Postman 脚本

通过 `x-postman-scripts` 嵌入 Postman 风格的测试脚本：

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

声明式 `x-tests` 和 `x-postman-scripts` 可以同时用于同一操作。

## 7. CI 集成（GitHub Actions）

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

默认情况下，测试失败返回退出码 `1`，配置错误或致命运行时错误返回 `2`，从而使 CI 作业失败。使用 `--no-fail-on-error` 可让已完成的测试运行不导致流水线失败，但不会忽略配置错误或致命错误。
