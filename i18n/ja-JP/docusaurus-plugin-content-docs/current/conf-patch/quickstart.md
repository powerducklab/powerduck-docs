---
sidebar_position: 3
title: "クイックスタート"
description: "@powerduck/conf-patch の基本：ブラウザー対応のコアで JSON/YAML 文字列を変更し、Node.js や Electron でファイルを編集します。"
---

# クイックスタート

このガイドでは 2 つの層を順に使います。まず、どの環境でも文字列だけを扱う **コア層**、次に Node.js や Electron で実ファイルを扱う **ファイル層**です。

前提条件：先にパッケージをインストールしてください。 [インストール](/docs/ja-JP/conf-patch/installation/)

## 1. コア層 — ブラウザーで文字列を変更する

`@powerduck/conf-patch/core` からインポートします。ファイルシステムにはアクセスせず、新しい内容を文字列で返します。localStorage、IndexedDB、文字列定数など、任意の場所に保存できます。

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### YAML でも同じように使う

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
`setContentValue` は `add` を使い、オブジェクトのプロパティを **追加または置換**します。`deleteContentValue` は `remove` を使います。全操作は [`patchContent`](/docs/ja-JP/conf-patch/api-reference/#patchcontent) を参照してください。
:::

## 2. ファイル層 — ディスク上のファイルを変更する

メインのエントリーポイントからインポートします。これらは `async` 関数で、実ファイルを読み書きし、ロック付きのアトミックな書き込みを行います。

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

形式は拡張子（`.json`、`.jsonc`、`.yaml`、`.yml`）から自動判定されます。判別できない場合は `format` を明示してください。

## 3. エラー処理

どちらの層も入力が不正ならエラーをスローします。既定の `strict` モードでは、パッチ操作の失敗時にもエラーをスローします。

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

`strict: false` を指定すると、エラーをスローせず、失敗した操作をスキップします。

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC の例

一般的には、Electron のメインプロセスでファイル層を実行し、IPC 経由で利用できるようにします。

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## 次のステップ

- [API リファレンス](/docs/ja-JP/conf-patch/api-reference/) — すべての関数、型、オプション。
- [使用例](/docs/ja-JP/conf-patch/examples/) — JSON パッチ、YAML、コメント付き JSONC、OpenAPI 検証、ファイルロック。
