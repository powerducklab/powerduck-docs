---
sidebar_position: 2
title: "インストール"
description: "npm、yarn、pnpm で @powerduck/x-to-openapi をインストールします。ESM と CommonJS に対応し、設定不要の curlToOpenApi と postmanToOpenApi を提供します。"
---

# インストール

お好みのパッケージマネージャーで `@powerduck/x-to-openapi` をインストールします。

## 要件

- **Node.js:** `>= 22.12.0`
- **TypeScript:** 任意です。完全な型定義がパッケージに含まれます。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## 実行時の依存関係

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | 標準 OpenAPI 型と出力の検証 |
| `curlconverter` | `^4.12.0` | curl コマンドを構造化されたリクエストに解析 |

どちらも自動でインストールされます。

---

## モジュール形式: ESM を基本とし CJS にも対応

パッケージは `"type": "module"` を宣言し、単一のエントリーポイントから両方のビルドを提供します。

| ビルド | 条件 | ファイル |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| 型 | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

`"sideEffects": false` を宣言しているため、ツリーシェイキングで未使用のアダプターを除去できます。

---

## 設定不要のヘルパー関数

多くの場合、必要なのは二つの関数だけです。これらは [`XToOpenApi`](/docs/ja-JP/x-to-openapi/api-reference/#xtoopenapi) を生成し、対応するアダプターを登録して `convert` を呼び出します。

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

独自のオプション、複数のアダプター、`"auto"` 検出、独自アダプターが必要な場合は、完全な [`XToOpenApi`](/docs/ja-JP/x-to-openapi/api-reference/#xtoopenapi) クラスを使用します。

---

## 動作確認

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## 次のステップ

- [クイックスタート](/docs/ja-JP/x-to-openapi/quickstart/) — curl コマンドと Postman コレクションを変換し、独自アダプターを登録します。
- [API リファレンス](/docs/ja-JP/x-to-openapi/api-reference/) — すべてのエクスポートとオプションを確認します。
