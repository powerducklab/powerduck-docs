---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch 是采用清晰双层架构的配置编辑库。它遵循 RFC 6902 JSON Patch 语义修改 JSON、JSONC 和 YAML 字符串，保留注释与格式，并为 Node.js 和 Electron 提供原子写入和跨进程文件锁。"
---

# @powerduck/conf-patch

**@powerduck/conf-patch** 是采用清晰**双层架构**的配置编辑库。它遵循 [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) 语义修改 JSON、JSONC 和 YAML 字符串，保留注释与格式，并为 Node.js 和 Electron 提供原子写入和跨进程文件锁。

- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **许可证：** MIT
- **Node.js 要求：** `>= 22.12.0`
- **源码：** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## 为什么选择 conf-patch？

通过代码修改配置文件，往往需要在两种方案间取舍：重新序列化整个文档可能改变注释、空白和格式，手工操作文本又容易出错。conf-patch 提供：

- **保留注释的增量修改：** JSON/JSONC 使用 `jsonc-parser`，YAML 使用 `yaml` 修改 AST。JSON/JSONC 无需整体重新序列化；YAML 则重新序列化修改后的 AST。
- **原子写入：** 先写入临时文件再重命名，避免目标文件只写入一部分。
- **跨进程文件锁：** 支持所有权令牌、指数退避重试和过期锁恢复。
- **适用于多种环境的 API：** 核心层可在浏览器、边缘函数和使用 IndexedDB 存储的应用中运行。

---

## 双层架构

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

### 核心层 — `@powerduck/conf-patch/core`（兼容浏览器）

操作**字符串**的纯函数，不依赖 `node:fs`、`node:path` 或其他 Node.js 专用 API。此子路径导出可打包到浏览器、边缘函数或 Service Worker 代码中。

| 函数 | 用途 |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | 对配置字符串应用一组 RFC 6902 操作 |
| [`setContentValue`](../api-reference/#setcontentvalue) | 设置或创建嵌套值（使用 `add`） |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | 删除键或数组元素（使用 `remove`） |

### 文件层 — `@powerduck/conf-patch`（Node.js / Electron）

读写实际文件的异步函数，在核心层之上提供原子写入和锁机制。

| 函数 | 用途 |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | 从文件路径或 `file://` URL 读取 UTF-8 文本 |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | 原子写入内容，可选择加锁 |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | 在文件锁内执行读取、修改、写入事务 |
| [`setConfigValue`](../api-reference/#setconfigvalue) | 设置文件中的嵌套值 |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | 删除文件中的嵌套值 |
| [`withFileLock`](../api-reference/#withfilelock) | 在独占锁保护下执行任务 |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | 释放当前进程持有的所有锁 |

---

## 支持的格式

| 格式 | 扩展名 | 行为 |
|---|---|---|
| **JSON** | `.json` | 标准 JSON，通过 `jsonc-parser` 增量修改。 |
| **JSONC** | `.jsonc` | 支持注释和尾随逗号的 JSON，保留注释。 |
| **YAML** | `.yaml`, `.yml` | YAML 1.2，通过 AST 修改保留注释、锚点和缩进。 |

[`detectFormat`](../api-reference/#detectformat) 将文件扩展名映射到 [`ConfigFormat`](../api-reference/#configformat)。其他扩展名会触发错误，除非显式传入 `format`。

---

## RFC 6902 操作

conf-patch 实现 RFC 6902 的一个子集，仅支持以下操作：

| `op` | 行为 |
|---|---|
| `"add"` | 在数组索引处插入，或添加、替换对象属性 |
| `"replace"` | 替换已有值，路径必须存在 |
| `"remove"` | 删除已有键或数组元素，路径必须存在 |

:::caution
**不支持** `"move"`、`"copy"` 和 `"test"`。[`JsonPatchOp`](../api-reference/#jsonpatchop) 类型将 `op` 限定为 `"add" | "replace" | "remove"`。
:::

行为说明：

- 对数组索引执行 `add` 会**插入**元素（RFC 6902）。要替换已有元素，请使用 `replace`。
- `add` 要求父路径已存在；请先创建父节点，再创建子节点。
- `replace` 和 `remove` 要求目标路径已存在。
- 设置 `strict: true`（默认值）时，操作失败会抛出异常；设置 `strict: false` 时，会跳过失败操作并记录警告。

---

## 保留注释与格式

- **JSON/JSONC：** 根据语法树计算需要修改的文本区间，保留周围的注释、尾随逗号和缩进。
- **YAML：** 原地修改 `yaml` AST 后重新序列化，保留注释、锚点、别名和缩进。

---

## OpenAPI 校验

conf-patch 对 `@powerduck/openapi-parser` 进行安全封装，用于校验 OpenAPI/Swagger 文档：

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) 校验原始 JSON 或 YAML 内容。
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) 根据文件路径校验文档。
- 输入处理涵盖大小限制、路径沙箱（`allowedRootDirectory`）、结构复杂度检查、超时控制和 `AbortSignal` 取消。
- 失败时抛出 [`OpenApiValidationError`](../api-reference/#openapivalidationerror)，包含可供程序识别的 `code`。

---

## 后续阅读

- [安装](../installation/) — 将 conf-patch 添加到项目，并了解两个入口。
- [快速开始](../quickstart/) — 修改浏览器中的字符串和磁盘上的文件。
- [API 参考](../api-reference/) — 查看所有导出、类型和选项。
- [示例](../examples/) — JSON、YAML、JSONC、OpenAPI 校验和文件锁的可运行示例。
