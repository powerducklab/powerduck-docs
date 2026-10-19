---
sidebar_position: 5
title: "範例"
description: "以公開 API 為基礎的實用可執行範例"
---

# 範例

以公開 API 為基礎的實用可執行範例。轉換函式為非同步，請使用 `await`。轉換只會在本機解析輸入，不會傳送其中記錄的 HTTP 請求。

---

## 1. 基本 curl 命令

轉換單一 curl 命令並檢視產生的文件。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

即使轉換成功，也會傳回診斷資訊：

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. 多個 curl 命令（批次）

傳入命令陣列或包含多個命令的字串。方法與路徑相同的請求會合併，Schema 則按結構合併。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### 瀏覽器「全部複製為 cURL」的輸出

可一次貼上整段內容。[`splitCurlCommands`](./api-reference.md#splitcurlcommands) 會處理引號、接續行、提示字元和 `curl.exe`。

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman Collection

轉換集合物件，保留巢狀資料夾、驗證繼承與測試指令碼。

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

也支援 JSON 字串：

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. 路徑參數推斷

啟用 `inferPathParameters`（預設開啟）後，請求會依方法、來源及路徑結構分組。只有當組內至少有 `pathParameterMinSamples` 個請求、對應路徑區段的值有所變化，且**每個**值都像識別碼時，才會將該區段範本化。識別碼包括純數字、UUID、ULID，以及至少 8 位的十六進位字串。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

參數名稱取自最近的前置靜態路徑區段，轉為單數及駝峰形式：

| 路徑模式 | 參數名稱 |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

同一路徑中的重複名稱會加上數字後綴（`userId`、`userId2`）。

關閉推斷即可保留原始路徑區段：

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. 自訂介接器

實作 [`SourceAdapter`](./api-reference.md) 即可新增來源，例如 HAR、HTTPie、Insomnia；再將其註冊到 `XToOpenApi`。

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. 錯誤處理與嚴格模式

問題會彙整到 `result.diagnostics`。設定 `strict: true` 時，錯誤層級的診斷會拋出 [`ConversionError`](./api-reference.md#conversionerror)，只有警告則不會。無效選項和未知介接器 ID 也可能拋出例外。

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

目前的大小檢查在字串長度或陣列內字串元素的總長度超過 10 × 1024 × 1024 個 JavaScript 字串碼元時拋出 `ConversionError`，不受 `strict` 影響。這不是 UTF-8 位元組限制，也不會測量已解析物件的大小；接受不可信的輸入前，請自行實施位元組限制。

---

## 下一步

- [API 參考](./api-reference.md)——選項預設值與診斷代碼。
- [快速入門](./quickstart.md)——完成首次端對端轉換。
