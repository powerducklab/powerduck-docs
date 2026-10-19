---
sidebar_position: 2
title: "インストール"
description: "@powerduck/openapi-cli をグローバル、開発依存関係として、または npx で利用します。Node.js 22.12.0 以降が必要です。"
---

# インストール

## 要件

- **Node.js**: `>= 22.12.0`（パッケージの `engines` フィールドで指定）。
- パッケージマネージャー: npm、yarn、pnpm のいずれか。

パッケージには ESM（`dist/index.js`）と CommonJS（`dist/index.cjs`）のビルド、および TypeScript 型宣言（`dist/index.d.ts`）が含まれます。追加の `@types` パッケージは不要です。

## グローバルインストール（CLI に推奨）

グローバルにインストールすると、`PATH` から `openapi-cli` 実行ファイルを呼び出せます。

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

コマンドを確認します。

```bash
openapi-cli --help
```

## プロジェクト内へのインストール（CI に推奨）

プロジェクト内でバージョンを固定し、CI が既知のリリースを使うようにします。

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

続いて、パッケージマネージャー経由でコマンドを実行します。

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## npx で一度だけ実行

事前のインストールは不要です。

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## パッケージ構成

| エントリーポイント | パス |
|-------|------|
| ESM エントリー | `dist/index.js` |
| CommonJS エントリー | `dist/index.cjs` |
| 型定義 | `dist/index.d.ts` |
| CLI エントリー（bin） | `dist/cli.js` |
| 実行ファイル名 | `openapi-cli` |

パッケージは `"type": "module"` を宣言し、サブパスは `.` と `./package.json` のみを公開します。

## コードからのインポート

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## 実行時の依存関係

公開パッケージは次のライブラリに依存します。

- `@powerduck/openapi-parser` (`^0.3.12`) — 内部 `$ref` の参照解決。
- `@powerduck/openapi-request` (`0.2.22`) — 各プロトコルのリクエスト実行。
- `commander` (`^12.1.0`) — CLI 引数の解析。
- `https-proxy-agent` (`^5.0.1`) — HTTP 通信のプロキシ対応。

## 次のステップ

- [クイックスタート](/docs/ja-JP/openapi-cli/quickstart/) — 最初のテストスイートを実行します。
- [コマンド](/docs/ja-JP/openapi-cli/commands/) — すべてのオプションを確認します。
