---
sidebar_position: 3
title: "クイックスタート"
description: "@powerduck/openapi-cli で最初の一括テストを CLI と Node.js から実行します。"
---

# クイックスタート

このガイドでは、OpenAPI ドキュメントを初めてテストする手順を説明します。

## 前提条件

- Node.js `>= 22.12.0`.
- OpenAPI 3.2 の **JSON** ドキュメント。YAML は受け付けないため、先に JSON に変換してください。トップレベルに `paths` オブジェクトが必要です。

## 1. CLI から実行する

最も簡単な実行方法では、ローカルの仕様を読み込み、そこに宣言された最初のサーバー URL に対して全操作をテストします。

```bash
openapi-cli --spec openapi.json
```

接続先サーバーを上書きし、任意のディレクトリにレポートを保存します。

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

リモート仕様の `GET` 操作だけを、10 個の並列ワーカーでテストします。

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

複雑な設定には JSON 設定ファイルを使います。

```bash
openapi-cli --config openapi-cli.config.json
```

すべてのフラグについては次を参照してください： [コマンド](/docs/ja-JP/openapi-cli/commands/).

## 2. テスト用の最小仕様を作る

宣言的なアサーションを含む最小限の OpenAPI ドキュメント：

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

操作にアサーションが**定義されていない**場合、ランナーはプロトコルの成功判定を暗黙に追加します。HTTP では `2xx` ステータスを要求するため、4xx/5xx 応答が気づかないうちに成功扱いになることを防ぎます。

## 3. Node.js から実行する（プログラマティック API）

ライブラリは同じ処理を関数として公開しています。基本的な流れは `resolveConfig` → `runTests` → レポーターです。

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` は CLI と同じ形式のオプションを受け取ります。`runTests` は `summary`、`results`、`config`、`generatedAt`、`version` を含む `TestReport` を返します。 [設定](/docs/ja-JP/openapi-cli/configuration/).

## 4. CI 用の終了コード

| コード | 意味 |
|---|---|
| `0` | 全テストが成功した、または `--no-fail-on-error` が指定された。 |
| `1` | 1 件以上のテストが失敗した、またはエラーになった。 |
| `2` | 設定エラー、仕様の読み込み失敗、または致命的な実行時エラー。 |

## 次のステップ

- [設定](/docs/ja-JP/openapi-cli/configuration/) — `CliConfig` の全フィールドとデフォルト値。
- [コマンド](/docs/ja-JP/openapi-cli/commands/) — すべての CLI フラグ。
- [使用例](/docs/ja-JP/openapi-cli/examples/) — 認証、フィルタリング、レポート、アサーション。
- [API リファレンス](/docs/ja-JP/openapi-cli/api-reference/) — エクスポートされる全関数と型。
