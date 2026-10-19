---
sidebar_position: 4
title: "API リファレンス"
description: "@powerduck/conf-patch の全エクスポートについて、シグネチャと既定値をまとめたリファレンスです。"
---

# API リファレンス

`@powerduck/conf-patch` の全エクスポートについて、シグネチャと既定値をまとめたリファレンスです。

エントリーポイントは2つあります。

- **`@powerduck/conf-patch`** — 以下のすべての機能。コア層、ファイル層、OpenAPI 検証、ユーティリティを含みます。
- **`@powerduck/conf-patch/core`** — ブラウザー対応のサブセットのみ。`patchContent`、`setContentValue`、`deleteContentValue`、`PatchContentOptions`、アサーションヘルパー、`ConfigFormat`、`JsonPatchOp`、`JsonPathSegment` 型を含みます。

---

## コア層（ブラウザー対応）

### `patchContent`

設定文字列に RFC 6902 パッチ操作の配列を適用します。ファイルシステムにアクセスしない純粋関数です。

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `content` | `string` | 元の設定内容。指定した `format` として有効である必要があります。 |
| `ops` | `JsonPatchOp[]` | 順番に適用する操作。空の配列では `content` を変更せず返します。 |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`。 |
| `options.strict` | `boolean` | `true`（既定値）では操作の失敗時に例外を送出します。`false` ではスキップし、`console.warn` で警告します。 |

**戻り値:** パッチ適用後の設定内容（`string`）。

**例外:** `content` が文字列でない場合や `ops` が無効な場合は `TypeError`。`strict` が `true` の場合は失敗した操作を示すエラー。

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

単一の値を設定または作成します。内部で `patchContent` に1つの `add` 操作を渡します。RFC 6902 に従い、`add` は既存のオブジェクトプロパティを置換するか、配列の指定位置に挿入します。

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `content` | `string` | 元の設定内容。 |
| `path` | `readonly (string \| number)[]` | `["server", "port"]` などの区切られたパス。空にはできません。 |
| `value` | `unknown` | 書き込む値。 |
| `format` | `ConfigFormat` | 設定形式。 |

**戻り値:** 更新後の内容（`string`）。

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

キーまたは配列要素を削除します。内部で `patchContent` に1つの `remove` 操作を渡します。対象パスが存在する必要があります。

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## ファイル層（Node.js / Electron のみ）

### `readConfigFile`

ローカルパスまたは `file://` URL から UTF-8 テキストを読み込みます。

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `filePath` | `string` | 絶対パス、相対パス、または `file://` URL。空にはできません。 |

**戻り値:** 元の UTF-8 内容（`Promise<string>`）。

**例外:** 読み込めない場合、元のファイルシステムエラーを含むエラー。

---

### `writeConfigFile`

一時ファイルと名前変更による**アトミック書き込み**を行います。既定では排他的な**ファイルロック**を使用します。ロック前に親ディレクトリを作成します。

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `filePath` | `string` | 設定ファイルへのパス。 |
| `content` | `string` | 書き込む内容。文字列である必要があります。 |
| `options` | `WriteConfigOptions` | 下記を参照。 |

**例外:** 無効な入力では `TypeError`。書き込み時のファイルシステムエラーはラップされます。

#### `WriteConfigOptions`

| オプション | 型 | 既定値 | 説明 |
|---|---|---|---|
| `lock` | `boolean` | `true` | 書き込み中のファイルロックを有効にします。 |
| `lockTimeoutMs` | `number` | `withFileLock` の既定値（10 秒） | ロック取得まで待機する最大時間（ミリ秒）。 |
| `lockRetryDelayMs` | `number` | `withFileLock` の既定値（25 ミリ秒） | 指数バックオフ前の初回再試行待機時間（ミリ秒）。 |
| `lockStaleThresholdMs` | `number` | `withFileLock` の既定値 | 回復が許可されるまでのロック経過時間（ミリ秒）。 |
| `allowStaleRecovery` | `boolean` | `false` | 古いロックの自動回収を許可するかどうか。 |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

ファイル層の主要なトランザクションです。ロック内で読み込み、`patchContent` を適用し、**内容が変わった場合のみ**アトミックに書き戻します。`options.format` を省略すると拡張子から形式を判定します。

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `filePath` | `string` | 設定ファイルへのパス。空にはできません。 |
| `ops` | `JsonPatchOp[]` | 適用する操作。空の配列では読み書きせずに戻ります。 |
| `options` | `PatchConfigOptions` | 下記を参照。 |

**例外:** `filePath` が空、ロックオプションが無効、または形式を判定できず `format` も指定されていない場合は `TypeError`。`strict` が `true` の場合は操作エラー。

#### `PatchConfigOptions`

