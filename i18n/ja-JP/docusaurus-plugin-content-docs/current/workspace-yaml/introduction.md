---
sidebar_position: 1
title: "はじめに"
description: "workspace.yaml と OpenAPI 3.2 の YAML ファイルを確実に初期化します。 ブラウザーで使用可能な純粋関数が YAML 文字列を生成します。ファイルシステムにはアクセスしません。 Node.js / Electron 向けに、コア層へアトミック書き込み、ファイルロック、パスの正規化を追加します。"
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

workspace.yaml と OpenAPI 3.2 の YAML ファイルを確実に初期化します。

2 層構成のアーキテクチャ：
- **コア層**: ブラウザーで使用可能な純粋関数が YAML 文字列を生成します。ファイルシステムにはアクセスしません。
- **ファイル層**: Node.js / Electron 向けに、コア層へアトミック書き込み、ファイルロック、パスの正規化を追加します。

- **パッケージ名:** `@powerduck/workspace-yaml`
- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **ライセンス:** MIT

このライブラリは**ファイルの初期化専用**です。新規ファイルの作成や手動作成に使用します。YAML ファイルの読み込み、パッチ適用、更新の機能を再実装するものでは**ありません**。これらの操作には次のパッケージを使用してください： [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## 次のステップ

- [インストール](/docs/ja-JP/workspace-yaml/installation/)
- [クイックスタート](/docs/ja-JP/workspace-yaml/quickstart/)
- [API リファレンス](/docs/ja-JP/workspace-yaml/api-reference/)
- [使用例](/docs/ja-JP/workspace-yaml/examples/)
