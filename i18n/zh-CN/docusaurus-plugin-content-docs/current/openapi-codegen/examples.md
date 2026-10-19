---
sidebar_position: 5
title: "示例"
description: "@powerduck/openapi-codegen 实用示例：JavaScript fetch、Python requests、cURL、自定义生成器、插件与直接使用 RequestIR。"
---

# 示例

`@powerduck/openapi-codegen` 的实用示例。以下示例均假设已有名为 `document` 的已解析 OpenAPI 文档对象。

## 1. JavaScript `fetch`

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

其他 JavaScript 客户端包括 `axios`、`ofetch`、`jquery`、`xhr`。对应的服务端 Node 版本请使用 `node/fetch`、`node/axios`、`node/ofetch` 或 `node/undici`。

## 2. Python `requests`

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

其他 Python 客户端包括 `aiohttp`、`http-client`、`httpx-sync`、`httpx-async`。

## 3. cURL (shell)

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
  securityValues: { bearerAuth: "YOUR_ACCESS_TOKEN" },
});

console.log(code);
```

其他 shell 客户端包括 `wget` 和 `httpie`。上传 `multipart/form-data` 时，建议优先使用 `shell/curl` 或 `shell/httpie`，而不是 `shell/wget`。

## 4. 查找并选择生成器

使用 `list()` 查看可用生成器，再用选定的语言与客户端组合生成代码：

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const all = list();
console.log(all.length, "generators available");

const picked = all.find(
  (g) => g.language === "python" && g.client === "requests",
);

if (!picked) throw new Error("generator unavailable");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 5. 注册自定义生成器

实现 `Generator` 接口并调用 `register`：

```typescript
import { register, generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

register({
  language: "mylang",
  client: "my-client",
  generate(request: RequestIR): string {
    return [
      `// ${request.method} ${request.baseUrl}${request.path}`,
      `mylang.request(${JSON.stringify({
        method: request.method,
        url: request.baseUrl + request.path,
      })})`,
    ].join("\n");
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "mylang",
  client: "my-client",
});

console.log(code);
```

## 6. 使用插件

插件通过 `use()` 统一注册一个或多个生成器：

```typescript
import { use, generate } from "@powerduck/openapi-codegen";

use({
  name: "internal-generators",
  register(api) {
    api.register({
      language: "go",
      client: "our-wrapper",
      generate(request) {
        return `// go wrapper for ${request.method} ${request.path}`;
      },
    });
    api.register({
      language: "ruby",
      client: "our-wrapper",
      generate(request) {
        return `# ruby wrapper for ${request.method} ${request.path}`;
      },
    });
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "go",
  client: "our-wrapper",
});
```

## 7. 直接从 `RequestIR` 生成

自行构造 `RequestIR`，即可完全跳过 `normalize`：

```typescript
import { generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

const request: RequestIR = {
  method: "GET",
  baseUrl: "https://api.example.com",
  path: "/users/{id}",
  parameters: [
    { name: "id", in: "path", value: 123 },
    { name: "limit", in: "query", value: 10, style: "form", explode: true },
  ],
  headers: [
    { name: "Accept", in: "header", value: "application/json" },
  ],
  body: undefined,
  security: [
    { name: "bearerAuth", type: "http", scheme: "bearer", value: "token-abc" },
  ],
};

const code = generate({
  request,
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 8. 错误处理

缺少输入、生成器未知或引用无法解析时，`generate()` 会抛出错误。处理不可信输入时应始终捕获错误：

```typescript
try {
  const code = generate({
    document,
    path: "/does-not-exist",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
}
```

可能出现的错误消息包括 `Unsupported generator: ...`，以及 `Path not found: ...` / `Operation not found: METHOD /path`。

## 9. `$ref` 宽容模式

文档可能包含失效或循环引用时，传入 `softRefMode: true` 可在解析不完整的情况下继续处理，而不是抛错：

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "python",
  client: "requests",
  softRefMode: true,
});
```
