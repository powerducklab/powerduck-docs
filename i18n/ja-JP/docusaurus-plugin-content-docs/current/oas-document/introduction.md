---
sidebar_position: 1
title: "はじめに"
description: "本番環境向けの React 用 OpenAPI ドキュメントコンポーネントです。OAS ドキュメントを渡すと、ヘッダーナビゲーション、ライト／ダークテーマ、ツリーナビゲーション、スクロール位置の追跡、スキーマ閲覧、複数言語のコード例を備えた Stripe 風の API ドキュメント UI を表示できます。"
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

本番環境向けの React 用 OpenAPI ドキュメントコンポーネントです。OAS ドキュメントを渡すと、ヘッダーナビゲーション、ライト／ダークテーマ、ツリーナビゲーション、スクロール位置の追跡、スキーマ閲覧、複数言語のコード例を備えた Stripe 風の API ドキュメント UI を表示できます。

- **パッケージ名:** `@powerduck/oas-document`
- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **ライセンス:** MIT

使用しているライブラリ: `@powerduck/openapi-parser` (検証と自動変換), `@powerduck/tree` (ナビゲーション), `@powerduck/md-editor` (Markdown の描画), `@powerduck/openapi-codegen` (リクエストコードの生成).

## 機能

- **すぐに使える API ドキュメント** — 解析済みオブジェクト、JSON 文字列、YAML 文字列を受け付ける
- **Stripe 風のレイアウト** — 設定可能なヘッダー、サイドバーツリー、2 列の操作ビュー
- **ライト／ダークテーマ** — ヘッダーで切り替え、選択内容を localStorage に保存
- **OAS 3.2 への自動変換** — `@powerduck/openapi-parser` で検証と変換を行う
- **スクロール連動ナビゲーション** — パッシブスクロールリスナーと二分探索を使用
- **Markdown の描画** — 説明文を `@powerduck/md-editor` で描画
- **複数言語のコード例** — `@powerduck/openapi-codegen` で生成
- **スキーマ閲覧** — 展開と折りたたみが可能なネストしたプロパティ表
- **レスポンシブ対応** — モバイルではサイドバーをオーバーレイに切り替える

## 次のステップ

- [インストール](/docs/ja-JP/oas-document/installation/)
- [クイックスタート](/docs/ja-JP/oas-document/quickstart/)
- [API リファレンス](/docs/ja-JP/oas-document/api-reference/)
- [使用例](/docs/ja-JP/oas-document/examples/)
