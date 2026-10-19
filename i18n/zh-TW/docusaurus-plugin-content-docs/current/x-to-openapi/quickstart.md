---
sidebar_position: 3
title: "快速入門"
description: "快速上手 @powerduck/x-to-openapi：轉換 curl 指令與 Postman 集合，並透過 XToOpenApi 註冊自訂配接器。"
---

# 快速入門

本指南介紹三種常見用法：`curlToOpenApi` 輔助函式、`postmanToOpenApi` 輔助函式，以及用於自訂組合的 `XToOpenApi` 類別。

必要條件：請先安裝套件。 [安裝](/docs/zh-TW/x-to-openapi/installation/)

:::note
所有轉換函式都是 **非同步函式**，並傳回 [`ConvertResult`](/docs/zh-TW/x-to-openapi/api-reference/#convertresult)。呼叫時務必使用 `await`。
:::

## 1. 轉換 curl 指令

將單一 curl 指令傳入 [`curlToOpenApi`](/docs/zh-TW/x-to-openapi/api-reference/#curltoopenapi)。結果中的 `document` 即為產生的 OpenAPI 3.2 物件。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

產生的文件如下，此處為節錄：

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

檢查轉換是否成功，並查看診斷資訊：

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. 轉換 Postman 集合

將解析後的集合物件或 JSON 字串傳入 [`postmanToOpenApi`](/docs/zh-TW/x-to-openapi/api-reference/)。測試指令碼會保留為 `x-postman-scripts`。

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

也可以使用 JSON 字串：

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. 使用自訂選項搭配 `XToOpenApi` 類別

需要明確控制已註冊的配接器與 [`ConvertOptions`](/docs/zh-TW/x-to-openapi/api-reference/#convertoptions) 時，請使用此類別。

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### 註冊多個配接器並使用 `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. 診斷與嚴格模式

預設情況下，轉換程序會將問題收集為 [`Diagnostic`](/docs/zh-TW/x-to-openapi/api-reference/) 項目，並仍然傳回結果。設定 `strict: true` 後，遇到第一個錯誤等級的診斷時，會擲回 [`ConversionError`](/docs/zh-TW/x-to-openapi/api-reference/#conversionerror)。

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## 後續步驟

- [範例](/docs/zh-TW/x-to-openapi/examples/) — 批次 curl、路徑參數推斷、Postman 驗證與自訂配接器。
- [API 參考](/docs/zh-TW/x-to-openapi/api-reference/) — 所有匯出項目、選項與診斷代碼。
