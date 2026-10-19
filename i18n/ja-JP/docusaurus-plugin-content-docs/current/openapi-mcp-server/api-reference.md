---
sidebar_position: 5
title: "API リファレンス"
description: "@powerduck/openapi-mcp-server の全 API：仕様の読み込み、ツール・プロンプト・リソース生成、リクエストの構築と実行、MCP サーバー、トランスポート、管理、認証、サービスレジストリ、CLI。"
---

# API リファレンス

`@powerduck/openapi-mcp-server` の公開エクスポートを機能別に説明します。

## 仕様の読み込み

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | JSON または YAML ファイルを読み込み、検証と参照解決を行い、操作 ID の一意性を確認します。YAML は `.ya?ml` 拡張子で判定します。 |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | 文字列からドキュメントを解析します。空または不正な入力では例外を投げます。 |

## ツール生成

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | 各操作の MCP `Tool` 定義を生成します。 |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | `{ tools, bindings, issues }` を返します。 |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | 生成されたツール名と `ToolBinding` を対応付けます。`getBindingIndex` の別名です。 |

型エクスポート：`ToolBinding`、`GeneratedToolWithBinding`（パッケージ内での `GeneratedTool` の別名）。

## プロンプトとリソース

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | 生成されたすべてのプロンプトを列挙します。 |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | 名前からプロンプトを解決します。不明な名前では `null`。 |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | カタログリソースを列挙します。 |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | URI からリソースを 1 件読み込みます。 |

## リクエストの構築と実行

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | 引数を `{ url, query, headers, body, dropped }` にシリアライズします。位置引数を使用します。 |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | 生成されたツールを上流 API に対して実行します。2xx 以外の応答はデータとして返し、トランスポートの失敗では例外を投げます。 |

`ToolCallResult` のフィールド：`status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`。

## 仕様のユーティリティ

| エクスポート | 説明 |
| --- | --- |
| `iterateOperations(spec, issues?)` | 解決済みの全操作を返すジェネレーター。OpenAPI 3.2 の `additionalOperations` を含みます。 |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | `(name, in)` をキーにパス項目と操作のパラメーターを統合します。 |
| `normalizeParameter(candidate)` | 生のパラメーターを正規化します。使用できない場合は `null`。 |
| `synthesizeOperationId(method, pathTemplate)` | 操作に `operationId` がない場合に、決定的な代替 ID を生成します。 |
| `ensureUniqueName(candidate, taken)` | 数値の接尾辞を付けて名前の一意性を保ちます。 |
| `extractPathTemplateVariables(pathTemplate)` | `{name}` 変数を抽出し、最初の出現を残して重複を除きます。 |
| `effectiveStyle(parameter)` | 仕様で定められた `style` のデフォルトを適用します。 |
| `effectiveExplode(parameter)` | 仕様で定められた `explode` のデフォルトを適用します。 |
| `findOperationById(spec, operationId)` | 最初の構築後は O(1) で検索します。不明な ID では `null`。 |
| `findDuplicateOperationIds(spec)` | 作成者が指定した ID の重複を報告します。 |
| `assertUniqueOperationIds(spec)` | 操作 ID が重複していると例外を投げます。 |
| `isPlainObject(value)` | 型をプレーンオブジェクトに絞り込みます。 |
| `truncateGeneratedName(name, limit=64)` | 一意性を維持しながら名前を短縮します。 |

型エクスポート：`OperationEntry`、`DuplicateOperationId`。

## MCP サーバーとトランスポート

| エクスポート | 説明 |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | ツール・プロンプト・リソースのハンドラーを接続した SDK の `Server` を構築します。位置引数を使用します。 |
| `startStdioServer(spec, context?, options?)` | stdio で 1 つのドキュメントを提供し、`{ closed, close() }` を返します。 |
| `attachMcpRoutes(app, options)` | Streamable HTTP（`/mcp`）と任意の従来の SSE（`/sse`）ルートをマウントします。`AttachMcpRoutesOptions` を受け取り、`McpRouteHandle` を返します。 |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | 位置引数を取る非推奨ラッパー。`{ activeSessionCount, closeAll }` を返します。 |
| `createStreamableSessionHost(options)` | 独自のトランスポート統合用に、独立した Streamable HTTP セッションホストを作成します。 |

型：`SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`。

`attachMcpRoutes` はパッケージのルートからエクスポートされます。オプションで `maxSessions`、`allowedOrigins`、`sessionIdleMs`、DNS リバインディング対策を設定します。ハンドルには `activeSessionCount`、`pendingSessionCount`、`listSessions`、`closeSession`、`closeAll`、`dispose` があります。終了時は `dispose()` を呼び出し、定期クリーンアップを停止してセッションを閉じてください。

## 管理サーバーと認証（`./server` サブパス） {#admin-server-and-auth-server-subpath}

`startAdminServer` は `@powerduck/openapi-mcp-server/server` またはパッケージのルートからインポートします。`createAuthMiddleware` はルートからインポートしてください。`./server` サブパスではエクスポートされません。

| エクスポート | シグネチャ | 説明 |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Web 管理画面と MCP ルートを持つ Express アプリを起動し、`{ app, server, port, close() }` を返します。 |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer または `x-api-key` によるアクセス保護。キーを省略すると無効になります。位置引数を使用します。 |

## ランタイムとユーティリティ

| エクスポート | 説明 |
| --- | --- |
| `ServiceRegistry` | `ManagedServiceRecord` の管理クラス：`upsert`、`list`、`get`、`remove`、`clear`、`start`、`stop`、`fail`。 |
| `isAbortError(error)` | `AbortError` または axios の `CanceledError` なら真。 |
| `newId()` | UUID を生成します。フォールバックにはタイムスタンプを使用します。 |

## CLI

実行コマンドは **`openapi-mcp`**。サブコマンドは `serve` のみです。

```
openapi-mcp serve [options]
```

| オプション | デフォルト | 説明 |
| --- | --- | --- |
| `--port <n>` | `3000` | Web トランスポートの HTTP ポート。 |
| `--host <host>` | `127.0.0.1` | HTTP ホスト。 |
| `--transport <mode>` | `web` | `stdio` または `web`。 |
| `--spec <path>` | — | OpenAPI ファイルのパス。stdio モードでは必須。 |
| `--base-url <url>` | — | 上流のベース URL を上書きします。 |
| `--api-key <key>` | — | 管理 API キー。 |
| `--upstream-header "Name: value"` | — | 上流ヘッダー。複数回指定できます。 |
| `--timeout <ms>` | `30000` | 上流のタイムアウト。 |
| `--no-persist` | — | 状態の永続化を無効にします。 |

## 型（`types` から再エクスポート）

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`。`ResolvedPrompt` は非推奨です。型ガード：`isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`。

## エラーと動作

- 不明なツール・プロンプト・リソース ID は、通常の結果に含める失敗データではなく、MCP の `InvalidParams` エラーになります。
- アクティブなセッションで仕様が見つからない場合は `InternalError` になります。
- 上流の 4xx/5xx は `isError: true` の内容としてモデルに返され、例外は投げません。例外を投げるのはトランスポートの失敗（DNS、TLS、タイムアウト、中止）のみです。

## 関連項目

- [設定](../configuration/)
- [使用例](../examples/)
