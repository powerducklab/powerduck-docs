---
sidebar_position: 4
title: "設定"
description: "@powerduck/openapi-mcp-server の全設定：ServerConfig、SecurityContext、ExecutionContext、TransportMode、ソース・状態・プロトコル・ログレベル・ボディエンコードのリテラルユニオン型。"
---

# 設定

中心となる設定オブジェクトは `ServerConfig` で、`startAdminServer()` に渡します。関連するコンテキスト型はツールの実行に使用されます。

## `ServerConfig`

必須なのは `port` のみです。

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `port` | `number` | —（必須） | 待ち受ける TCP ポート。0～65535 の整数。 |
| `host` | `string` | `"127.0.0.1"` | 待ち受けインターフェース。意図しない公開を防ぐため、デフォルトはループバック。 |
| `apiKey` | `string` | undefined | 設定すると管理 API と HTTP トランスポートで要求される共有シークレット。 |
| `specPath` | `string` | undefined | 起動時に一度読み込む仕様。 |
| `baseUrlOverride` | `string` | undefined | `servers[0].url` から取得した上流のベース URL を上書きします。 |
| `upstreamHeaders` | `Record<string, string>` | undefined | すべての上流リクエストに追加するヘッダー。 |
| `requestTimeoutMs` | `number` | undefined | 上流リクエストごとのタイムアウト（ミリ秒）。 |
| `persistState` | `boolean` | `true` | 読み込んだ仕様を再起動後も保持します。 |
| `stateFilePath` | `string` | undefined | 永続化する状態ファイルの場所。 |
| `allowedOrigins` | `string[]` | undefined | 許可する CORS オリジン。空または省略時はクロスオリジンアクセスを無効化。 |
| `allowedHosts` | `string[]` | undefined | 許可する `Host` ヘッダーの値。 |
| `maxLogEntries` | `number` | 200 | メモリに保持するログエントリ数の上限。 |
| `redactSensitiveHeaders` | `boolean` | `true` | 記録前に機密ヘッダーの値をマスキングします。 |
| `redactHeaderNames` | `string[]` | undefined | 組み込みリストに加えてマスキングするヘッダー名。 |
| `security` | `SecurityContext` | undefined | 各ツール呼び出しで上流 API に転送する認証情報。 |

## `SecurityContext`

| フィールド | 型 | 送信形式 |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | 正確なヘッダー名と値の組み合わせ。 |

認証情報は実行処理で挿入され、モデルに渡すツール引数として公開されることはありません。

## `ExecutionContext`

`executeToolCall` に渡し、`ContextProvider` が返す呼び出しごとのコンテキスト：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `baseUrlOverride` | `string` | この呼び出しで使う仕様のサーバー URL を上書きします。 |
| `upstreamHeaders` | `Record<string, string>` | 追加の上流ヘッダー。 |
| `requestTimeoutMs` | `number` | 呼び出しごとのタイムアウト。最小値は 1 秒。 |
| `security` | `SecurityContext` | 呼び出しごとの認証情報。 |
| `correlationId` | `string` | 同じ呼び出しのログエントリを関連付けます。 |
| `protocol` | `ProtocolHint` | 呼び出しを開始したトランスポート。 |
| `onLog` | `(entry) => void` | リクエストとレスポンスのログを受け取ります。例外を投げてはいけません。 |
| `signal` | `AbortSignal` | 進行中の上流リクエストをキャンセルします。 |

## リテラルユニオンと型ガード

| ユニオン型 | 値 | ガード関数 |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

`buildMcpServer()` の第 3 引数として渡します。

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | 通知するプロトコルのヒント。 |
| `name` | `string` | `"openapi-mcp"` | 通知するサーバー名。 |
| `version` | `string` | `"1.1.0"` | 通知するサーバーバージョン。 |
| `pageSize` | `number` | 100 | 一覧レスポンスあたりの最大件数。上限は 500。 |
| `instructions` | `string` | 組み込み | MCP の `instructions` で公開する利用説明。 |

## トランスポート層のオプション（`AttachMcpRoutesOptions`）

`@powerduck/openapi-mcp-server` から `attachMcpRoutes` をインポートし、第 2 引数にオプションオブジェクトを渡します。従来のラッパー `attachSseRoutes()` は位置引数 `(app, specProvider, contextProvider, routeGuard?)` のみを受け取ります。

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | —（必須） | 新しいセッションにドキュメントを提供します。 |
| `contextProvider` | `ContextProvider` | —（必須） | 呼び出しごとの上流コンテキストを提供します。 |
| `routeGuard` | `RequestHandler` | undefined | すべての MCP ルートに適用するミドルウェア。 |
| `maxSessions` | `number` | 64 | 同時セッション数の上限。 |
| `sessionIdleMs` | `number` | 600000 | アイドルタイムアウト（ミリ秒）。0 で無効化。 |
| `allowedOrigins` | `string[]` | undefined | 許可するオリジン。空でないリストを指定すると DNS リバインディング対策を有効化。 |
| `allowedHosts` | `string[]` | undefined | 許可する `Host` ヘッダーの値。 |
| `enableLegacySse` | `boolean` | `true` | 非推奨の HTTP+SSE トランスポートをマウントします。 |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | ライフサイクルイベントを受け取ります。例外を投げてはいけません。 |

> これらは `attachMcpRoutes` のオプションであり、`ServerConfig` の追加フィールドではありません。管理サーバーはオリジンとホストの設定を引き渡しますが、セッション数の上限とアイドルタイムアウトにはトランスポートのデフォルトを使います。変更が必要な場合は、公開トランスポート関数を直接使用してください。

## 関連項目

- [API リファレンス](../api-reference/)
- [使用例](../examples/)
