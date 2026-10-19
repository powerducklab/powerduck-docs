---
sidebar_position: 5
title: "API リファレンス"
description: "@powerduck/openapi-request の主要な連携 API のリファレンスです"
---

# API リファレンス

`@powerduck/openapi-request` の主要な連携 API のリファレンスです。表はインターフェースの概要を示します。オーバーロードと省略可能な引数の全定義は、パッケージの TypeScript 型宣言を参照してください。メインエントリーとプロトコル別サブパスでは、エクスポートされる内容が異なります。

## コア API

### `createClient(options?): ProtoClient`

UI 向けのクライアントを作成します。`options` 引数は省略可能です。

**引数：**

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `options` | `CreateClientOptions` | 省略可能な設定 |
| `options.writeBack` | `WriteBackOptions` | レスポンスを仕様へマージする方法を制御 |
| `options.response` | `ToResponseOptions` | レスポンスオブジェクトの正規化を制御 |

**戻り値：** 次のメソッドを持つ `ProtoClient`：

| メソッド | シグネチャ | 説明 |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | リクエストを計画し、プロトコル、表示モード、ストリーム種別を返します |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | リクエストを実行します |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | 一括実行し、対象ごとの結果を返します。失敗しても他の結果は失われません |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | 未接続の websocket/mcp/grpc セッションを作成します。接続には `open()` を呼び出します |
| `discover` | `(discoverOptions) => Promise<any>` | MCP と gRPC の機能を検出します |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | 取得したレスポンスをドキュメントにマージします |
| `dispose` | `() => void` | 現在は何も処理しません。セッションは呼び出し側で閉じてください |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | fetch リクエストを実行してレスポンスを分類します。返されたレスポンス本文は読み取るかキャンセルしてください |

**例：**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

自動化、スクリプト、CI 向けのスクリプト対応デバッガーを作成します。

**引数：**

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `config` | `DebuggerOptions` | 省略可能な設定 |
| `config.adapters` | `ProtocolAdapter[]` | カスタムアダプター一覧（デフォルトを置き換えます） |
| `config.extraAdapters` | `ProtocolAdapter[]` | デフォルトに追加するアダプター |
| `config.writeBack` | `WriteBackOptions` | 書き戻しオプション |
| `config.response` | `ToResponseOptions` | レスポンス正規化オプション |
| `config.writeBackTruncated` | `boolean` | 切り詰められたストリームから推論したスキーマを書き戻します（デフォルト：true） |

**戻り値：** `prepare`、`send`、`sendMany`、`toCollection` などを持つ `ProtoKit`。

**例：**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

WebSocket、MCP、gRPC の長時間維持する双方向セッションを作成します。ファクトリーでは I/O を行わず、`open()` で接続します。

**引数：**

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | 使用するプロトコル |
| `options.url` | `string` | WebSocket 接続 URL |
| `options.endpoint` | `string` | MCP Streamable HTTP エンドポイント |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP のトランスポート。デフォルトは Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio 用のローカル実行ファイルと引数 |
| `options.address`, `options.service`, `options.method` | `string` | gRPC のアドレス、完全修飾サービス名、メソッド |

gRPC では、`protoPaths` または `reflection` で記述子の取得元も指定します。プロトコル別のオプションは[設定](./configuration.md)を参照してください。

**戻り値：** `open()`、`send()`、`close()`、`onEvent()`、`waitForClose()`、`events`、`state` を持つセッション。`onEvent()` は `unsubscribe()` を持つ購読オブジェクトを返します。

**例：**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

`ProtocolAdapter` インスタンスのレジストリーです。新規レジストリーは空ですが、`createDebugger()` はカスタム一覧で置き換えない限り、組み込みの HTTP、WebSocket、gRPC、MCP、GraphQL アダプターを登録します。`register()`、`unregister()`、`get()`、`list()`、`rank()`、`resolve()` で選択を管理できます。

### `ProtoKitError`

デバッガーやコア処理でスローされる型付きエラーです。`instanceof ProtoKitError` でライブラリのエラーと予期しない障害を区別できます。

## コアの型

### `SendOptions`

