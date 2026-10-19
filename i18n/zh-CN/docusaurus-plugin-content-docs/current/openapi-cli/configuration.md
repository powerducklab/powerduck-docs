---
sidebar_position: 6
title: "配置"
description: "配置优先级为 命令行参数 > 配置文件 > 默认值。解析后得到 resolveConfig 返回的 CliConfig 对象。"
---

# 配置

配置优先级为 **命令行参数 > 配置文件 > 默认值**。解析后得到 [`resolveConfig`](./api-reference.md#resolveconfig) 返回的 `CliConfig` 对象。

## CliConfig

核心配置类型。除 `specPath` 外，所有字段均可选。

| 字段 | 类型 | 默认值 | 说明 |
|-------|------|---------|-------------|
| `specPath` | `string` | **必填** | OpenAPI 3.2 JSON 规范的文件路径或 `http(s)://` URL |
| `serverUrl` | `string` | *（来自规范）* | 覆盖规范中的服务器基础 URL |
| `outputDir` | `string` | `"./openapi-cli-report"` | 报告文件的输出目录 |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | 要生成的报告格式 |
| `filter` | `FilterConfig` | `undefined` | 筛选要测试的操作 |
| `concurrency` | `number` | `5` | 最大并发请求数，取值为 1 至 100 的整数 |
| `timeout` | `number` | `30000` | 单次请求超时，单位为毫秒，取值为 1 至 600000 的整数；获取远程规范时也适用 |
| `proxy` | `string` | `undefined` | HTTP(S) 代理 URL，例如 `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS 与证书配置 |
| `headers` | `Record<string, string>` | `undefined` | 每次请求都发送的额外请求头 |
| `auth` | `AuthConfig` | `undefined` | 鉴权配置 |
| `variables` | `Record<string, string>` | `undefined` | 要注入的 Postman `{{name}}` 变量 |
| `failOnError` | `boolean` | `true` | 仅用于 CLI：测试失败后返回非零退出码；调用库时应检查报告 |
| `envFile` | `string` | `undefined` | `.env` 文件路径，每行一个 `KEY=VALUE` |
| `grpcReflection` | `boolean` | 自动 | gRPC：显式配置优先，其次使用操作扩展；否则在未提供 proto 路径时启用反射 |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC：`.proto` 文件或目录路径 |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP：操作使用的传输方式 |
| `mcpCommand` | `string` | `undefined` | MCP stdio：要启动的命令 |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio：命令参数 |
| `mcpCwd` | `string` | `undefined` | MCP stdio：工作目录 |

`ReportFormat` 是联合类型 `"json" | "cli" | "html"`。

## 高级运行时选项

以下字段也属于 `CliConfig`。`requester`、`maxEvents`、`maxStreamMs` 和 `maxResponseSize` 可以写在 JSON 配置文件中。`signal`、`httpRuntime` 和 `resolveTransport` 是运行时对象，不属于 JSON 配置；应在解析配置后，通过代码直接传给 `runTests()`。

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` 控制 HTTP 重定向、Cookie 和协议选择。执行 HTTP/SSE 时，`maxEvents` 默认为 50，`maxStreamMs` 未设置时使用 `timeout`，`maxResponseSize` 则传给请求运行库。gRPC 使用 `maxStreamMs` 作为流的截止时间，未设置时依次回退到 `timeout` 和 30000 毫秒。`signal` 用于取消运行；`httpRuntime` 提供 HTTP 证书和文件处理；`resolveTransport` 为每个目标解析传输设置。

## DEFAULT_CONFIG

库导出的内置默认配置对象：

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `methods` | `string[]` | 只测试这些 HTTP 方法，例如 `["get","post"]`；配置文件中使用小写，CLI 输入会自动规范化 |
| `paths` | `string[]` | 只测试匹配任一正则表达式的路径；正则无效时回退为子串匹配 |
| `tags` | `string[]` | 只测试带有任一指定标签的操作 |
| `operationIds` | `string[]` | 只测试与这些 `operationId` 值精确匹配的操作 |

没有任何字段的筛选配置会解析为 `undefined`，即运行全部操作。

## TlsConfig

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `caCert` | `string` | CA 证书包路径（PEM） |
| `clientCert` | `string` | 用于 mTLS 的客户端证书路径（PEM） |
| `clientKey` | `string` | 用于 mTLS 的客户端私钥路径（PEM） |
| `strictSSL` | `boolean` | 为 `false` 时跳过 TLS 证书验证，不安全 |
| `pfx` | `string` | PFX 证书包路径；gRPC 必须改用 PEM |
| `passphrase` | `string` | 加密证书材料的口令 |

> 注意：CLI 选项 `--insecure` 对应 `tls.strictSSL = false`，即**禁用**验证。

## AuthConfig

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | 鉴权方案，支持的名称见下文 |
| `parameters` | `Record<string, string \| number \| boolean>` | 传给请求运行库的鉴权方案专用参数 |
| `token` | `string` | Bearer 令牌，用于 `type: "bearer"` |
| `username` | `string` | 用户名，用于 `type: "basic"` |
| `password` | `string` | 密码，用于 `type: "basic"` |
| `key` | `string` | API 密钥名称，用于 `type: "apikey"` |
| `value` | `string` | API 密钥值，用于 `type: "apikey"` |
| `in` | `"header" \| "query"` | API 密钥的放置位置 |

支持的 `type` 值包括 `bearer`、`basic`、`apikey`、`none`、`digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap` 和 `edgegrid`。具体可用性及必需参数取决于协议和请求运行库；仅填写名称并不代表已配置好鉴权。

目前 CLI 的 `--bearer` 选项只生成 `{ type: "bearer", token }`。更完整的 `basic` / `apikey` 配置可通过配置文件提供。

## JSON 配置文件

配置文件是符合 `Partial<CliConfig>` 的普通 JSON。通过 `--config <path>` / `-c` 指定，命令行参数始终优先于文件中的值。

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

配置文件不存在时抛出 `Config file not found: <path>`；JSON 无效时抛出 `Invalid config file (must be JSON)`。

## 环境变量展开

通过 `--env` / `envFile` 加载 `.env` 后，会在以下字符串字段中展开 `${VAR_NAME}` 引用：

- `serverUrl`
- `proxy`
- `headers` 的值
- `auth.token`
- `variables` 的值

示例：

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` 的处理方式：**不覆盖**已有 `process.env` 项；去掉值两侧的单引号或双引号；忽略空行和 `#` 注释行；文件不存在时静默跳过。

## 在代码中构建配置

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

未提供规范时，`resolveConfig` 抛出 `"No OpenAPI spec path provided..."`；`proxy` 不是有效 URL 时，抛出 `Invalid proxy URL: <url>`。
