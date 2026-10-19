---
sidebar_position: 2
title: "インストール"
description: "@powerduck/conf-patch をインストールし、Node.js 用ファイル層とブラウザー対応の ./core エントリーを使い分けます。"
---

# インストール

任意のパッケージマネージャーで `@powerduck/conf-patch` をインストールします。

## 要件

- **Node.js:** `>= 22.12.0`
- **TypeScript:** 任意です。完全な型宣言が同梱されているため、`@types/...` は不要です。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## 実行時の依存関係

conf-patch には、インストール時に自動で追加される 3 つの実行時依存関係があります。

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger の検証（`validateOpenAPISpec`、`validateOpenAPIFile`）。 |
| `jsonc-parser` | `^3.3.1` | JSON と JSONC の増分テキスト編集。 |
| `yaml` | `^2.9.0` | YAML の AST 解析と変更。 |

これらを直接操作する必要はありません。

## 2 つのエントリーポイント

パッケージは **2 つのサブパスエクスポート**を提供します。実行環境に合わせて選んでください。

### メインエントリー — `@powerduck/conf-patch`

**ファイル層**（`readConfigFile`、`writeConfigFile`、`patchConfigFile`、`setConfigValue`、`deleteConfigValue`、`withFileLock`、`releaseAllLocalLocks`）、コア層、OpenAPI 検証を含みます。Node.js と Electron で使用してください。`node:fs`、`node:path`、`node:crypto` に依存します。

### コアのサブパス — `@powerduck/conf-patch/core`

**ブラウザー対応のコア層のみ**を公開します。`patchContent`、`setContentValue`、`deleteContentValue`、アサーションヘルパー、コア型が含まれます。Node.js 依存はなく、ブラウザー、Edge Functions、Service Worker にバンドルできます。

:::tip
ブラウザー向けには必ず `@powerduck/conf-patch/core` からインポートしてください。ファイル層と `node:fs` への依存をバンドルから除外できます。
:::

## モジュール形式：CJS と ESM

パッケージは `"type": "module"` を**設定していない**ため、`.js` はデフォルトで CommonJS として扱われます。`package.json` の `exports` は `import` と `require` を対応するビルドへ明示的に解決します。

| エントリー | CJS (`require`) | ESM (`import`) | 型 |
|---|---|---|---|
| メインエントリー | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| コアのサブパス | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS（Node.js / Electron メインプロセス）

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules（新しい Node.js / ブラウザー / バンドラー）

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## インストールの確認

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## 次のステップ

- [クイックスタート](/docs/ja-JP/conf-patch/quickstart/) — ブラウザーで文字列を、ディスク上でファイルを更新します。
- [API リファレンス](/docs/ja-JP/conf-patch/api-reference/) — すべてのエクスポート、型、オプション。
