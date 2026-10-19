---
sidebar_position: 1
title: "@powerduck/openapi-request の概要"
description: "@powerduck/openapi-request は、OpenAPI 3.2 に対応したコレクションデバッガーとリクエスト実行ライブラリです。OpenAPI 文書からリクエストを組み立てて送信し、ストリーミング応答を識別して、実際の応答に基づく更新済み文書を生成できます。コンパクトなインターフェースで 6 種類の通信プロトコルを扱えます。"
---

# @powerduck/openapi-request の概要

`@powerduck/openapi-request` は、OpenAPI 3.2 に対応したコレクションデバッガーとリクエスト実行ライブラリです。OpenAPI 文書からリクエストを組み立てて送信し、ストリーミング応答を識別して、実際の応答に基づく更新済み文書を生成できます。コンパクトなインターフェースで 6 種類の通信プロトコルを扱えます。

- **パッケージ名：** `@powerduck/openapi-request`
- **バージョン：** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **ライセンス：** MIT
- **モジュール形式：** 型宣言を同梱した ESM と CommonJS の両ビルドを提供します。

## 用途

このライブラリは、同じ文書を基準として次の 3 つの用途に対応します。

- **GUI 向けクライアント** — `createClient()` は、`prepare()`、`send()`、`connect()`、`discover()`、`writeback()` を持つオブジェクトを返します。各メソッドは、グラフィカルなリクエストエディターの操作手順に対応しています。
- **スクリプトで操作するデバッガー** — `createDebugger()` は、自動化、スクリプト、CI に使える `send()`、`sendMany()`、`toCollection()` を持つ `ProtoKit` を返します。
- **手動で管理する長時間セッション** — `createManualSession()` は、接続開始・送信・終了とイベントストリームを備えた双方向セッションオブジェクトを返します。WebSocket、MCP、gRPC で構造が共通のため、同じ画面で 3 種類を扱えます。

## プロトコルアダプター

コアは特定のトランスポートに依存しません。各プロトコルの動作は、`AdapterRegistry` に登録したアダプターが提供します。

- **HTTP / SSE** — 標準で対応しています。通常の JSON リクエストと Server-Sent Events のストリームを、宣言されたコンテンツタイプまたは実際の応答ヘッダーから自動判定します。
- **WebSocket** — 共通のイベント形式で、テキストとバイナリの双方向セッションを扱います。
- **gRPC** — `.proto` ファイルまたはサーバーリフレクションを使い、単項、サーバーストリーミング、クライアントストリーミング、双方向ストリーミングを呼び出します。
- **MCP** — Streamable HTTP または stdio 経由で Model Context Protocol のツールを呼び出します。
- **GraphQL** — イントロスペクション、操作の生成と実行に対応します。

## 主な機能

- **OpenAPI 3.2 コレクションモデル** — `operationId` または `method`+`path` で操作を特定し、パラメーター、リクエストボディ、例からリクエストを組み立てます。
- **ストリーミング検出** — `isStreamingOperation()`、`isSseContentType()`、`isStreamingContentType()` は宣言されたコンテンツタイプで応答を分類し、`probeStreamingResponse()` は実際の応答ヘッダーを調べます。
- **応答の書き戻し** — `inferSchema()`、`mergeSchema()`、`toResponseObject()`、`writeBackResponse()` は応答スキーマを推定し、更新済み文書を返します。既定では、書き戻しが成功すると `send()` はその文書を `patchedSpec` として返します。`writeBack: false` を設定すると無効になります。入力文書は変更されず、ファイルも自動保存されません。結果を保存する前に、`writeBackSkippedReason` と `writeBackWarnings` を確認してください。
- **スキーマ補助機能** — `sampleFromSchema()` はスキーマからサンプルデータを生成します。
- **大きな依存パッケージの遅延読み込み** — gRPC（`@grpc/grpc-js`、`@grpc/proto-loader`）と MCP（`@modelcontextprotocol/sdk`）は初回使用時に読み込まれるため、HTTP のみを使う場合は読み込みコストがかかりません。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## クイックスタート

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## 次のステップ

- [インストール](./installation.md) — パッケージ構成、サブパスのエクスポート、プロトコル機能のピア依存関係。
- [クイックスタート](./quickstart.md) — 最初のリクエスト、デバッガーの実行、手動セッション。
- [設定](./configuration.md) — `CreateClientOptions`、`DebuggerOptions`、プロトコル別の設定。
- [API リファレンス](./api-reference.md) — 機能別にまとめた全エクスポート。
- [使用例](./examples.md) — HTTP、SSE、WebSocket、GraphQL、MCP、gRPC の実行可能な例。

## ライセンス

MIT.
