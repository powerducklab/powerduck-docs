---
sidebar_position: 5
title: "示例"
description: "基于公开 API 的实用、可运行示例。按需要选择导入入口：处理字符串使用浏览器安全的 @powerduck/conf-patch/core，处理文件使用 @powerduck/conf-patch。"
---

# 示例

基于公开 API 的实用、可运行示例。按需要选择导入入口：处理字符串使用浏览器安全的 `@powerduck/conf-patch/core`，处理文件使用 `@powerduck/conf-patch`。

---

## 1. JSON Patch 操作（核心层）

对 JSON 字符串应用多个 RFC 6902 操作。`add` 向数组插入元素，或添加、替换对象属性；`replace` 和 `remove` 要求目标已存在。

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

结果：

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

设置 `strict: false`，可跳过失败的操作而不抛出异常：

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. 设置嵌套的 YAML 值（文件层）

设置 YAML 文件中的 `database.port`。父路径（`database`）必须已存在；写入是原子的，并受文件锁保护。

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

创建尚不存在的嵌套对象时，先创建父对象：

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### YAML 中的数组操作

使用数字路径段作为序列索引。`add` 执行**插入**，`replace` 原位替换，`remove` 删除：

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. 保留注释的 JSONC 编辑

JSONC 编辑基于文本范围，因此会保留修改行周围的注释和尾随逗号。

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

结果，注意保留的注释：

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. 校验 OpenAPI 文档

先校验原始规范内容，再从文件进行校验。文件模式需要提供 `allowedRootDirectory` 以限制路径范围。

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

通过 `AbortSignal` 取消：

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

## 5. 使用文件锁保障并发访问

多个进程，或同一进程中的多个并发操作访问同一文件时，`patchConfigFile` 已经会串行化访问。如果需要将多个文件操作组成一个临界区，可直接使用 `withFileLock`。

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

说明：

- `withFileLock` 会将同一进程中对**同一文件**的操作排队，并通过独占的 `.confedit.lock` 文件协调跨进程访问。
- 释放锁时，删除锁文件前会检查所有权令牌，因此旧锁的释放不会误删接管过期锁后创建的新锁。
- 退出时，例如 Electron 的 `will-quit` 事件，应释放尚未释放的锁：

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

## 6. 综合示例：编辑磁盘上的 OpenAPI 规范

采用库自身的示例流程：读取规范、设置值、添加响应，然后校验。

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

## 后续阅读

- [API 参考](../api-reference/) — 完整签名及每个选项的默认值。
- [快速开始](../quickstart/) — 完成第一次端到端操作。
