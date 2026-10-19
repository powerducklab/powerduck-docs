---
sidebar_position: 1
title: "概要"
description: "@powerduck/openapi-codegen で OpenAPI から実行可能な HTTP サンプルを生成。21 言語、41 クライアントに対応し、ブラウザーで動作、実行時依存なし。"
---

# 概要

`@powerduck/openapi-codegen` は、OpenAPI の操作を、選択した言語と HTTP クライアントの **実行可能な HTTP リクエスト例**に変換する TypeScript ライブラリです。API ドキュメントサイト、開発者ポータル、API エクスプローラー、CLI ツール、ビルド時のコード生成向けに設計されています。

**21 言語**と **41 の言語・クライアントの組み合わせ**に対応し、**ブラウザーで動作**し、**実行時の依存パッケージは不要**です。

## openapi-codegen を選ぶ理由

- **実行時依存なし** — Node の組み込みモジュールを必要とせず、ブラウザー、Node.js、Electron、エッジ環境で動作します。
- **2 つのモジュール形式** — ネイティブ ESM と CommonJS（`require()`）のビルドを提供します。
- **OpenAPI 3.0 / 3.1 / 3.2** — 解析済みのドキュメントオブジェクトを処理します。`generate()` の前に解析すれば JSON と YAML のどちらも使えます。
- **41 の組み込みジェネレーター** — 21 言語をカバーし、インポート時に自動登録されます。
- **パラメーターの完全なシリアライズ** — path、query、header、cookie に対し、OpenAPI の `style` / `explode` / `allowReserved` に従います。
- **セキュリティスキーム** — API キー（header/query/cookie）、HTTP bearer、HTTP basic に対応します。
- **ボディ形式** — JSON、プレーンテキスト、URL エンコードフォーム、`multipart/form-data`。
- **`$ref` の解決** — ドキュメント内の JSON Pointer 参照をキャッシュし、参照の連鎖と循環を扱います。
- **例の自動生成** — JSON Schema の `example`、`enum`、`default`、型、形式、制約から値を推論します。
- **プラグイン** — `register()` または `use()` で独自のジェネレーターを登録できます。

## 仕組み

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` は `$ref` を解決し、パスと操作のパラメーターを統合し、ボディのメディアタイプを選び、例の値を生成し、セキュリティスキームを解決して、正規化された `RequestIR` を作ります。
2. 選択した `Generator` が `RequestIR` を受け取り、実行可能なソースコード文字列を返します。

通常は `generate({...})` を呼ぶだけで、両方の処理を実行できます。

## 基本例

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## 次のステップ

- [インストール](/docs/ja-JP/openapi-codegen/installation/) — npm / yarn / pnpm とブラウザーでの利用。
- [クイックスタート](/docs/ja-JP/openapi-codegen/quickstart/) — 最初のコード例を生成し、ジェネレーターを一覧表示。
- [設定](/docs/ja-JP/openapi-codegen/configuration/) — `GenerateOptions`、`RequestIR`、`Generator`、`Plugin`。
- [API リファレンス](/docs/ja-JP/openapi-codegen/api-reference/) — 全エクスポートと、言語・クライアントの完全な一覧。
- [使用例](/docs/ja-JP/openapi-codegen/examples/) — fetch、Python requests、cURL、独自ジェネレーター、プラグイン、`RequestIR` の直接利用。
