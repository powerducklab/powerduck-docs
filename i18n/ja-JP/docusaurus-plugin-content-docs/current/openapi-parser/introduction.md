---
sidebar_position: 1
title: "はじめに"
description: "Swagger 2.0、OpenAPI 3.0、3.1、3.2 のいずれのドキュメントも、1 回の呼び出しで OpenAPI 3.2 に変換できます。"
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Swagger 2.0、OpenAPI 3.0、3.1、3.2 のいずれのドキュメントも、1 回の呼び出しで OpenAPI 3.2 に変換できます。

次の 2 つのライブラリを薄くラップしています： [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
解析、検証、変換を再実装するのではなく、それらを組み合わせています。すべての失敗は、機械可読なエラーコードを持つ一貫した予測可能な形式で返されます。

- **パッケージ名:** `@powerduck/openapi-parser`
- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **ライセンス:** MIT
- **Node.js:** >= 22.12.0

## 機能

- **1 つの関数ですべてのバージョンに対応** — Swagger 2.0、OpenAPI 3.0.x、3.1.x、3.2.x を、検証済みの 3.2 ドキュメントに変換します。
- **JSON・YAML 文字列の入力** — 解析済みオブジェクトまたは生の JSON/YAML 文字列を渡せます。
- **機械可読なエラーコード** — 失敗時には `UpgradeErrorCode` の列挙値を持つ `OpenApiUpgradeError` が発生します。
- **入力を変更しない** — 変換処理を始める前に `structuredClone` で入力をディープコピーします。
- **循環参照の検出** — スタックオーバーフローを引き起こす前に、入力の循環参照を検出します。
- **出力の検証** — 変換後の 3.2 ドキュメントは既定でスキーマ検証されます。
- **ESM と CJS に対応** — 最新の Node やバンドラーでは `import`、Electron のメインプロセスでは `require()` を使用できます。

## 次のステップ

- [インストール](/docs/ja-JP/openapi-parser/installation/) — インストールと要件
- [クイックスタート](/docs/ja-JP/openapi-parser/quickstart/) — 最初のドキュメントを変換する
- [API リファレンス](/docs/ja-JP/openapi-parser/api-reference/) — すべてのエクスポート、エラーコード、オプション
- [使用例](/docs/ja-JP/openapi-parser/examples/) — エラー処理、オプション、CommonJS での使用方法