| オプション | 型 | 既定値 | 説明 |
|---|---|---|---|
| `format` | `ConfigFormat` | 自動判定 | 明示的な形式。拡張子による判定より優先します。 |
| `strict` | `boolean` | `true` | 操作の失敗時に例外を送出します。 |
| `lock` | `boolean` | `true` | ファイルロックを有効にします。 |
| `lockTimeoutMs` | `number` | 10 秒 | 0 以上。ロックの最大待機時間。 |
| `lockRetryDelayMs` | `number` | 25 ミリ秒 | 正の値。初回再試行待機時間。 |
| `lockStaleThresholdMs` | `number` | 計算値 | 正の値。古いロックの回復に必要な経過時間。 |
| `allowStaleRecovery` | `boolean` | `false` | 古いロックを自動回収します。 |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

ファイル内のネストした値を追加または置換します。1つの `add` 操作を `patchConfigFile` に渡します。

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

ファイル内の既存のネストした値を削除します。1つの `remove` 操作を `patchConfigFile` に渡します。

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

プロセス内キュー**と**排他的ロックファイル（`<file>.confedit.lock`）を使って非同期コールバックを実行します。ロックは所有権トークンを使用します。`allowStaleRecovery` が `true` で、経過時間が `staleThresholdMs` を超えた場合のみ古いロックを回復します。PID は再利用される可能性があるため検査しません。

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `filePath` | `string` | ロックするファイル。 |
| `callback` | `() => Promise<T>` | ロック保持中に実行する処理。 |
| `options` | `FileLockOptions` | 下記を参照。 |

**戻り値:** `callback` の結果（`Promise<T>`）。コールバックが例外を送出しても、`finally` ブロックでロックを解放します。

#### `FileLockOptions`

| オプション | 型 | 既定値 | 説明 |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | ロックの最大待機時間（ミリ秒）。0 以上である必要があります。 |
| `retryDelayMs` | `number` | `25` | 初回再試行待機時間（ミリ秒）。正の値が必要です。待機時間は1.5倍ずつ増え、最大1000ミリ秒です。 |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | 回復を許可するロック経過時間（ミリ秒）。正の値が必要です。 |
| `allowStaleRecovery` | `boolean` | `false` | 古いロックの自動回収。実行中のトランザクションを中断しないよう、Electron の単一メインプロセス向けに既定で無効です。 |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

現在のプロセスが所有するロックファイルをすべて削除します。実行中のファイルトランザクションが終わった後、アプリ終了時に使用してください。Electron の非同期クリーンアップでは最初の終了イベントを止め、処理後に終了を再開します。使用例を参照してください。個別ロックの削除エラーは無視します。

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI 検証

### `validateOpenAPISpec`

JSON または YAML の OpenAPI/Swagger 内容を検証します。既定では入力を**内容**として扱い、`inputKind: "file"` の場合のみファイルパスと解釈します。検証は `@powerduck/openapi-parser` に委譲し、この関数が入力の安全対策を追加します。

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| パラメーター | 型 | 説明 |
|---|---|---|
| `input` | `string` | 仕様の元の内容。`inputKind: "file"` の場合はファイルパス。 |
| `options` | `ValidateOpenApiOptions` | 下記を参照。 |

**戻り値:** 成功時の検証済み文書（`Promise<AnyOpenAPIDocument>`）。

