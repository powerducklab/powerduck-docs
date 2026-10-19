---
sidebar_position: 5
title: "使用例"
description: "公開 API を使った実行可能な実例です。文字列処理にはブラウザーで使える @powerduck/conf-patch/core、ファイル処理には @powerduck/conf-patch をインポートします。"
---

# 使用例

公開 API を使った実行可能な実例です。文字列処理にはブラウザーで使える `@powerduck/conf-patch/core`、ファイル処理には `@powerduck/conf-patch` をインポートします。

---

## 1. JSON Patch 操作（コア層）

JSON 文字列に複数の RFC 6902 操作を適用します。`add` は配列への挿入、またはオブジェクトのプロパティ追加・置換を行います。`replace` と `remove` は対象が既に存在している必要があります。

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

結果：

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

`strict: false` を指定すると、失敗した操作で例外を投げずにスキップします。

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. ネストした YAML の値を設定する（ファイル層）

YAML ファイルの `database.port` を設定します。親のパス（`database`）は存在している必要があります。書き込みはアトミックで、ロックにより保護されます。

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

まだ存在しないネストしたオブジェクトを作成するには、親を先に作ります。

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML の配列操作

シーケンスのインデックスには数値のパスセグメントを使います。`add` は**挿入**、`replace` は同じ位置での置換、`remove` は削除です。

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. コメントを保持する JSONC 編集

JSONC の編集はテキスト範囲単位で行うため、変更行の周囲にあるコメントや末尾のカンマは保持されます。

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

コメントが保持された結果：

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. OpenAPI ドキュメントを検証する

まず仕様の内容を直接検証し、次にファイルから検証します。ファイルモードでは、許可するパスを制限する `allowedRootDirectory` が必須です。

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

`AbortSignal` によるキャンセル：

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. ファイルロックによる安全な同時アクセス

複数のプロセス、または同じプロセス内の複数の同時処理が同じファイルにアクセスする場合、`patchConfigFile` がアクセスを直列化します。複数のファイル操作を 1 つのクリティカルセクションにまとめるには、`withFileLock` を直接使用します。

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

注意点：

- `withFileLock` はプロセス内の**同じファイル**への操作をキューに入れ、プロセス間では排他的な `.confedit.lock` ファイルを使用します。
- ロックの解放時は削除前に所有権トークンを検証するため、古いロックを引き継いだ新しいロックを古い解放処理が削除することはありません。
- 終了時（例：Electron の `will-quit`）に残っているロックを解放します。

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. 組み合わせ例：ディスク上の OpenAPI 仕様を編集する

ライブラリの実例に沿って、仕様を読み込み、値を設定し、レスポンスを追加してから検証します。

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## 次のステップ

- [API リファレンス](../api-reference/) — 全シグネチャと各オプションのデフォルト値。
- [クイックスタート](../quickstart/) — 最初の一連の操作。
