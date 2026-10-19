---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi は、curl コマンドと Postman Collection（v2.0 / v2.1.0）を OpenAPI 3.2 文書に変換する拡張可能な TypeScript フレームワークです。CI パイプライン、API ドキュメント生成、HTTP リクエストからのインターフェース再構築に利用できます。"
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** は、**curl コマンド**と **Postman Collection（v2.0 / v2.1.0）**を **OpenAPI 3.2** 文書に変換する拡張可能な TypeScript フレームワークです。CI パイプライン、API ドキュメント生成、HTTP リクエストからのインターフェース再構築に利用できます。

文書の検証には [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) を使用します。

- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **ライセンス:** MIT
- **Node.js 要件:** `>= 22.12.0`
- **出力:** OpenAPI **3.2.0** のみ
- **ソースコード:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## 処理の流れ

```text
curl コマンド → CurlAdapter
Postman Collection → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 文書
             ↓
     validateOpenApi32() → 診断情報
```

1. **アダプター**が curl テキストや Postman Collection を解析し、[`NormalizedRequest`](./api-reference.md#normalizedrequest) オブジェクトの一覧に変換します。
2. **ビルダー**がメソッドとパスでリクエストを統合し、スキーマ、パスパラメーター、セキュリティ定義を推論して OpenAPI 3.2 文書を生成します。
3. **バリデーター**が `@powerduck/openapi-parser` を通じて OpenAPI スキーマに照らして出力を検証し、診断情報を返します。

---

## 機能

- **2つの組み込みアダプター:** [`CurlAdapter`](./api-reference.md#curladapter) は単一・複数のコマンドとブラウザーの「Copy all as cURL」の出力に対応し、[`PostmanAdapter`](./api-reference.md#postmanadapter) は v2.0/v2.1.0、入れ子のフォルダー、認証の継承に対応します。
- **設定不要のヘルパー:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) と [`postmanToOpenApi`](./api-reference.md) は1回の呼び出しでアダプター登録と変換を行います。
- **OpenAPI 3.2 出力:** 各文書は `openapi: "3.2.0"` を宣言します。検証は既定で有効です。診断情報を確認するか、厳格モードを有効にしてエラー時に変換を失敗させてください。
- **複数リクエストの統合:** メソッドとパスが同じ操作を統合し、クエリ・ヘッダー・Cookie パラメーターと本文スキーマを構造的にマージします。
- **パスパラメーターの推論:** 数値 ID、UUID、ULID、長い16進数の区間が N 件以上のサンプルで変化する場合、`/users/{userId}` のようなテンプレートに変換します。
- **セキュリティの推論:** Bearer、Basic、ヘッダー・クエリ・Cookie の API キーを検出し、適切な `securitySchemes` を生成します。
- **多様な本文形式:** JSON、XML、form-urlencoded、multipart/form-data（テキストとファイル）、GraphQL、テキスト、バイナリ。
- **Postman テストスクリプトの保持:** `pm.test()` / `pm.expect()` を各操作の `x-postman-scripts` として出力します。
- **診断情報:** 各問題に重要度とコードを付与し、取得できる場合はソースの詳細も含めます。[`strict`](./api-reference.md#convertoptions) モードではエラー時に例外を送出します。
- **拡張可能:** [`SourceAdapter`](./api-reference.md) を実装すると HAR、HTTPie、Insomnia などのソースを追加できます。

---

## プラグイン構成

フレームワークは小さなアダプターインターフェースを中心に構成されています。

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

[`AdapterRegistry`](./api-reference.md#adapterregistry) を通じて [`XToOpenApi`](./api-reference.md#xtoopenapi) インスタンスにアダプターを登録します。

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

設定不要のヘルパーには2つのアダプターが組み込まれているため、通常はレジストリを直接操作する必要はありません。

---

## ヘルパーとクラスの使い分け

| 用途 | API |
|---|---|
| 単一または複数の curl コマンドを変換 | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Postman Collection のオブジェクトまたは文字列を変換 | [`postmanToOpenApi`](./api-reference.md) |
| 独自オプション、複数アダプター、`"auto"` 検出、独自アダプター | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## 次のステップ

- [インストール](./installation.md) — パッケージを追加し、設定不要のヘルパーを確認します。
- [クイックスタート](./quickstart.md) — curl コマンドや Postman Collection を変換し、独自アダプターを使います。
- [API リファレンス](./api-reference.md) — エクスポート、型、オプション、既定値、診断コードの一覧です。
- [使用例](./examples.md) — curl、バッチ処理、Postman Collection、独自アダプター、パス推論の例です。
