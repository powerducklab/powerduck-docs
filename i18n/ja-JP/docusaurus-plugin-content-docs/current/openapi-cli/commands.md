---
sidebar_position: 5
title: "CLI コマンド"
description: "このパッケージが提供する実行コマンドは openapi-cli のみです。オプションを直接指定する形式で、run / validate / init のサブコマンドはありません。"
---

# CLI コマンド

このパッケージが提供する実行コマンドは `openapi-cli` のみです。オプションを直接指定する形式で、`run` / `validate` / `init` のサブコマンドは**ありません**。

```
openapi-cli [options]
```

## 構文

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

仕様の指定は**必須**です。`--spec`（または `-s`）を渡すか、`--config` で読み込む JSON 設定ファイルに `specPath` を設定してください。それ以外は省略できます。

## 基本オプション

| オプション | 短縮形 | 既定値 | 説明 |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON 仕様のパスまたは `http(s)://` URL |
| `--server <url>` | `-S` | *（仕様から取得）* | 仕様のサーバー URL を上書き |
| `--output <dir>` | `-o` | `./openapi-cli-report` | レポートの出力先ディレクトリ |
| `--format <formats>` | `-f` | `json,cli,html` | カンマ区切りのレポート形式：`json`、`cli`、`html` |
| `--config <path>` | `-c` | — | JSON 設定ファイルのパス。CLI 引数が優先 |

## 実行オプション

| オプション | 短縮形 | 既定値 | 説明 |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | 最大同時リクエスト数。1～100 の整数 |
| `--timeout <ms>` | `-t` | `30000` | リクエストごとのタイムアウト（ミリ秒）。1～600000 の整数。リモート仕様の取得にも使用 |
| `--no-fail-on-error` | — | 無効 | 実行が完了した場合、テスト失敗があっても `0` を返す。設定エラーや致命的なエラーは引き続き失敗扱い |

## 絞り込みオプション

| オプション | 既定値 | 説明 |
|--------|---------|-------------|
| `--method <methods>` | — | 対象の HTTP メソッドをカンマ区切りで指定。例：`get,post` |
| `--path <patterns>` | — | 各パスと照合する正規表現をカンマ区切りで指定 |
| `--tag <tags>` | — | 対象の OpenAPI タグをカンマ区切りで指定 |
| `--operation-id <ids>` | — | 対象の `operationId` をカンマ区切りで指定 |

## ネットワークと TLS のオプション

| オプション | 短縮形 | 既定値 | 説明 |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) プロキシ URL。例：`http://proxy.corp:8080` |
| `--ca <path>` | — | — | CA 証明書バンドル（PEM） |
| `--cert <path>` | — | — | mTLS 用クライアント証明書（PEM） |
| `--key <path>` | — | — | mTLS 用クライアント秘密鍵（PEM） |
| `--insecure` | `-k` | 無効 | TLS 証明書の検証を省略 |

## 認証、ヘッダー、変数

| オプション | 短縮形 | 説明 |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | `Key: Value` 形式の追加ヘッダー。繰り返し指定可能 |
| `--bearer <token>` | — | `Authorization` ヘッダーで送信する Bearer トークン |
| `--variable <vars...>` | `-v` | `KEY=VALUE` 形式の Postman 変数。繰り返し指定可能 |
| `--env <path>` | — | `.env` ファイルのパス。既存の環境変数は上書きしない |

## gRPC オプション

| オプション | 既定値 | 説明 |
|--------|---------|-------------|
| `--grpc-no-reflection` | 無効 | gRPC サーバーリフレクションを無効にし、proto ファイルを使用 |
| `--grpc-proto <paths...>` | — | `.proto` ファイルまたはそれを含むディレクトリのパス |

## MCP オプション

| オプション | 既定値 | 説明 |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP トランスポート：`streamable-http` または `stdio` |
| `--mcp-command <command>` | — | MCP stdio コマンド。例：`npx` |
| `--mcp-args <args>` | — | 空白またはカンマ区切りの MCP stdio 引数 |
| `--mcp-cwd <dir>` | — | MCP stdio サブプロセスの作業ディレクトリ |

## 情報表示オプション

| オプション | 短縮形 | 説明 |
|--------|-------|-------------|
| `--help` | `-h` | ヘルプを表示 |
| `--version` | `-V` | バージョンを表示 |

## 終了コード

| コード | 意味 |
|------|---------|
| `0` | すべてのテストが成功、または `--no-fail-on-error` を設定済み |
| `1` | 1 件以上のテストが失敗・エラー、またはコマンドライン引数の解析に失敗 |
| `2` | 設定エラー、仕様の読み込み失敗、または致命的な実行時エラー |

`--spec` も設定済みの `specPath` もない場合など、`resolveConfig` が例外を投げると、CLI は赤色で `Error:` を表示して `2` で終了します。`runTests` が例外を投げると、`Fatal error:` を表示して `2` で終了します。実行が完了した場合は、`report.summary.failed > 0 || report.summary.errors > 0` かつ `failOnError !== false` のときだけ `1` を返します。

## 環境変数

専用の `OPENAPI_CLI_*` 変数はありません。設定はオプション、設定ファイル、および次の方法で指定します。

- **`.env` ファイル** — `--env .env` を指定すると、`KEY=VALUE` の組を `process.env` に読み込みます。既存の変数は上書きしません。
- **`${VAR}` の展開** — 読み込み後、`serverUrl`、`proxy`、`headers` の値、`auth.token`、`variables` の値にある `${VAR_NAME}` を置き換えます。

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## 実行例

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
