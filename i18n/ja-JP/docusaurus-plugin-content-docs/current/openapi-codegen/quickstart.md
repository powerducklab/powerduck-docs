---
sidebar_position: 3
title: "クイックスタート"
description: "@powerduck/openapi-codegen で実行可能なリクエスト例を生成し、利用できるジェネレーターを確認します。"
---

# クイックスタート

このガイドでは、実行可能なリクエスト例の生成方法と、利用できるジェネレーターの調べ方を説明します。

## 1. インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. ドキュメントから生成する

**解析済み**の OpenAPI ドキュメントと、対象の `path`、`method`、`language`、`client` を渡します。`generate()` はソースコードを文字列で返します。

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

CommonJS での同等のコード：

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. 利用できるジェネレーターを一覧表示する

`list()` は登録済みのすべてのジェネレーターの記述子を返します。

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

各記述子の形式は `{ language: string; client: string }` です。識別子は大文字と小文字を区別します。API リファレンスのジェネレーター一覧に記載されている値をそのまま使ってください。 [API リファレンス](/docs/ja-JP/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

コードでジェネレーターを選択することもできます。

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. 認証情報を指定する

`securityValues` で名前付きのセキュリティスキームに値を設定します。キーはドキュメント内のスキーム名と一致させてください。

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. サーバー URL を上書きする

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## エラー処理

入力が不足している場合や、ジェネレーターがサポートされていない場合、`generate()` は例外を投げます。信頼できないドキュメントを扱う際は、例外を捕捉してください。

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## 次のステップ

- [設定](/docs/ja-JP/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [使用例](/docs/ja-JP/openapi-codegen/examples/) — JavaScript fetch、Python requests、cURL、カスタムジェネレーター、プラグイン、`RequestIR` の直接利用。
- [API リファレンス](/docs/ja-JP/openapi-codegen/api-reference/) — すべてのエクスポート。
