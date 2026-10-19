---
sidebar_position: 1
title: "概要"
description: "OpenAPI から MCP サービスを生成。ツール、プロンプト、リソース、Web 管理画面、stdio、HTTP、openapi-mcp CLI を提供します。"
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — 概要

`@powerduck/openapi-mcp-server` は OpenAPI ドキュメントを実行可能な MCP（Model Context Protocol）サービスに変換します。操作から**ツール**、API のメタデータと操作から**プロンプト**、API カタログから**リソース**を生成し、MCP プロトコルで公開します。Web 管理画面も組み込まれています。

- **パッケージ名:** `@powerduck/openapi-mcp-server`
- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **ライセンス:** MIT
- **Node の要件:** `>=22.12.0`
- **CLI コマンド:** `openapi-mcp`
- **モジュール形式:** ESM と CommonJS の両方のビルドを提供し、型宣言を同梱しています。

検証と参照の解決には `@powerduck/openapi-parser`、プロトコルには `@modelcontextprotocol/sdk` を使用します。

## 生成されるもの

- **Tools** — OpenAPI の操作ごとに MCP ツールを生成します。パラメーターのシリアライズ（path/query/header/cookie のスタイルと explode ルール）、リクエストボディのエンコード（JSON、form-urlencoded、multipart、テキスト、バイナリ）、MCP ツールのアノテーション（`readOnlyHint`、`destructiveHint`、`idempotentHint`）に対応します。
- **Prompts** — 全体用のプロンプト（`spec_overview`、`integration_guardrails`）と操作別のプロンプト（`explain_*`、`plan_*`、`sample_*`）を生成します。
- **Resources** — `openapi://spec/summary`、`openapi://catalog/tools`、`openapi://spec/document` などの固定カタログリソースを提供します。

## トランスポート

- **stdio** — `startStdioServer()` は、Claude Desktop やエディター統合など、ローカルの MCP クライアントに 1 つのドキュメントを提供します。
- **HTTP** — `attachMcpRoutes(app, options)` は Express アプリの `/mcp` に Streamable HTTP をマウントし、必要に応じて `/sse` に従来の SSE を追加します。オプションでセッション数の上限、アイドルタイムアウト、CORS、DNS リバインディング対策を設定できます。`startAdminServer()` は管理画面を追加し、デフォルトのセッション上限を使用します。`attachSseRoutes()` は位置引数を取る非推奨のラッパーとして残っています。

## 管理サーバー

`startAdminServer()` は Express アプリを起動し、次の機能を提供します。

- 仕様のアップロードや貼り付け、ツール・プロンプト・リソースの確認、実行中のサービスとリクエストログの表示ができる Web 管理画面。
- MCP の HTTP トランスポート。
- API キー認証、機密ヘッダーをマスキングしたリクエストログ、任意の状態永続化。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## クイックスタート

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## 次のステップ

- [インストール](../installation/) — npm/yarn/pnpm、グローバルインストール、`./server` サブパス、依存関係。
- [クイックスタート](../quickstart/) — CLI とプログラムからの使用方法。
- [設定](../configuration/) — `ServerConfig` の全設定。
- [API リファレンス](../api-reference/) — すべてのエクスポートと CLI コマンド。
- [使用例](../examples/) — 実践的な使用例。

## ライセンス

MIT.
