---
title: "リクエストの保存とプロトコルのサンプル"
description: "Powerduck は、試行中のリクエストと公開する API 契約を分けて管理します。"
---

# リクエストの保存とプロトコルのサンプル

Powerduck は、試行中のリクエストと公開する API 契約を分けて管理します。

| 操作 | 結果 |
| --- | --- |
| URL バーの保存 | このリクエストのローカルなデバッグ設定を保存します。OpenAPI 文書は変更しません。 |
| クイックリクエスト：仕様に保存 | 選択した文書とフォルダーに操作を追加します。 |
| 仕様のリクエスト：仕様を更新 | 契約を更新する前に、保存先のメソッドとパス、および定義のプレビューを表示します。 |
| 文書の保存 / Cmd+S または Ctrl+S | 現在の OpenAPI 文書をディスクに書き込みます。クイックリクエストのタブでは、そのリクエストを保存します。 |

ローカルのリクエストには、選択したサーバー、URL、メソッド、パラメーター値、本文、スクリプト、トランスポート設定が含まれます。仕様リクエストの編集中の下書きはメモリに保持され、URL バーの保存でアプリのレンダラープロセスのストレージに `powerduck.debug.v1:` を接頭辞として永続化されます。エントリは文書 ID、パス、メソッドで区別されます。ブラウザーやデスクトップアプリのデータを削除すると、このローカル状態も消えます。OAS ファイルのエクスポートには含まれません。このストレージは**暗号化された秘密情報の保管庫ではありません**。リクエストの URL、ヘッダー、本文には認証情報を直接記載せず、環境参照を使ってください。認証コントロールは別の永続化経路で認証情報を保存します。

`x-powerduck-request` は**公式の契約拡張ではありません**。仕様への追加や更新では出力されません。メソッド、パラメーター、リクエスト本文、レスポンスの定義に使わないでください。文書を開くだけで、ほかの操作に既存のこの拡張があっても書き換わることはありません。

## 定義を明示的に更新する

仕様の更新では、保存先のメソッドとパスをプレビューし、既存のレスポンスとスキーマを保持します。パラメーター定義は選択した場合のみ更新し、デバッグ用の値はコピーしません。JSON 本文をサンプルに含める場合も明示的な選択が必要です。一般的な認証情報のフィールド名は除外されますが、**公開前に自由記述のテキストとサンプルを確認してください**。スクリプトや認証の上書き設定は契約のフィールドではありません。

メソッドやパスを変更して、保存先の既存操作を上書きすることはできません。ローカルの操作参照は新しい保存先に更新されます。`PURGE` のようなカスタムメソッドは `paths./cache.additionalOperations.PURGE` に保存され、OpenAPI 3.2 が必要です。プレビューでこの要件を示し、更新を適用すると文書バージョンが 3.2.0 になります。利用先のツールがこのバージョンに対応するかも確認してください。

プロトコルスキーマは引き続き「ドキュメントを編集」から変更できます。これは定義の明示的な編集です。デバッグリクエストの送信や保存でスキーマが暗黙に書き換わることはありません。

## ダウンロードできる公式サンプル

これらは保守されている**サンプル定義**であり、Powerduck の公開 API サービスではありません。すべてのエンドポイントは、自分で用意するローカルサービスを指します。ファイルをインポートしても、サービスの起動、自動接続、認証情報の付与は行われません。

- [すべてのプロトコル](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP とカスタム PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) と [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

gRPC では、YAML ファイルと同じ場所に `echo.proto` をダウンロードし、必要に応じてクライアントで実際のローカルパスを選択してください。サーバーはポート 50051 で `powerduck.examples.Echo/Echo` を実装する必要があります。ほかのサンプルにも対応するサーバーが必要です。稼働中のバックエンドに対する検証デモではありません。

## 契約拡張リファレンス

各操作には通常の OAS メソッド、operationId、summary、responses があります。非 HTTP バインディングでは OAS 操作を文書上の参照点として使います。gRPC サンプルの `post` は、gRPC を REST エンドポイントに変換したという意味ではありません。

| 拡張 | 意味とサンプルで使うフィールド |
| --- | --- |
| `x-protocol` | `sse`、`websocket`、`graphql`、`grpc`、`mcp`、`a2a`。HTTP では省略できます。 |
| `x-session` | 長時間持続するプロトコルセッションを宣言します。サンプルでは WebSocket と MCP に使います。 |
| `x-websocket` | `url`、任意の `subprotocols`、`headers`、`messages`。文書化された各メッセージには `id`、`name`、`type`、`body`、`requestSchema`、`responseSchema` があります。ヘッダーに認証情報を含めないでください。 |
| `x-graphql` | `endpoint`、`query`、`operationName`、`variablesSchema`、公開可能な `variables`、`responseSchema`。 |
| `x-grpc` | `address`、`service`、`method`、`kind`、`reflection`、`protoPaths`、`includeDirs`、文書化された `messages`。`kind` は unary/server_streaming/client_streaming/bidi_streaming に対応します。ローカルの proto パスは配備環境によって異なります。 |
| `x-mcp` | `transport`、`endpoint`、`method` と、メソッド固有の `name`、`argumentsSchema`、公開可能な `arguments`、`responseSchema`。リソース操作には `uri` を使います。無関係なメソッドのフィールドを混在させないでください。 |
| `x-a2a` | 明示的な `version`、`binding`、`endpoint`、`method`、`requestSchema`、`responseSchema` と公開可能な `example`。0.3 と 1.0 ではペイロードが異なります。[A2A](./a2a.md) を参照してください。 |
| `x-response-stream` | GraphQL のストリーミング意図を示す任意の指定です。実際のサーバーとトランスポートが対応する場合に使います。通常の GraphQL リクエストには不要です。 |

SSE では標準の `responses.200.content.text/event-stream.itemSchema` で各イベントのペイロードを記述します。HTTP では標準のパラメーター、requestBody、responses、セキュリティスキームを使います。独自に `x-sse` 設定ブロックを作ったり、デバッグ状態を契約拡張として保存したりしないでください。

サンプルには、選択したバインディングで使える完全な設定を含めています。相互に排他的な全オプションを列挙したものではありません。MCP stdio には別途設定したローカル実行ファイルが必要です。ダウンロードしたサンプルからは、意図的に自動起動しません。

## パッケージとの連携

デスクトップ UI がローカルのデバッグ状態の永続化と明示的な仕様書き込みを担当します。`@powerduck/openapi-parser` はすでに `additionalOperations` を通じてカスタムメソッドを読み取り、`@powerduck/tree` と `@powerduck/oas-document` はこの契約構造を利用します。`@powerduck/openapi-request` は仕様とは別に実行時引数を受け取ります。リクエストの実行に `x-powerduck-request` は不要です。

保存処理の分離によって、新しい公開 npm パラメーターは追加されません。契約データには既存のプロトコル拡張を使い、現在のデバッグ値はリクエスト実行 API に渡してください。エクスポーター、ジェネレーター、MCP ツールが非公開のリクエスト状態構造に依存しないようにしてください。
