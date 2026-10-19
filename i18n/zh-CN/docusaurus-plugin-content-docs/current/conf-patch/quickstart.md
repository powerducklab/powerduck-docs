---
sidebar_position: 3
title: "快速开始"
description: "快速上手 @powerduck/conf-patch：通过兼容浏览器的核心层修改 JSON/YAML 字符串，再在 Node.js 或 Electron 中编辑文件。"
---

# 快速开始

本指南依次介绍两层用法：先使用只处理字符串、适用于各环境的 **核心层**，再使用在 Node.js 或 Electron 中操作真实文件的 **文件层**。

前提条件：先安装此包。 [安装](/docs/zh-CN/conf-patch/installation/)

## 1. 核心层：在浏览器中修改字符串

从 `@powerduck/conf-patch/core` 导入。核心层不访问文件系统，而是返回新内容字符串，你可以将其保存到 localStorage、IndexedDB 或字符串常量等任意位置。

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

### 同样适用于 YAML

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
`setContentValue` 使用 `add`，会 **添加或替换** 对象属性；`deleteContentValue` 使用 `remove`。完整操作集见 [`patchContent`](/docs/zh-CN/conf-patch/api-reference/#patchcontent)。
:::

## 2. 文件层：修改磁盘上的文件

从主入口导入。这些函数是 `async` 函数，读取和写入真实文件，并使用带锁的原子写入。

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

格式会根据扩展名（`.json`、`.jsonc`、`.yaml`、`.yml`）自动识别。扩展名无法明确判断时，请显式传入 `format`。

## 3. 错误处理

两层都会对无效输入抛出错误。默认的 `strict` 模式下，补丁操作失败也会抛出错误。

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

设置 `strict: false` 可跳过失败操作，而不是抛出错误：

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron IPC 示例

常见做法是在 Electron 主进程中运行文件层，再通过 IPC 提供调用：

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

## 下一步

- [API 参考](/docs/zh-CN/conf-patch/api-reference/) — 所有函数、类型和选项。
- [示例](/docs/zh-CN/conf-patch/examples/) — JSON 补丁、YAML、带注释的 JSONC、OpenAPI 校验和文件锁。
