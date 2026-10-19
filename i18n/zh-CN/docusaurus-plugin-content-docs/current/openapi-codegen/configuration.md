---
sidebar_position: 4
title: "配置"
description: "@powerduck/openapi-codegen 的生成选项：GenerateOptions、RequestIR、Generator 与 Plugin 接口。"
---

# 配置

没有独立的配置文件。生成行为由传给 [`generate()`](/docs/zh-CN/openapi-codegen/api-reference/) 的 `GenerateOptions` 对象控制。

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| 选项 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `language` | `string` | 是 | 目标语言标识符，不区分大小写，例如 `"javascript"` |
| `client` | `string` | 是 | 目标 HTTP 客户端标识符，例如 `"fetch"` |
| `request` | `RequestIR` | 二选一* | 已规范化的请求；跳过 `normalize` |
| `document` | `unknown` | 二选一* | 已解析的 OpenAPI 文档对象 |
| `path` | `string` | 使用 `document` 时 | 精确的 OpenAPI 路径模板，例如 `"/pets/{id}"` |
| `method` | `string` | 使用 `document` 时 | HTTP 方法，例如 `"get"` / `"post"` |
| `serverUrl` | `string` | 否 | 覆盖文档中的服务器 URL |
| `securityValues` | `Record<string, string>` | 否 | 以安全方案名称为键的凭据 |
| `softRefMode` | `boolean` | 否 | 遇到失效或循环的 `$ref` 时不抛错，返回部分值 |

\* 必须提供单独的 `request`，或同时提供 `document` + `path` + `method`。提供 `request` 时，会忽略 `document`、`path`、`method`、`serverUrl`、`securityValues` 和 `softRefMode`。

### 输入校验错误

缺少必填输入时，`generate()` 会抛出错误：

- `TypeError: generate() requires an options object` — 未提供选项对象。
- `Error: Unsupported generator: <language>/<client>` — 未知的组合。
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

对于不支持的方法、缺少 `paths`、未知路径或缺少操作，`normalize()` 本身会抛出 `Error`；文档不是对象时则抛出 `TypeError`。

## RequestIR

单个请求的规范化表示，不依赖具体代码生成器。可以直接构造并通过 `options.request` 传入，从而跳过 `normalize`。

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Multipart 文件占位符使用以下标记结构：

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

符合此接口的对象都可以作为生成器。内置生成器由 `createGenerator(language, client, emit)` 包装，也可以注册自己的生成器：

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` 接收 `RequestIR`，返回生成的源代码字符串。

## Plugin

插件通过 `use()` 注册一个或多个生成器：

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

示例：

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

此类型为将来可能包含多个文件的生成结果预留。目前 `generate()` 仍然返回 `string`：

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize 的输出结构

直接调用 `normalize()`（参见 [API 参考](/docs/zh-CN/openapi-codegen/api-reference/#normalizeoptions)）会返回比 `RequestIR` 略丰富的对象：

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## 服务器 URL 的解析顺序

`baseUrl` 使用下列顺序中的首个非空值：

1. `options.serverUrl`
2. 操作级的 `servers`
3. 路径项的 `servers`
4. 根级的 `servers`
5. 回退值 `"https://example.com"`

服务器中的 `{variable}` 占位符从 `server.variables` 读取 `default` 值，缺失时使用 `example`，并进行 URI 编码。