`prepare()` と `send()` の主要な入力オブジェクトです。仕様、対象、値、およびリクエスト単位の設定を渡します。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | はい | 完全な OpenAPI 3.2 文書 |
| `target` | `OperationTarget` | はい | 操作の識別子。後述を参照 |
| `values` | `RequestValues` | いいえ | path/query/header/cookie/body の具体的な値 |
| `serverUrl` | `string` | いいえ | `spec.servers[0].url` を上書き |
| `serverVariables` | `Record<string, string>` | いいえ | サーバー URL テンプレート変数 |
| `variables` | `Record<string, string>` | いいえ | `{{name}}` で参照する環境変数 |
| `globals` | `Record<string, string>` | いいえ | Postman 形式のグローバル変数 |
| `localVariables` | `Record<string, string>` | いいえ | ローカル変数 |
| `collectionVariables` | `Record<string, string>` | いいえ | コレクション変数 |
| `auth` | `AuthConfig` | いいえ | 認証設定 |
| `scripts` | `ScriptConfig` | いいえ | リクエスト前とテストのスクリプト |
| `runner` | `RuntimeRunOptions` | いいえ | postman-runtime の全オプションを渡す。最優先で適用 |
| `websocket` | `WebSocketOptions` | いいえ | WebSocket 固有のオプション |
| `graphql` | `GraphQLOptions` | いいえ | GraphQL 固有のオプション |
| `mcp` | `McpOptions` | いいえ | MCP 固有のオプション |
| `grpc` | `any` | いいえ | gRPC 固有のオプション |
| `timeout` | `number` | いいえ | リクエスト単位のタイムアウト（ミリ秒）。`runner.timeout.request` の簡略指定 |

`SendOptions` では、以下の実行・ストリーミング制御も指定できます。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `fetch` | `typeof fetch` | 対応する箇所で使う、ホスト提供の分離された fetch トランスポート。HTTP/SSE は引き続き postman-runtime を使用。 |
| `writeBack` | `boolean` | `false` にすると `patchedSpec` は未定義のままですが、`responseFragment` は生成します。 |
| `signal` | `AbortSignal` | 実行またはサンプリングを中止します。部分的な結果が返る場合があります。 |
| `maxEvents` | `number` | 保持するストリームイベントの最大数。 |
| `maxStreamMs` | `number` | ストリームのサンプリング時間上限（ミリ秒）。 |
| `maxResponseSize` | `number` | レスポンスのバイト数上限。 |
| `maxBufferChars` | `number` | イベント境界までの SSE パーサーバッファー上限。既定値は `4194304` 文字。 |
| `maxEventChars` | `number` | SSE イベントごとに保持するデータの上限。既定値は `1048576` 文字。 |
| `inheritEventId` | `boolean` | ID がない場合は直前の SSE イベント ID を継承。既定値は `true`。厳密なスキーマ推論には `false` を指定。 |
| `onEvent` | `(event: StreamEvent) => void` | ストリームイベントを受信。 |
| `onConsole` | `(log: ConsoleLog) => void` | スクリプトのコンソール出力を受信。 |
| `onAssertion` | `(assertion: AssertionResult) => void` | アサーション結果を受信。 |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | 早期の HTTP/SSE ヘッダーと `streaming` 判定を確認。 |
| `onOpen` | `(info) => void` | WebSocket 接続の URL、プロトコル、ヘッダーを受信。 |

制限の解釈はプロトコルアダプターによって異なる場合があります。UI コールバックは軽量に保ってください。コールバックの例外は実行層で捕捉します。HTTP リクエスターには `runner.requester` を使い、その `maxResponseSize` を指定する場合はゼロではなく正の値にしてください。

### `OperationTarget`

単一の操作を識別します。`operationId` または `method` + `path` のどちらかを推奨します。両方あれば `operationId` が優先されます。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `operationId` | `string` | 別の検索キー。パスとメソッドより優先 |
| `method` | `string` | HTTP メソッド。大文字・小文字は区別しない。`path` が必要。 |
| `path` | `string` | `/users/{id}` などのテンプレートパス。`method` が必要。 |

### `RequestValues`

生成するリクエストに挿入する具体的な値。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | パスパラメーター値 |
| `query` | `Record<string, unknown>` | クエリパラメーター値 |
| `header` | `Record<string, unknown>` | ヘッダー値 |
| `cookie` | `Record<string, unknown>` | Cookie 値 |
| `querystring` | `string` | 事前にエンコードした生のクエリ文字列。OpenAPI 3.2 の `querystring` 位置で使用 |
| `body` | `unknown` | リクエスト本文 |
| `contentType` | `string` | 複数のメディアタイプが宣言されている場合に使用タイプを指定 |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | 認証タイプ |
| `token` | `string` | `type: "bearer"` 用の Bearer トークン |
| `username` | `string` | `type: "basic"` 用の Basic 認証ユーザー名 |
| `password` | `string` | `type: "basic"` 用の Basic 認証パスワード |
| `key` | `string` | `type: "apikey"` 用の API キー名 |
| `value` | `string` | `type: "apikey"` 用の API キー値 |
| `in` | `"header" \| "query"` | `type: "apikey"` 用の API キー位置 |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

高度な認証タイプには `digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap`、`edgegrid` があります。HTTP/SSE/GraphQL 向けの Postman 認証ヘルパーフィールドは `parameters: Record<string, string | boolean | number>` で渡します。任意の `oauth2: OAuth2FlowConfig` は OAuth 2.0 のトークン取得・更新を有効にします。すべての認証ヘルパーが全プロトコルに対応するとは限りません。

