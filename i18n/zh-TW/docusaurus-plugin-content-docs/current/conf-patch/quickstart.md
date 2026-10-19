---
sidebar_position: 3
title: "快速入門"
description: "快速上手 @powerduck/conf-patch：透過相容瀏覽器的核心層修改 JSON/YAML 字串，再於 Node.js 或 Electron 編輯檔案。"
---

# 快速入門

本指南依序介紹兩層用法：先使用僅處理字串、適用於各環境的 **核心層**，再使用於 Node.js 或 Electron 操作實際檔案的 **檔案層**。

必要條件：請先安裝套件。 [安裝](/docs/zh-TW/conf-patch/installation/)

## 1. 核心層：在瀏覽器修改字串

從 `@powerduck/conf-patch/core` 匯入。核心層不存取檔案系統，而是傳回新內容字串，可儲存至 localStorage、IndexedDB 或字串常數等任意位置。

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

### 同樣適用於 YAML

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
`setContentValue` 使用 `add`，會 **新增或取代** 物件屬性；`deleteContentValue` 使用 `remove`。完整操作集請參閱 [`patchContent`](/docs/zh-TW/conf-patch/api-reference/#patchcontent)。
:::

## 2. 檔案層：修改磁碟上的檔案

從主要入口匯入。這些函式為 `async`，讀取及寫入實際檔案，並使用具鎖定機制的不可分割寫入。

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

格式會依副檔名（`.json`、`.jsonc`、`.yaml`、`.yml`）自動偵測。無法從副檔名明確判斷時，請直接指定 `format`。

## 3. 錯誤處理

兩層都會針對無效輸入擲回錯誤。預設的 `strict` 模式下，修補操作失敗也會擲回錯誤。

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

設定 `strict: false` 可略過失敗操作，而不擲回錯誤：

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC 範例

常見做法是在 Electron 主處理程序執行檔案層，再透過 IPC 提供呼叫：

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

## 後續步驟

- [API 參考](/docs/zh-TW/conf-patch/api-reference/) — 所有函式、型別與選項。
- [範例](/docs/zh-TW/conf-patch/examples/) — JSON 修補、YAML、含註解的 JSONC、OpenAPI 驗證與檔案鎖定。
