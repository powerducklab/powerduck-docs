---
title: "OpenAPI をコーディング Agent に接続する"
description: "OpenAPI をコーディング Agent に接続する"
---

# OpenAPI をコーディング Agent に接続する

**開発者 MCP** は契約情報とバックエンド検証を提供します。**API-to-MCP** は API 操作をツールとして公開する別の機能です。

1. デスクトップの「開く」で YAML/JSON を選び、実験用に独立したコピーを保存します。
2. 対象仕様の **MCP & Coding** を開きます。または開発者 MCP リポジトリで `npm ci`、`npm run build` を実行します。
3. Agent に stdio MCP を登録します。実行ファイルは `node`、引数は `/absolute/path/dev-mcp-server/dist/cli.mjs`、`--spec`、`/absolute/path/openapi.yaml` です。実際の絶対パスに置き換えてください。
4. 変更前に Agent に操作と応答 schema を読ませます。変更後は実際のバックエンドの `baseUrl` を指定して `run_contract_tests` を実行させます。
5. 検証結果とコード差分を確認し、適用後に再検証します。

Node.js 20.11+ が必要です。Agent はコードやツール結果を設定済みのリモートモデルへ送る場合があります。手動リクエストと契約検証にモデルは不要です。持ち込みキーは提供者が請求し、ホスト型モデルと Cloud は別料金です。ローカル機能に Cloud の購入は不要です。

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](../overview/quickstart.md)