### `PreparedRequest`

`createClient().prepare()` が返します。デバッガーの計画結果は異なり、`createDebugger().prepare()` は `located`、`adapter`、`plan` を含む `PlanResult` を返します。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `protocol` | `string` | 解決されたプロトコル（http、websocket、grpc、graphql、mcp） |
| `transport` | `string` | 解決されたトランスポート |
| `target` | `OperationTarget` | 元の対象 |
| `operation` | `any` | 解決された OpenAPI 操作オブジェクト |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | ストリーム分類（後述） |
| `stream.expected` | `boolean` | ストリーミングが想定されるかどうか |
| `openapi.extensions` | `Record<string, unknown>` | 解決された OpenAPI 拡張 |
| `warnings` | `string[]` | 計画中に発生した警告 |

### `StreamKind`

ストリーム種別の詳細な分類：`"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI ヘルパー

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | `OperationTarget` から操作を解決します |
| `inferSchema` | `(value) => Schema` | 単一の観測値から JSON Schema を推論します |
| `inferSchemaFromMany` | `(values) => Schema` | 複数の観測値をカバーするスキーマを推論します |
| `mergeSchema` | `(a, b) => Schema` | 推論された 2 つのスキーマをマージします（和集合または組み合わせ） |
| `sampleFromSchema` | `(schema) => unknown` | スキーマに対応する実用的なサンプル値を生成します |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | 観測結果から OpenAPI レスポンスオブジェクトを作成します |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | 観測したレスポンスをドキュメントにマージします |

エクスポートされる型：`LocatedOperation`、`WriteBackOptions`、`ToResponseOptions`。

## HTTP / SSE

以下の名前はメインエントリーから利用できます。`@powerduck/openapi-request/http` サブパスは `HttpAdapter`、`SseParser`、`buildCollection`、`buildEnvironment`、`resolveServerUrl`、`buildRunOptions`、`runWithPostman` をエクスポートします。検出用ヘルパーと `BUILTIN_CAPTURE_TEST` はメインエントリーからインポートしてください。

| エクスポート | 説明 |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS のデフォルトプロトコルアダプター |
| `SseParser` | SSE バイトストリームを構造化イベントに変換するストリーミングパーサー |
| `isStreamingOperation` | 宣言されたコンテンツタイプから操作がストリーミングかどうかを判定します |
| `isSseContentType` | コンテンツタイプが SSE を示すか確認します |
| `isStreamingContentType` | コンテンツタイプがストリーミングを示すか確認します |
| `acceptHeaderFor` | 操作に適した Accept ヘッダーを生成します |
| `probeStreamingResponse` | fetch リクエストを実行してレスポンスを分類します。返されたレスポンス本文は読み取るかキャンセルしてください |
| `BUILTIN_CAPTURE_TEST` | 最後のレスポンスを記録する組み込みの Postman テストスクリプト |

## WebSocket

`@powerduck/openapi-request/ws` からインポートします。

| エクスポート | 説明 |
| --- | --- |
| `WebSocketAdapter` | WebSocket 用のプロトコルアダプター |
| `createWsManualSession` | 双方向の手動 WebSocket セッションを作成します。別名は `runWebSocketSession`、`wsManualSession` です |

## GraphQL

`@powerduck/openapi-request/graphql` からインポートします。

| エクスポート | 説明 |
| --- | --- |
| `GraphQLAdapter` | GraphQL 用のプロトコルアダプター |
| `resolveGraphQLConfig` | 操作から GraphQL 設定を解決します |
| `runGraphQL` | GraphQL 操作を実行します |
| `introspectSchema` | GraphQL エンドポイントのスキーマをイントロスペクションで取得します |
| `INTROSPECTION_QUERY` | 標準の GraphQL イントロスペクションクエリ |
| `generateOperation` | 取得した GraphQL スキーマとフィールドからクエリドキュメントを生成します |
| `generateAllOperations` | 取得した GraphQL スキーマの各フィールド向けにクエリドキュメントを生成します |
| `writeGraphQLOperations` | 生成した GraphQL 操作を仕様書に書き戻します |
| `discoverAndWriteGraphQLSchema` | GraphQL スキーマを検出して仕様書に書き込みます |

## MCP（Model Context Protocol）

以下の大部分は `@powerduck/openapi-request/mcp` から利用できます。`initializeMcpSession` はメインエントリーからインポートしてください。サブパスでの名前は `initializeSession` です。サブパスは `runMcp`、`createMcpSessionCore`、`createMcpStdioConnection` も公開します。

| エクスポート | 説明 |
| --- | --- |
| `McpAdapter` | MCP 用のプロトコルアダプター |
| `createMcpManualSession` | 手動 MCP セッションを作成します。別名は `mcpManualSession` です |
| `createMcpStdioSession` | stdio 経由の MCP セッションを作成します |
| `runMcpManualSession` | 非推奨です。`createMcpManualSession` を使用してください |
| `resolveMcpConfig` | 操作から MCP 設定を解決します |
| `initializeMcpSession` | MCP セッションを初期化します（`initializeSession` の別名） |
| `discoverMcpCapabilities` | MCP サーバーの機能を検出します |
| `MCP_PROTOCOL_VERSION` | サポートする MCP プロトコルのバージョン |
| `generateMcpCall` | 単一の MCP ツール呼び出しを生成します |
| `generateAllMcpCalls` | すべての MCP ツール呼び出しを生成します |
| `writeMcpOperations` | MCP 操作を仕様書に書き戻します |
| `discoverAndWriteMcpCapabilities` | MCP の機能を検出して仕様書に書き込みます |
| `createHttpMcpTransport` | MCP 用 HTTP トランスポートを作成します |
| `createStdioMcpTransport` | MCP 用 stdio トランスポートを作成します |

## gRPC

低水準の検出、呼び出し、記述子ヘルパーは `@powerduck/openapi-request/grpc` からインポートします。`GrpcProtocolAdapter`、`createGrpcManualSession`、`grpcManualSession`、`grpcDiscover`、`discoverGrpc` はメインエントリーからインポートしてください。サブパスの検出関数名は `discover` です。サブパスには `discoverFromCatalog`、`describeMethod`、`describeFromCatalog` もあり、メソッドごとにリフレクションを繰り返さずにカタログを再利用できます。

| エクスポート | 説明 |
| --- | --- |
| `GrpcProtocolAdapter` | OpenAPI 向け gRPC プロトコルアダプター |
| `GrpcAdapter` | 低水準の gRPC アダプター |
| `grpcDiscover` / `discoverGrpc` | gRPC サービスとメソッドを検出します |
| `createGrpcManualSession` / `grpcManualSession` | 手動 gRPC セッションを作成します |
| `grpcCall` | 単一の gRPC 呼び出しを実行します |
| `resolveMethod` | gRPC メソッド記述子を解決します |
| `buildMessageTemplate` | 記述子からメッセージテンプレートを作成します |
| `buildCatalog` | サービスとメソッドのカタログを作成します |
| `LOADER_OPTIONS` | デフォルトの proto ローダー設定 |
| `scanProtoFiles` | ディレクトリから proto ファイルを検索します |
| `deriveIncludeDirsDetailed` | proto ファイルのパスからインクルードディレクトリを導出します |
| `fetchDescriptorSet` | gRPC リフレクションで記述子セットを取得します |
| `fetchFullDescriptorSet` | すべての依存関係を含む完全な記述子セットを取得します |
| `listServices` | 記述子セット内のサービスを一覧表示します |
| `listServicesDetailed` | サービスとメソッドの詳細を一覧表示します |
| `serializeDescriptorSet` | 記述子セットをバイト列にシリアライズします |
| `decodeFileDescriptorProto` | 単一のファイル記述子 proto をデコードします |
| `decodeFileDescriptorSet` | ファイル記述子セットをデコードします |
| `buildCredentials` | gRPC 認証情報を構築します（同期） |
| `buildCredentialsAsync` | gRPC 認証情報を構築します（非同期） |
| `buildCredentialsChecked` | 検証付きで認証情報を構築します（同期） |
| `buildCredentialsCheckedAsync` | 検証付きで認証情報を構築します（非同期） |
| `loadGrpc` | `@grpc/grpc-js` パッケージを動的に読み込みます |
| `isGrpcAvailable` | gRPC の依存パッケージが利用可能か確認します |
| `requireCapability` | 指定した gRPC 機能を要求し、利用不可ならエラーをスローします |

メインエントリーは型エイリアス `GrpcDiscoveryResult`、`GrpcDiscoveredMethod`、`GrpcDiscoveredService` をエクスポートします。gRPC サブパスでは、それぞれ `DiscoveryResult`、`DiscoveredMethod`、`DiscoveredService` という名前です。

エラー型：`ReflectionProtocolError`、`ReflectionUnavailableError`、`DescriptorDecodeError`、`GrpcDependencyBrokenError`、`GrpcDependencyMissingError`。

## その他のユーティリティ

メインエントリーは OAuth 2.0 ヘルパー `resolveOAuth2Token`、`acquireOAuth2Token`、`isOAuth2TokenExpired`、`oauth2RefreshStatuses`、`authFromOAuth2Token`、クローン用の `toCloneable`、基底クラス `UnifiedSession`、gRPC 書き戻しヘルパー `writeGrpcOperations` と `discoverAndWriteGrpcOperations` もエクスポートします。

## サブパスのエクスポート

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
