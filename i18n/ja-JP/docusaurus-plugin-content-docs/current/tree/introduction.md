---
sidebar_position: 1
title: "はじめに"
description: "API ナビゲーション、スキーマ閲覧、ドキュメント向けの拡張可能なツリーコンポーネントです。汎用コアを基盤とし、OpenAPI、JSON Schema、カスタムデータソース用のアダプターを備えています。"
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

API ナビゲーション、スキーマ閲覧、ドキュメント向けの拡張可能なツリーコンポーネントです。汎用コアを基盤とし、OpenAPI、JSON Schema、カスタムデータソース用のアダプターを備えています。

- **パッケージ名:** `@powerduck/tree`
- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **ライセンス:** MIT

## 機能

- **汎用コア** — `TreeNode<TMetadata>` は任意のデータソースに対応
- **OpenAPI アダプター** — OAS 3.2 のネストしたタグ、`x-tagGroups`、`x-order`、`x-displayName`、`x-internal` に対応するタグベースのナビゲーション
- **JSON Schema アダプター** — ネストしたプロパティ、配列、結合スキーマを深く展開し、`jsonPath` メタデータを提供
- **ドキュメントアダプター** — 操作数バッジ付きの Stripe 風ドキュメントツリー
- **React コンポーネント** — 検索、展開／折りたたみ、キーボード操作、メソッドバッジ、カスタム描画用 props
- **ドラッグ＆ドロップ** — 同じ親の下での並べ替えや、階層をまたぐフォルダーへの移動
- **コンテキストメニュー** — 右クリックまたはその他ボタンでノードごとの操作を表示
- **命令的な位置指定** — `locateNode(predicate)` がノードを検索し、祖先を展開して選択し、表示範囲までスクロール
- **JSON Patch 連携** — `onPatch` コールバックが RFC 6902 操作を通知
- **CSS 変数によるテーマ設定** — Powerduck の `tokens.css` と互換性があり、ライト／ダークモードに対応

## 次のステップ

- [インストール](/docs/ja-JP/tree/installation/)
- [クイックスタート](/docs/ja-JP/tree/quickstart/)
- [API リファレンス](/docs/ja-JP/tree/api-reference/)
- [使用例](/docs/ja-JP/tree/examples/)
