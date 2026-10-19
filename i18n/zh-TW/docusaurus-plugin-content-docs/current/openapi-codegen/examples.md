---
sidebar_position: 5
title: "範例"
description: "@powerduck/openapi-codegen 實用範例：JavaScript fetch、Python requests、cURL、自訂產生器、外掛程式與直接使用 RequestIR。"
---

# 範例

`@powerduck/openapi-codegen` 的實用範例。所有範例均假設已有名為 `document` 的已解析 OpenAPI 文件物件。

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

其他 JavaScript 用戶端包括 `axios`、`ofetch`、`jquery`、`xhr`。對應的伺服器端 Node 版本請使用 `node/fetch`、`node/axios`、`node/ofetch` 或 `node/undici`。

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

其他 Python 用戶端包括 `aiohttp`、`http-client`、`httpx-sync`、`httpx-async`。

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

其他 shell 用戶端包括 `wget` 與 `httpie`。上傳 `multipart/form-data` 時，建議優先使用 `shell/curl` 或 `shell/httpie`，而非 `shell/wget`。

## 4. 尋找並選擇產生器

使用 `list()` 查看可用產生器，再以選定的語言與用戶端組合產生程式碼：

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

## 5. 註冊自訂產生器

實作 `Generator` 介面並呼叫 `register`：

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

## 6. 使用外掛程式

外掛程式透過 `use()` 統一註冊一個或多個產生器：

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

## 7. 直接從 `RequestIR` 產生

自行建立 `RequestIR`，即可完全略過 `normalize`：

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

## 8. 錯誤處理

缺少輸入、產生器未知或參照無法解析時，`generate()` 會擲回錯誤。處理不受信任的輸入時，請務必攔截錯誤：

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

可能的錯誤訊息包括 `Unsupported generator: ...`，以及 `Path not found: ...` / `Operation not found: METHOD /path`。

## 9. `$ref` 寬容模式

文件可能包含失效或循環參照時，傳入 `softRefMode: true` 可在部分解析的情況下繼續處理，而不擲回錯誤：

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
