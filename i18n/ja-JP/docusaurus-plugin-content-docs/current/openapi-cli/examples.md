---
sidebar_position: 5
title: "使用例"
description: "実際に利用できる CLI オプションとプログラミング API に基づく、@powerduck/openapi-cli の実用例です。"
---

# 使用例

実際に利用できる CLI オプションとプログラミング API に基づく、`@powerduck/openapi-cli` の実用例です。

## 1. 基本的な CLI テスト

ローカルの OpenAPI 文書を指定して、すべての操作を実行します。

```bash
openapi-cli --spec openapi.json
```

サーバーを上書きし、任意のディレクトリにレポートを保存します。

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

リモート URL 上の仕様をテストします。

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. 認証付きでプログラムから実行

Bearer トークン、カスタムヘッダー、同時実行数を指定してライブラリ API を使います。

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. テスト対象を絞り込む

メソッド、タグ、パスの正規表現、operationId により、一部の操作だけを実行します。

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

これらのフィルターを組み合わせたプログラム設定です。異なるフィルター種別は AND、同じ種別内のタグは OR で組み合わせます。

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. JSON と HTML のレポート生成

`--format` で出力形式を選択します。既定では 3 種類すべてを出力します。

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

プログラムからの同等の処理：

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` は `report.json` を、`generateHtmlReport` は `report.html` を書き込みます。どちらも出力ディレクトリがなければ作成し、ファイルパスを返します。

## 5. 仕様内の宣言的アサーション

操作に `x-tests` 配列を追加します。各要素には `name` と `assert` の種類が必要です。

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

アサーションの種類：

| `assert` | 必須フィールド | 用途 |
|----------|-----------------|---------|
| `status` | `value` | HTTP ステータスが `value` と一致 |
| `header` | `key`。`contains` は省略可 | ヘッダーの存在を確認し、必要に応じて部分文字列を含むか検証 |
| `bodyContains` | `contains` | 応答ボディが部分文字列を含む |
| `bodyEquals` | `body` | 応答ボディが `body` と完全一致 |
| `jsonPath` | `path`。`equals` / `exists` は省略可 | JSONPath を解決して値を比較、または存在を確認 |
| `responseTime` | `max` | 所要時間が `<= max` ミリ秒であること |

## 6. Postman スクリプト

`x-postman-scripts` で Postman 形式のテストスクリプトを埋め込みます。

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

宣言的な `x-tests` と `x-postman-scripts` は、同じ操作に併用できます。

## 7. CI 連携（GitHub Actions）

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

既定では、テスト失敗時は終了コード `1`、設定エラーや致命的な実行時エラーでは `2` を返すため、CI ジョブが失敗します。完了したテスト実行でパイプラインを失敗させたくない場合は `--no-fail-on-error` を指定します。ただし、設定エラーや致命的なエラーは抑制されません。
