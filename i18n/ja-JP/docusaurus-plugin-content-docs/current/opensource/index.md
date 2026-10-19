---
sidebar_position: 1
title: "オープンソースライブラリ"
description: "@powerduck/* npm パッケージはデスクトップと Cloud の基盤です。解析・更新、複数プロトコルの CLI、コード生成、MCP、リクエスト実行、変換、埋め込みエディターを提供します。"
---

# オープンソースライブラリ

Powerduck は、小さく組み合わせ可能な npm パッケージで構成されています。デスクトップクライアントとクラウドサービスは同じライブラリを使うため、同じ処理基盤をローカル、ネットワーク経由、または独自のツール内で利用できます。

各パッケージは独立して公開され、個別のインストール手順、API リファレンス、使用例を備えています。このページでは各パッケージの役割と組み合わせを紹介します。

## レイヤー構成

```text
Powerduck / Cloud
        ↓
埋め込み UI
        ↓
ワークフロー
        ↓
基盤
```

パーサーとコンバーターが基盤となり、その上にワークフロー、さらに埋め込み UI が構築されます。パッケージごとに解析を再実装せず、共通の基盤を使うことで動作の一貫性を保ちます。

## パッケージ一覧

### 基盤

| パッケージ | 用途 |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | OpenAPI/Swagger ドキュメントの解析、検証、アップグレード |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | 構造化され検証された設定パッチの適用 |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | cURL、Postman などの形式から OpenAPI への変換 |

### ワークフロー

| パッケージ | 用途 |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | シナリオ実行を含む、複数プロトコルのコマンドラインワークフロー |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | 仕様からクライアントコードやその他の成果物を生成 |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | OpenAPI 仕様を MCP サーバーとして提供 |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | 仕様で定義されたリクエストを実行 |

### 埋め込み UI

| パッケージ | 用途 |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | OpenAPI を読みやすいドキュメントとして描画。React 用エントリーも提供 |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | 埋め込み可能な Markdown エディター |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | 埋め込み可能な JSON Schema エディター |
| [`@powerduck/tree`](../tree/introduction.md) | 構造化データ用のツリーコンポーネント |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | ワークスペース YAML の統合 |

## パッケージの選び方

- **OpenAPI ファイルの読み込み、検証、アップグレード：**`openapi-parser` を使用します。
- **cURL や Postman コレクションを OpenAPI に変換：**`x-to-openapi` を使用します。
- **コマンドラインや CI からシナリオや複数プロトコルの処理を実行：**`openapi-cli` を使用します。
- **クライアントコードを生成：**`openapi-codegen` を使用します。
- **API を AI エージェントのツールとして公開：**`openapi-mcp-server` を使用します。
- **描画したドキュメントを React アプリに埋め込む：**`oas-document` の React エントリーと CSS を使用します。
- **エディターを埋め込む：**`md-editor` または `schema-editor` を使用します。

## エージェントとの機能共有

MCP サーバーパッケージを通じて、外部の AI エージェントも Powerduck の機能を利用できます。`openapi-mcp-server` が提供する仕様は操作を MCP ツールとして公開するため、ドキュメントやコード生成を支える同じ契約をエージェントから直接呼び出せます。デスクトップクライアント、Cloud、その他の MCP 対応ツールで共通の定義を維持できます。

## 使用例について

各ページのコード例は実際のパッケージ API に基づき、そのまま実行できるように記述しています。パッケージを更新した場合は、古いバージョンの例をそのまま使わず、リリースノートで現在のパラメーターを確認してください。

インストール、設定、全 API リファレンスは、サイドバーから各パッケージのページを開いて確認できます。
