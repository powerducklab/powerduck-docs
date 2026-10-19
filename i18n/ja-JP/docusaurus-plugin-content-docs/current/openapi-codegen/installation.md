---
sidebar_position: 2
title: "インストール"
description: "npm、yarn、pnpm で @powerduck/openapi-codegen をインストールし、Node.js またはブラウザーで利用します。Node.js 22.12.0 以降が必要です。"
---

# インストール

## 要件

- Node.js での利用には **Node.js** `>= 22.12.0` が必要です（パッケージの `engines` フィールドで指定）。
- **解析済み**の OpenAPI ドキュメントを JavaScript オブジェクトとして用意します。生の JSON/YAML 文字列は渡しません。
- ブラウザーでの利用には Fetch API を備えたモダンブラウザーが必要です。

パッケージには ESM（`dist/index.js`）と CommonJS（`dist/index.cjs`）のビルド、TypeScript 型宣言が含まれます。**実行時の依存関係はありません**。

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Node.js での利用

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

組み込みジェネレーターは**モジュールのインポート時に自動登録**されるため、`generate` は追加設定なしですぐに使えます。

## ブラウザーでの利用

ライブラリは完全にブラウザー対応で、Node.js の組み込みモジュールを使いません。ESM CDN から読み込み、直接呼び出せます。

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite、esbuild、webpack も追加設定なしで使えます。ESM ビルドはツリーシェイキングに対応しています。

## ドキュメントの渡し方

解析済みのオブジェクトを渡します。JSON の場合：

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

YAML は別の YAML パッケージで先に解析します。

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## パッケージ構成

| エントリーポイント | パス |
|-------|------|
| ESM エントリー | `dist/index.js` |
| CommonJS エントリー | `dist/index.cjs` |
| 型定義 | `dist/index.d.ts` |

CLI 実行ファイルはありません。コードからのみ使用するライブラリです。

## 次のステップ

- [クイックスタート](/docs/ja-JP/openapi-codegen/quickstart/) — 最初のコードスニペットを生成します。
- [設定](/docs/ja-JP/openapi-codegen/configuration/) — すべての生成オプションを確認します。
