---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch は、明確な2層構成の設定編集ライブラリです。RFC 6902 JSON Patch のセマンティクスに従って JSON、JSONC、YAML 文字列を変更し、コメントと書式を保持します。Node.js と Electron 向けには、アトミック書き込みとプロセス間ファイルロックも提供します。"
---

# @powerduck/conf-patch

**@powerduck/conf-patch** は、明確な**2層構成**の設定編集ライブラリです。[RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) のセマンティクスに従って JSON、JSONC、YAML 文字列を変更し、コメントと書式を保持します。Node.js と Electron 向けには、アトミック書き込みとプロセス間ファイルロックも提供します。

- **バージョン:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **ライセンス:** MIT
- **Node.js 要件:** `>= 22.12.0`
- **ソースコード:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## conf-patch を使う理由

設定ファイルをプログラムから編集するとき、文書全体の再シリアライズではコメントや書式が変わることがあり、独自の文字列操作では不具合が生じやすくなります。conf-patch は次の機能を提供します。

- **コメントを保持する差分編集:** JSON/JSONC には `jsonc-parser`、YAML の AST 変更には `yaml` を使用します。JSON/JSONC は全体を再シリアライズせず、YAML は変更後の AST を再シリアライズします。
- **アトミック書き込み:** 一時ファイルへの書き込み後に名前を変更し、書き込み途中の内容が対象ファイルに残るのを防ぎます。
- **プロセス間ファイルロック:** 所有権トークン、指数バックオフ、古いロックの回復に対応します。
- **幅広い環境で使える API:** コア層はブラウザー、エッジ関数、IndexedDB を利用するアプリケーションでも動作します。

---

## 2層構成

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### コア層 — `@powerduck/conf-patch/core`（ブラウザー対応）

**文字列**を扱う純粋関数です。`node:fs`、`node:path` などの Node.js 固有 API に依存しません。このサブパスはブラウザー、エッジ関数、Service Worker のコードに組み込めます。

| 関数 | 用途 |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | 設定文字列に RFC 6902 操作を適用する |
| [`setContentValue`](../api-reference/#setcontentvalue) | ネストした値を設定または作成する（`add` を使用） |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | キーまたは配列要素を削除する（`remove` を使用） |

### ファイル層 — `@powerduck/conf-patch`（Node.js / Electron）

実際のファイルを読み書きする非同期関数です。コア層にアトミック書き込みとロックを追加します。

| 関数 | 用途 |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | ファイルパスまたは `file://` URL から UTF-8 テキストを読み込む |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | 内容をアトミックに書き込む。ロックは任意 |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | ファイルロック内で読み込み・変更・書き込みを実行する |
| [`setConfigValue`](../api-reference/#setconfigvalue) | ファイル内のネストした値を設定する |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | ファイル内のネストした値を削除する |
| [`withFileLock`](../api-reference/#withfilelock) | 排他ロック下で任意の処理を実行する |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | 現在のプロセスが所有するすべてのロックを解放する |

---

## 対応形式

| 形式 | 拡張子 | 動作 |
|---|---|---|
| **JSON** | `.json` | 標準 JSON。`jsonc-parser` による差分編集。 |
| **JSONC** | `.jsonc` | コメントと末尾のカンマを含む JSON。コメントを保持。 |
| **YAML** | `.yaml`, `.yml` | YAML 1.2。AST の変更時にコメント、アンカー、インデントを保持。 |

[`detectFormat`](../api-reference/#detectformat) は拡張子を [`ConfigFormat`](../api-reference/#configformat) に対応付けます。ほかの拡張子では、`format` を明示しない限りエラーになります。

---

## RFC 6902 操作

conf-patch は RFC 6902 の一部を実装しています。対応する操作は次の3つのみです。

| `op` | 動作 |
|---|---|
| `"add"` | 配列の指定位置に挿入、またはオブジェクトのプロパティを追加・置換 |
| `"replace"` | 既存の値を置換。パスが存在する必要あり |
| `"remove"` | 既存のキーまたは配列要素を削除。パスが存在する必要あり |

:::caution
`"move"`、`"copy"`、`"test"` は**非対応**です。[`JsonPatchOp`](../api-reference/#jsonpatchop) 型は `op` を `"add" | "replace" | "remove"` に制限します。
:::

動作上の注意点:

- 配列のインデックスに対する `add` は要素を**挿入**します（RFC 6902）。既存要素の置換には `replace` を使います。
- `add` では親パスが存在する必要があります。子より先に親を作成してください。
- `replace` と `remove` では対象パスが存在する必要があります。
- `strict: true`（既定値）では操作の失敗時に例外を送出します。`strict: false` ではその操作をスキップし、警告を記録します。

---

## コメントと書式の保持

- **JSON/JSONC:** 構文木から変更対象のテキスト範囲を計算するため、周囲のコメント、末尾のカンマ、インデントを保持します。
- **YAML:** `yaml` の AST を直接変更して再シリアライズし、コメント、アンカー、エイリアス、インデントを保持します。

---

## OpenAPI 検証

conf-patch は `@powerduck/openapi-parser` に安全対策を加えたインターフェースで OpenAPI/Swagger 文書を検証します。

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) は JSON または YAML の生の内容を検証します。
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) はファイルパスから文書を検証します。
- 入力処理にはサイズ制限、パスの制限（`allowedRootDirectory`）、構造の複雑さのチェック、期限、`AbortSignal` によるキャンセルが含まれます。
- 失敗すると、プログラムで判別できる `code` を持つ [`OpenApiValidationError`](../api-reference/#openapivalidationerror) を送出します。

---

## 次のステップ

- [インストール](../installation/) — conf-patch を追加し、2つのエントリーポイントを確認します。
- [クイックスタート](../quickstart/) — ブラウザー内の文字列とディスク上のファイルを変更します。
- [API リファレンス](../api-reference/) — エクスポート、型、オプションの一覧です。
- [使用例](../examples/) — JSON、YAML、JSONC、OpenAPI 検証、ロックの実行可能な例です。
