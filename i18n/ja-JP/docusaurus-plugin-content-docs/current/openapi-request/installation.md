---
sidebar_position: 2
title: "インストール"
description: "@powerduck/openapi-request をインストールし、プロトコル別サブパスと gRPC・MCP の任意パッケージを確認します。"
---

# インストール

`@powerduck/openapi-request` は ESM と CommonJS のビルド、および TypeScript 型宣言を含みます。Node.js `>= 22.12.0` が必要です。

## インストール

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

追加の `@types/*` パッケージは不要です。

## パッケージ構成とサブパスエクスポート

デフォルトのエントリーはコア API を公開します。各プロトコルには専用のサブパスもあります。

| インポート | 内容 |
|---|---|
| `@powerduck/openapi-request` | コア：`createClient`、`createDebugger`、`createManualSession`、`AdapterRegistry`、`ProtoKitError`、OpenAPI ヘルパー、型。 |
| `@powerduck/openapi-request/http` | `HttpAdapter`、`SseParser`、ストリーミング検出、HTTP コレクションと環境のビルダー（`buildCollection`、`buildEnvironment`、`resolveServerUrl`）。 |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`、`createWsManualSession`、WebSocket の設定・セッション用ヘルパー。 |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`、`GrpcAdapter`、`grpcCall`、`createGrpcManualSession` と、検出・リフレクション・記述子・カタログ・認証情報・ローダー・テンプレートの各モジュール。 |
| `@powerduck/openapi-request/mcp` | `McpAdapter`、`createMcpManualSession`、`createMcpStdioSession` と、MCP のトランスポート・設定・検出・生成モジュール。 |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`、`resolveGraphQLConfig`、`runGraphQL`、イントロスペクション、操作生成、書き戻し。 |

プロトコルのサブパスをインポートすると、その型とヘルパーだけが取り込まれ、無関係なアダプターは再エクスポートされません。

## 機能別の任意パッケージ

gRPC と MCP は依存関係が大きいため、**初回使用時に遅延読み込み**されます。HTTP のみならインストール不要です。必要なプロトコルのパッケージだけを追加してください。

- **gRPC** には `@grpc/grpc-js` と `@grpc/proto-loader` が必要です。サーバーリフレクションには `loadFileDescriptorSetFromBuffer` を使うため `@grpc/proto-loader >= 0.7` が必要です。
- **MCP** には `@modelcontextprotocol/sdk` が必要です。

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

パッケージがない場合、gRPC ローダーは正確なインストールコマンドを含む `GrpcDependencyMissingError` を投げます。存在していても壊れている場合は `GrpcDependencyBrokenError` になります。

## 確認

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

インストール後、両方のインポートを解決できるようになります。

## 次のステップ

- [クイックスタート](/docs/ja-JP/openapi-request/quickstart/)
- [設定](/docs/ja-JP/openapi-request/configuration/)