**例外:** 空または文字列でない入力では `TypeError`。無効なオプションや検証中の失敗では [`OpenApiValidationError`](#openapivalidationerror)。

---

### `validateOpenAPIFile`

`inputKind: "file"` と、指定パスを設定した `baseFilePath` を使って `validateOpenAPISpec` を呼ぶ便利なラッパーです。`allowedRootDirectory` が必要です。

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| オプション | 型 | 既定値 | 説明 |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | `input` の解釈方法。 |
| `baseFilePath` | `string` | — | 参照解決コンテキストの基準パス。 |
| `allowedRootDirectory` | `string` | — | ファイル入力のルートディレクトリ。`inputKind` が `"file"` の場合は**必須**。 |
| `timeoutMs` | `number` | `15000` | 操作の制限時間（ミリ秒）。 |
| `maxInputBytes` | `number` | `5242880`（5 MB） | 入力内容の最大バイト数。 |
| `maxDocumentNodes` | `number` | `100000` | 解析後の文書の最大ノード数。DoS 対策。 |
| `maxDocumentDepth` | `number` | `100` | 最大ネスト深度。DoS 対策。 |
| `maxValidationErrors` | `number` | `50` | エラーメッセージに含める最大エラー数。 |
| `maxErrorMessageLength` | `number` | `1000` | 検証エラー1件あたりの最大文字数。 |
| `signal` | `AbortSignal` | — | 任意のキャンセルシグナル。 |

---

### `OpenApiValidationError`

検証失敗時の構造化エラーです。クライアントに返す前にアプリケーション境界で適切なエラーに変換してください。メッセージや原因にローカルパスや文書の詳細が含まれることがあります。

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| プロパティ | 型 | 説明 |
|---|---|---|
| `code` | `string` | プログラムで判別するエラーコード。下表を参照。 |
| `message` | `string` | 人が読める詳細説明。 |
| `cause` | `unknown` | 任意の元のエラー。 |

#### エラーコード

| コード | 意味 |
|---|---|
| `INVALID_OPTION` | 無効なオプション値が指定されました。 |
| `INPUT_TOO_LARGE` | 元の内容が `maxInputBytes` を超えています。 |
| `INPUT_FILE_TOO_LARGE` | 入力ファイルがサイズ制限を超えています。 |
| `FILE_INPUT_FORBIDDEN` | `allowedRootDirectory` なしでファイル入力を使用しました。 |
| `PATH_OUTSIDE_ROOT` | 解決後のファイルパスが `allowedRootDirectory` の外部にあります。 |
| `PARSE_ERROR` | JSON/YAML 内容の解析に失敗しました。 |
| `INVALID_DOCUMENT_SHAPE` | 文書が JSON オブジェクトではありません。 |
| `UNSUPPORTED_VERSION` | 文書が対応する OpenAPI/Swagger バージョンを宣言していません。メジャーバージョン `2` と `3` のみ対応します。 |
| `DOCUMENT_TOO_DEEP` | ネスト深度が `maxDocumentDepth` を超えています。 |
| `DOCUMENT_TOO_LARGE` | ノード数が `maxDocumentNodes` を超えています。 |
| `SPEC_VALIDATION_FAILED` | 仕様が OpenAPI 検証に失敗しました。 |
| `OPERATION_TIMEOUT` | 操作が `timeoutMs` を超過しました。 |
| `OPERATION_ABORTED` | `signal` によって操作がキャンセルされました。 |
| `UNKNOWN_ERROR` | 予期しないエラー。 |

---

## ユーティリティ

### `detectFormat`

ファイルパスまたは `file://` URL の拡張子から [`ConfigFormat`](#configformat) を判定します。

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| 拡張子 | 結果 |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| その他の拡張子 | エラーを送出 |

---

### `normalizeFilePath`

ローカルパスまたは `file:` URL をネイティブの絶対パスに変換します。有効な空白と Unicode ファイル名を保持します。

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL は `fileURLToPath` でデコードします。絶対パスはそのまま返し、相対パスは `process.cwd()` を基準に解決します。

---

## アサーションヘルパー

高度な利用や内部モジュール向けに再エクスポートされています。通常、アプリケーションから直接呼ぶ必要はありません。

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
`value` が空でない文字列でなければ `TypeError` を送出します。

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
`path` が空でない配列で、各要素が空でない文字列または安全な0以上の整数という条件を満たさなければ例外を送出します。

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
各操作を検証します。`op` は `"add" | "replace" | "remove"`、`path` は `assertPatchPath` を満たす必要があります。`add`/`replace` は自身の `value` プロパティを持つ必要があります。

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
`format` が `"json"`、`"jsonc"`、`"yaml"` のいずれでもなければ例外を送出します。

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
`Error` インスタンスでは `error.message`、それ以外では `String(error)` を返します。

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
`Error` を作成し、`Object.defineProperty` で `cause` プロパティを追加します。古いランタイム向けの代替処理もあります。

---

## 型

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
対応するのは `"add"`、`"replace"`、`"remove"` のみです。`"move"`、`"copy"`、`"test"` は意図的に対象外としています。
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

検証が返す、対応 OpenAPI/Swagger 文書構造のユニオン型です。

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` は許容範囲の広い構造型です。

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## エクスポート一覧

| シンボル | メイン入口 | コアのサブパス | 種別 |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | 関数 |
| `setContentValue` | ✓ | ✓ | 関数 |
| `deleteContentValue` | ✓ | ✓ | 関数 |
| `PatchContentOptions` | ✓ | ✓ | 型 |
| `assertNonEmptyString` | ✓ | ✓ | 関数 |
| `assertPatchPath` | ✓ | ✓ | 関数 |
| `assertPatchOperations` | ✓ | ✓ | 関数 |
| `assertConfigFormat` | ✓ | ✓ | 関数 |
| `getErrorMessage` | ✓ | ✓ | 関数 |
| `createError` | ✓ | ✓ | 関数 |
| `ConfigFormat` | ✓ | ✓ | 型 |
| `JsonPatchOp` | ✓ | ✓ | 型 |
| `JsonPathSegment` | ✓ | ✓ | 型 |
| `readConfigFile` | ✓ | — | 関数 |
| `writeConfigFile` | ✓ | — | 関数 |
| `WriteConfigOptions` | ✓ | — | 型 |
| `patchConfigFile` | ✓ | — | 関数 |
| `setConfigValue` | ✓ | — | 関数 |
| `deleteConfigValue` | ✓ | — | 関数 |
| `withFileLock` | ✓ | — | 関数 |
| `releaseAllLocalLocks` | ✓ | — | 関数 |
| `PatchConfigOptions` | ✓ | — | 型 |
| `FileLockOptions` | ✓ | — | 型 |
| `detectFormat` | ✓ | — | 関数 |
| `normalizeFilePath` | ✓ | — | 関数 |
| `validateOpenAPISpec` | ✓ | — | 関数 |
| `validateOpenAPIFile` | ✓ | — | 関数 |
| `OpenApiValidationError` | ✓ | — | クラス |
| `ValidateOpenApiOptions` | ✓ | — | 型 |
| `OpenApiInputKind` | ✓ | — | 型 |
| `AnyOpenAPIDocument` | ✓ | — | 型 |