---
sidebar_position: 3
title: "クイックスタート"
description: "@powerduck/x-to-openapi の基本：curl コマンドと Postman コレクションの変換、XToOpenApi での独自アダプター登録を学びます。"
---

# クイックスタート

よく使う 3 つの方法を紹介します。`curlToOpenApi`、`postmanToOpenApi` の各ヘルパーと、独自の構成に使う `XToOpenApi` クラスです。

前提条件：先にパッケージをインストールしてください。 [インストール](/docs/ja-JP/x-to-openapi/installation/)

:::note
すべての変換関数は **非同期** で、[`ConvertResult`](/docs/ja-JP/x-to-openapi/api-reference/#convertresult) を返します。必ず `await` を使ってください。
:::

## 1. curl コマンドを変換する

1 つの curl コマンドを [`curlToOpenApi`](/docs/ja-JP/x-to-openapi/api-reference/#curltoopenapi) に渡します。結果の `document` が生成された OpenAPI 3.2 オブジェクトです。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

生成されるドキュメントの抜粋です。

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

変換が成功したか確認し、診断情報を調べます。

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Postman コレクションを変換する

解析済みのコレクションオブジェクトまたは JSON 文字列を [`postmanToOpenApi`](/docs/ja-JP/x-to-openapi/api-reference/) に渡します。テストスクリプトは `x-postman-scripts` として保持されます。

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

JSON 文字列も使用できます。

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. 独自のオプションで `XToOpenApi` クラスを使う

登録済みアダプターや [`ConvertOptions`](/docs/ja-JP/x-to-openapi/api-reference/#convertoptions) を明示的に制御したい場合は、このクラスを使います。

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

### 複数のアダプターを登録し、`"auto"` を使う

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. 診断情報と厳密モード

既定では問題を [`Diagnostic`](/docs/ja-JP/x-to-openapi/api-reference/) として収集し、結果を返します。`strict: true` を指定すると、最初のエラーレベルの診断で [`ConversionError`](/docs/ja-JP/x-to-openapi/api-reference/#conversionerror) をスローします。

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

## 次のステップ

- [使用例](/docs/ja-JP/x-to-openapi/examples/) — curl の一括変換、パスパラメーターの推論、Postman 認証、独自アダプター。
- [API リファレンス](/docs/ja-JP/x-to-openapi/api-reference/) — すべてのエクスポート、オプション、診断コード。
