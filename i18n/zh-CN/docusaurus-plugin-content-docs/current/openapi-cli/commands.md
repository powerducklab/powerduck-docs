---
sidebar_position: 5
title: "CLI 命令"
description: "该包只提供一个可执行命令 openapi-cli，直接接受选项列表，没有 run / validate / init 子命令："
---

# CLI 命令

该包只提供一个可执行命令 `openapi-cli`，直接接受选项列表，**没有** `run` / `validate` / `init` 子命令：

```
openapi-cli [options]
```

## 命令格式

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

**必须**指定规范：传入 `--spec`（或 `-s`），或者在通过 `--config` 加载的 JSON 配置文件中设置 `specPath`。其他选项均可省略。

## 基本选项

| 选项 | 短选项 | 默认值 | 说明 |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON 规范的文件路径或 `http(s)://` URL |
| `--server <url>` | `-S` | *（来自规范）* | 覆盖规范中的服务器 URL |
| `--output <dir>` | `-o` | `./openapi-cli-report` | 报告输出目录 |
| `--format <formats>` | `-f` | `json,cli,html` | 用逗号分隔的报告格式：`json`、`cli`、`html` |
| `--config <path>` | `-c` | — | JSON 配置文件路径，命令行参数优先 |

## 执行选项

| 选项 | 短选项 | 默认值 | 说明 |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | 最大并发请求数，取值为 1 至 100 的整数 |
| `--timeout <ms>` | `-t` | `30000` | 单次请求的超时时间，单位为毫秒，取值为 1 至 600000 的整数；获取远程规范时也使用此值 |
| `--no-fail-on-error` | — | 关闭 | 运行完成后，即使测试失败也退出 `0`；配置错误和致命错误仍返回失败 |

## 筛选选项

| 选项 | 默认值 | 说明 |
|--------|---------|-------------|
| `--method <methods>` | — | 要包含的 HTTP 方法，用逗号分隔，例如 `get,post` |
| `--path <patterns>` | — | 用于匹配各路径的正则表达式，用逗号分隔 |
| `--tag <tags>` | — | 要包含的 OpenAPI 标签，用逗号分隔 |
| `--operation-id <ids>` | — | 要包含的 `operationId` 值，用逗号分隔 |

## 网络与 TLS 选项

| 选项 | 短选项 | 默认值 | 说明 |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) 代理 URL，例如 `http://proxy.corp:8080` |
| `--ca <path>` | — | — | CA 证书包（PEM） |
| `--cert <path>` | — | — | 用于 mTLS 的客户端证书（PEM） |
| `--key <path>` | — | — | 用于 mTLS 的客户端私钥（PEM） |
| `--insecure` | `-k` | 关闭 | 跳过 TLS 证书验证 |

## 鉴权、请求头与变量

| 选项 | 短选项 | 说明 |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | 额外请求头，格式为 `Key: Value`；可重复指定 |
| `--bearer <token>` | — | 在 `Authorization` 请求头中发送的 Bearer 令牌 |
| `--variable <vars...>` | `-v` | Postman 变量，格式为 `KEY=VALUE`；可重复指定 |
| `--env <path>` | — | `.env` 文件路径，不覆盖已有环境变量 |

## gRPC 选项

| 选项 | 默认值 | 说明 |
|--------|---------|-------------|
| `--grpc-no-reflection` | 关闭 | 禁用 gRPC 服务器反射，改用 proto 文件 |
| `--grpc-proto <paths...>` | — | `.proto` 文件或包含这些文件的目录路径 |

## MCP 选项

| 选项 | 默认值 | 说明 |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP 传输方式：`streamable-http` 或 `stdio` |
| `--mcp-command <command>` | — | MCP stdio 命令，例如 `npx` |
| `--mcp-args <args>` | — | MCP stdio 参数，用空格或逗号分隔 |
| `--mcp-cwd <dir>` | — | MCP stdio 子进程的工作目录 |

## 信息选项

| 选项 | 短选项 | 说明 |
|--------|-------|-------------|
| `--help` | `-h` | 显示帮助 |
| `--version` | `-V` | 显示版本 |

## 退出码

| 代码 | 含义 |
|------|---------|
| `0` | 所有测试通过，或设置了 `--no-fail-on-error` |
| `1` | 一个或多个测试失败或出错，或命令行参数解析失败 |
| `2` | 配置错误、规范加载失败或致命运行时错误 |

当 `resolveConfig` 抛出异常时，例如既未提供 `--spec` 也未配置 `specPath`，CLI 会以红色输出 `Error:` 并退出 `2`。当 `runTests` 抛出异常时，会输出 `Fatal error:` 并退出 `2`。运行正常完成后，仅当 `report.summary.failed > 0 || report.summary.errors > 0` 且 `failOnError !== false` 时，才退出 `1`。

## 环境变量

没有专用的 `OPENAPI_CLI_*` 变量。除了命令行选项和配置文件，还可以通过以下方式提供配置：

- **`.env` 文件** — 传入 `--env .env`，将 `KEY=VALUE` 键值对加载到 `process.env`，已有变量不会被覆盖。
- **`${VAR}` 展开** — 加载后，会替换 `serverUrl`、`proxy`、`headers` 的值、`auth.token` 和 `variables` 的值中的 `${VAR_NAME}`。

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## 运行示例

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
