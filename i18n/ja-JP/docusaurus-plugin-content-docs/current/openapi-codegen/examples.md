---
sidebar_position: 5
title: "使用例"
description: "@powerduck/openapi-codegen の実例：JavaScript fetch、Python requests、cURL、独自ジェネレーター、プラグイン、RequestIR の直接利用。"
---

# 使用例

`@powerduck/openapi-codegen` の実用例です。すべての例で、解析済みの OpenAPI ドキュメントオブジェクト `document` があるものとします。

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

ほかの JavaScript クライアントは `axios`、`ofetch`、`jquery`、`xhr` です。サーバー側の Node では `node/fetch`、`node/axios`、`node/ofetch`、`node/undici` を使います。

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

ほかの Python クライアントは `aiohttp`、`http-client`、`httpx-sync`、`httpx-async` です。

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

ほかの shell クライアントは `wget` と `httpie` です。`multipart/form-data` のアップロードでは、`shell/wget` より `shell/curl` または `shell/httpie` を推奨します。

## 4. ジェネレーターを探して選ぶ

`list()` で利用可能なものを調べ、選んだ言語とクライアントの組み合わせで生成します。

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

## 5. 独自のジェネレーターを登録する

`Generator` インターフェースを実装し、`register` を呼びます。

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

## 6. プラグインを使う

プラグインは `use()` を通じて 1 つ以上のジェネレーター登録をまとめます。

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

## 7. `RequestIR` から直接生成する

自分で `RequestIR` を構築し、`normalize` を完全に省略できます。

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

## 8. エラー処理

`generate()` は入力の欠落、不明なジェネレーター、未解決の参照でエラーをスローします。信頼できない入力を処理する際は必ず捕捉してください。

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

想定されるエラーは `Unsupported generator: ...`、`Path not found: ...`、`Operation not found: METHOD /path` などです。

## 9. `$ref` の寛容モード

壊れた参照や循環参照を含む可能性がある場合は、`softRefMode: true` を渡すと、エラーをスローせず部分的な結果で処理を続けます。

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
