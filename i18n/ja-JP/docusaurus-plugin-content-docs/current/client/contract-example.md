---
title: "契約テストで実装の型エラーを見つける"
description: "契約テストで実装の型エラーを見つける"
---

# 契約テストで実装の型エラーを見つける

この例は開発者 MCP の既存ランナーを使います。現在のソースには応答 schema 検証が追加されています。Node.js 20.11 以降が必要です。架空データとループバック専用サーバーを使い、依存関係のインストール後はアカウント、モデル、公開 API は不要です。

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

仕様の `total` は number ですが、応答は `{"total":"42"}` です。実際の検証結果は `/total must be number`、終了コードは 1 です。

```sh
node examples/contract-total/verify.mjs --correct
```

応答が `{"total":42}` になると同じ検証が成功し、終了コードは 0 になります。手動修正では `examples/contract-total/server.mjs` の `total` を数値に変更します。エラーを隠すために仕様を緩めないでください。

ポートは自動割り当てで、終了時にサーバーを停止します。[サンプルのソース](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total)。現在は JSON 応答の検証に対応し、format 検証とリモート schema 取得は行いません。未対応のメディア形式は制限として報告します。

これは実際のバックエンドの検証です。Mock の成功とは区別してください。任意の Agent から `run_contract_tests` に明示的な `baseUrl` を渡すこともできます。修正案は適用前に確認します。

[Download desktop](https://www.powerduck.com/download.html) · [Quickstart](../overview/quickstart.md)
