---
sidebar_position: 4
title: "API リファレンス"
description: "コア層とファイル層の関数、オプション、エラーコード。"
---

# API リファレンス

## コア層 (`@powerduck/workspace-yaml/core`)

| 関数 | 説明 |
|----------|-------------|
| `createWorkspaceYaml(options?)` | workspace.yaml の内容を文字列で生成 |
| `createOpenApiYaml(options)` | OpenAPI 3.2 YAML の内容を文字列で生成 |
| `createWorkspaceWithApi(options)` | ワークスペースと OpenAPI の内容を両方生成 |
| `parseWorkspaceYaml(content)` | workspace.yaml 文字列を解析して検証 |

### `createOpenApiYaml(options)` — オプション

| オプション | 型 | 必須 | 説明 |
|--------|------|----------|-------------|
| `title` | `string` | はい | API タイトル |
| `version` | `string` | いいえ | 既定値 `"1.0.0"` |
| `description` | `string` | いいえ | API の説明 |
| `contact` | `{ name?, url?, email? }` | いいえ | 連絡先情報 |
| `license` | `{ name, url? }` | いいえ | ライセンス情報 |
| `servers` | `Array<{ url, description? }>` | いいえ | サーバー一覧 |

## ファイル層 (`@powerduck/workspace-yaml`)

| 関数 | 説明 |
|----------|-------------|
| `initializeWorkspace(options)` | ディスク上に workspace.yaml ファイルを作成 |
| `initializeOpenApi(options)` | ディスク上に OpenAPI YAML ファイルを作成 |
| `createWorkspaceApi(options)` | 両方のファイルをアトミックに作成（失敗時はロールバック） |

### `createWorkspaceApi(options)` — オプション

| オプション | 型 | 必須 | 説明 |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | はい | 出力先ディレクトリ |
| `oasId` | `string` | はい | 一意の API 識別子 |
| `name` | `string` | はい | 表示名 |
| `file` | `string` | いいえ | 相対パス（既定値：`oasFiles/${oasId}.openapi.yaml`） |
| `title` | `string` | いいえ | API タイトル（既定値は `name`） |
| `version` | `string` | いいえ | API バージョン（既定値：`"1.0.0"`） |
| `overwriteOpenApi` | `boolean` | いいえ | 既定値 `false` |

## エラー

すべてのエラーは `WorkspaceYamlError` のインスタンスで、機械可読な `code` を持ちます：

| コード | 説明 |
|------|-------------|
| `INVALID_ARGUMENT` | 無効な入力パラメーター |
| `ALREADY_EXISTS` | ファイルが既に存在する（上書きは false） |
| `NOT_FOUND` | ファイルが見つからない |
| `IO_ERROR` | ファイルシステム操作の失敗 |
| `INVALID_WORKSPACE` | 無効なワークスペース設定 |
| `INVALID_OPENAPI` | 無効な OpenAPI ドキュメント |
| `ROLLBACK_FAILED` | トランザクションのロールバック失敗 |
