---
sidebar_position: 1
title: "概要"
description: "@powerduck/openapi-cli は、OpenAPI 3.2 文書に基づいて実際のサーバーを一括テストするコマンドラインツールです。仕様ファイルまたは URL を指定すると、文書内の操作を実行し、各応答をアサーションで検証して、3 種類の形式でレポートを生成します。"
---

# 概要

`@powerduck/openapi-cli` は、OpenAPI 3.2 文書に基づいて実際のサーバーを一括テストするコマンドラインツールです。仕様ファイルまたは URL を指定すると、文書内の操作を実行し、各応答をアサーションで検証して、3 種類の形式でレポートを生成します。

リクエストの実行には [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) を、`$ref` の参照解決には [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) を使用します。

## openapi-cli を使う理由

- **CI に対応** — 既定ではテスト失敗や実行エラーをゼロ以外の終了コードで通知するため、GitHub Actions、GitLab CI などのパイプラインにそのまま組み込めます。
- **複数プロトコルを標準サポート** — 1 つの仕様で HTTP、SSE、WebSocket、GraphQL、gRPC、MCP の操作を記述でき、同じランナーですべて処理できます。
- **2 種類のアサーション** — 単純な検証には宣言的な `x-tests` 配列を、複雑な検証には Postman 形式の `pm.test()` / `pm.expect()` スクリプトを使用します。
- **3 種類のレポート形式** — 機械処理向け JSON、読みやすいカラー CLI 出力、単独で表示できる対話型 HTML レポートを生成します。
- **ローカル・リモート両方の仕様に対応** — ファイルパスまたは `http(s)://` URL から文書を読み込みます。リダイレクトへの追従とタイムアウトにも対応します。
- **柔軟な絞り込み** — メソッド、パス、タグ、operationId で実行対象を選択し、同時実行数を制限できます。

## 対応プロトコル

ランナーは、OpenAPI の拡張フィールドまたは応答のコンテンツタイプから、各操作のプロトコルを判定します。

| プロトコル | 識別子 | 選択方法 |
|----------|-----------|--------------------|
| HTTP | `http` | 標準的な操作の既定値 |
| Server-Sent Events | `sse` | 応答のコンテンツタイプが `text/event-stream`、または `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

操作またはパス項目に `x-protocol` 拡張を設定して、プロトコルを明示的に指定することもできます。

## レポート

実行後、ツールは次の内容を出力します。ファイルの既定の保存先は `./openapi-cli-report` です。

- `report.json` — 完全な `TestReport` オブジェクトを整形済み JSON として保存します。
- `report.html` — 概要欄、進捗バー、絞り込みボタン、展開可能なテスト行を備えた、外部依存のない自己完結型 HTML レポートです。
- 標準出力 — 進捗バーと各テストのアサーションを含むカラー CLI サマリーです。

## プログラムからの利用

同じ処理をライブラリとして利用できます。設定を解決してテストを実行し、必要なレポート生成機能を選択します。

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## 次のステップ

- [インストール](./installation.md) — グローバルまたは開発依存としてインストールします。
- [クイックスタート](./quickstart.md) — 最初のテストスイートを実行します。
- [設定](./configuration.md) — `CliConfig` の全項目を説明します。
- [コマンド](./commands.md) — すべての CLI オプションと終了コードを確認します。
- [API リファレンス](./api-reference.md) — エクスポートされるすべての関数と型を確認します。
- [使用例](./examples.md) — そのまま実行できる例を紹介します。
