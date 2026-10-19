---
sidebar_position: 5
title: "範例"
description: "使用公開 API 的實用、可執行範例。依需求選擇匯入入口：處理字串時使用適合瀏覽器的 @powerduck/conf-patch/core，處理檔案時使用 @powerduck/conf-patch。"
---

# 範例

使用公開 API 的實用、可執行範例。依需求選擇匯入入口：處理字串時使用適合瀏覽器的 `@powerduck/conf-patch/core`，處理檔案時使用 `@powerduck/conf-patch`。

---

## 1. JSON Patch 操作（核心層）

對 JSON 字串套用多個 RFC 6902 操作。`add` 插入陣列元素，或新增、取代物件屬性；`replace` 與 `remove` 要求目標已存在。

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

設定 `strict: false` 可略過失敗的操作，而不擲回例外狀況：

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. 設定巢狀 YAML 值（檔案層）

設定 YAML 檔案中的 `database.port`。父路徑（`database`）必須已存在；寫入為不可分割的操作，並受鎖定保護。

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

若要建立尚不存在的巢狀物件，請先建立父物件：

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML 中的陣列操作

以數字路徑區段作為序列索引。`add` 會**插入**，`replace` 在原位置取代，`remove` 刪除：

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. 保留註解的 JSONC 編輯

JSONC 編輯以文字範圍為基礎，因此會保留修改行周圍的註解與尾端逗號。

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

結果，請注意保留的註解：

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. 驗證 OpenAPI 文件

先驗證原始規格內容，再從檔案驗證。檔案模式需要 `allowedRootDirectory` 來限制允許存取的路徑。

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

透過 `AbortSignal` 取消：

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

## 5. 使用檔案鎖定確保並行存取安全

多個處理程序，或同一處理程序中的多個並行操作存取同一檔案時，`patchConfigFile` 已會將存取依序執行。若要把多個檔案操作組成一個臨界區段，可直接使用 `withFileLock`。

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

注意事項：

- `withFileLock` 將同一處理程序中對**同一檔案**的操作排入佇列，並使用獨佔的 `.confedit.lock` 檔案協調跨處理程序存取。
- 釋放鎖定時，移除檔案前會驗證擁有權權杖，因此釋放舊鎖不會誤刪接管過期鎖定後建立的新鎖。
- 結束時，例如 Electron 的 `will-quit` 事件，請釋放尚未釋放的鎖定：

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

## 6. 完整範例：編輯磁碟上的 OpenAPI 規格

採用函式庫本身的範例流程：讀取規格、設定值、新增回應，最後驗證。

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

## 接下來

- [API 參考](../api-reference/) — 完整簽章與所有選項的預設值。
- [快速入門](../quickstart/) — 完成第一次端對端操作。
