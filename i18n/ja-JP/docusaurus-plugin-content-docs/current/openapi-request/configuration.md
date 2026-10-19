---
sidebar_position: 4
title: "設定"
description: "設定は、クライアント／デバッガーのファクトリーオプション、prepare() と send() に渡す SendOptions オブジェクト、プロトコル固有のオプションの 3 層に分かれます。"
---

# 設定

設定は、クライアント／デバッガーのファクトリーオプション、`prepare()` と `send()` に渡す `SendOptions` オブジェクト、プロトコル固有のオプションの 3 層に分かれます。

## ファクトリーオプション

### `CreateClientOptions`

`createClient(options?)` に渡します。すべてのフィールドは任意です。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | レスポンスを仕様へマージする方法を制御 |
| `response` | `ToResponseOptions` | レスポンスオブジェクトの正規化を制御 |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

`createDebugger(config?)` に渡します。すべてのフィールドは任意です。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | 既定のアダプターをすべて置き換えるカスタムリスト |
| `extraAdapters` | `ProtocolAdapter[]` | 既定のレジストリに追加するアダプター |
| `writeBack` | `WriteBackOptions` | 書き戻しオプション |
| `response` | `ToResponseOptions` | レスポンス正規化オプション |
| `writeBackTruncated` | `boolean` | 途中で打ち切ったストリームから推論したスキーマを書き戻す。既定値は `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### 書き戻しと取得したサンプル

`WriteBackOptions` は `strategy`（`"merge"` または `"replace"`、既定値 `"merge"`）、`keepExistingDescription`（既定値 `true`）、`allowedStatusCodes`（空ならすべて）、`protectComponentRefs`（既定値 `true`）、`overwriteExamples`（既定値 `true`）、`requirePassingTests` に対応します。送信パイプラインではテスト結果を確認しますが、`writeBackResponse` を直接呼び出した場合は確認しません。

`ToResponseOptions` は `includeExamples`（既定値 `true`）、`maxExampleChars`（既定値 `4000`）、`maxEventPreviewChars`（既定値 `200`）に対応します。サンプル取得を無効にするか、公開前に内容を確認してください。実際のレスポンスには認証情報や個人データが含まれることがあります。

送信パイプラインは通常、変更したコピーを `patchedSpec` に返します。入力文書の変更やファイル保存は行いません。呼び出しごとに `writeBack: false` を指定すると、この処理を省略できます。ファクトリーの `writeBack` オブジェクトはマージ方法を設定し、呼び出しごとの真偽値は実行の有無を決めます。

## `SendOptions`

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

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

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

### `ScriptConfig`

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | コレクション単位のリクエスト前スクリプト |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | コレクション単位のテストスクリプト |
| `preRequest` | `ScriptSource \| ScriptSource[]` | リクエスト単位の送信前スクリプト |
| `test` | `ScriptSource \| ScriptSource[]` | リクエスト単位のテストスクリプト |
| `fromSpecExtensions` | `boolean` | 仕様から `x-postman-scripts` を読む。既定値は `true` |
| `captureLastResponse` | `boolean` | 直前のレスポンスを後続リクエストへ公開する組み込みヘルパーを追加 |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

インポートした仕様に含まれるスクリプトを実行したくない場合は `scripts.fromSpecExtensions: false` を指定してください。現在の既定値は `true` です。将来の既定値変更を前提にしないでください。

## プロトコル固有のオプション

### HTTP / SSE

HTTP が既定のアダプターです。`text/event-stream` の宣言は SSE の意図を示します。実行時にはヘッダー到着時に実際のレスポンスも分類します。`probeStreamingResponse()` は明示的に呼ぶ独立したプローブであり、毎回自動実行される前提処理ではありません。

基本的な HTTP リクエストに追加設定は不要です。postman-runtime の詳細設定には `SendOptions.runner` を使います。

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

既定の MCP 手動セッションは Streamable HTTP と `endpoint` を使います。stdio では `kind: "mcp"`、`transport: "stdio"`、ローカルの `command`、任意の `args` を渡します。セッションを開くと設定したプロセスが起動します。

### gRPC

gRPC にはアドレス、記述子の取得元（`.proto` ファイルまたはサーバーリフレクション）、完全修飾されたサービスとメソッドが必要です。

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

手動セッションのファクトリーは未接続のセッションを返します。送信前に `open()`、後処理で `close()` を呼んでください。gRPC の例には対応するローカルサーバーと proto ファイルが必要です。手動セッションのオプションは `SendOptions.grpc` と同じオブジェクトではありません。

## 完全な例

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## 次のステップ

- 全公開型は [API リファレンス](./api-reference.md)を参照
- プロトコルごとの使い方は[使用例](./examples.md)を参照
