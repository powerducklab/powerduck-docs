---
sidebar_position: 5
title: "使用例"
description: "公開 API を使った実行可能な実用例です"
---

# 使用例

公開 API を使った実行可能な実用例です。変換関数は非同期なので `await` を使用してください。変換は入力をローカルで解析するだけで、記録された HTTP リクエストは送信しません。

---

## 1. 基本的な curl コマンド

単一の curl コマンドを変換し、生成されたドキュメントを確認します。

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

成功した場合も診断情報が返されます。

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. 複数の curl コマンド（一括変換）

コマンドの配列、または複数コマンドを含む文字列を渡します。メソッドとパスが同じリクエストはマージされ、スキーマは構造に基づいて統合されます。

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

### ブラウザーの「すべて cURL としてコピー」の出力

ブロック全体をそのまま貼り付けられます。[`splitCurlCommands`](./api-reference.md#splitcurlcommands) が引用符、行継続、プロンプト、`curl.exe` を処理します。

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman Collection

コレクションオブジェクトを変換します。入れ子のフォルダー、認証の継承、テストスクリプトも反映されます。

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

JSON 文字列も使用できます。

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. パスパラメーターの推論

`inferPathParameters` が有効な場合（デフォルト）、リクエストはメソッド、オリジン、パスの形状でグループ化されます。グループに `pathParameterMinSamples` 件以上のリクエストがあり、値に変化があり、**すべての**値が識別子らしい場合にのみ、そのセグメントがテンプレート化されます。識別子は数字、UUID、ULID、8 文字以上の 16 進文字列です。

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

パラメーター名は直前にある最も近い静的セグメントを単数形とキャメルケースに変換して生成します。

| パスパターン | パラメーター名 |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

同じパス内で名前が重複すると数値の接尾辞が付きます（`userId`、`userId2`）。

元のパスセグメントを維持するには推論を無効にします。

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. カスタムアダプター

[`SourceAdapter`](./api-reference.md) を実装すると HAR、HTTPie、Insomnia などの入力元を追加できます。その後 `XToOpenApi` に登録します。

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

## 6. エラー処理と厳格モード

問題は `result.diagnostics` に集約されます。`strict: true` ではエラー重大度の診断が [`ConversionError`](./api-reference.md#conversionerror) をスローしますが、警告だけではスローしません。無効なオプションや不明なアダプター ID でも例外が発生する場合があります。

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

現在のサイズチェックは、文字列または配列内の文字列要素の合計が JavaScript の文字列コード単位で 10 × 1024 × 1024 を超えると、`strict` に関係なく `ConversionError` をスローします。UTF-8 のバイト制限ではなく、解析済みオブジェクトのサイズも測定しません。信頼できない入力を受け入れる前に、独自のバイト数制限を適用してください。

---

## 次のステップ

- [API リファレンス](./api-reference.md)：オプションのデフォルト値と診断コード。
- [クイックスタート](./quickstart.md)：初めての一連の変換。
