---
sidebar_position: 2
title: "インストール"
description: "npm、yarn、pnpm またはグローバルで @powerduck/openapi-mcp-server をインストールします。openapi-mcp CLI、./server サブパス、依存関係を解説。Node.js 22.12.0 以降が必要です。"
---

# インストール

## 要件

- **Node.js `>=22.12.0`**（`engines` で指定）。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

パッケージは `openapi-mcp` 実行ファイルを登録します。

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI が提供するコマンドは `serve` のみです（[クイックスタート](/docs/ja-JP/openapi-mcp-server/quickstart/)を参照）。

## ESM / CommonJS

両方のビルド形式に型宣言が含まれます。追加の `@types/*` は不要です。

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## サブパスのエクスポート

| インポート | 内容 |
| --- | --- |
| `@powerduck/openapi-mcp-server` | コアライブラリ: 仕様の読み込み、ツール・プロンプト・リソースの生成、リクエスト実行、MCP サーバーの構築、stdio および HTTP トランスポート。 |
| `@powerduck/openapi-mcp-server/server` | 管理用 HTTP サーバーと認証ミドルウェア（`startAdminServer`、`createAuthMiddleware`）。 |

## 実行時の依存関係

次の依存関係はパッケージとともに自動インストールされます。

- `@modelcontextprotocol/sdk` — MCP プロトコルの実装。
- `@powerduck/openapi-parser` — OpenAPI の検証、参照解決、アップグレード。
- `express` と `cors` — 管理用 HTTP サーバーと CORS。
- `axios` — ツール実行時に上流サービスへ接続する HTTP クライアント。
- `commander` — CLI フレームワーク。
- `js-yaml` — YAML の解析。
- `multer` — 仕様のアップロード処理。
- `terser` — 組み込み Web UI アセットの圧縮。

## 動作確認

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## 次のステップ

- [クイックスタート](/docs/ja-JP/openapi-mcp-server/quickstart/)
- [設定](/docs/ja-JP/openapi-mcp-server/configuration/)
