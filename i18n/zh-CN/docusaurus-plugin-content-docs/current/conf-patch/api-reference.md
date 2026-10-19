---
sidebar_position: 4
title: "API 参考"
description: "@powerduck/conf-patch 完整参考，涵盖各导出符号的签名和默认值。"
---

# API 参考

`@powerduck/conf-patch` 完整参考，涵盖各导出符号的签名和默认值。

提供两个入口：

- **`@powerduck/conf-patch`** — 下列所有功能：核心层、文件层、OpenAPI 校验和工具函数。
- **`@powerduck/conf-patch/core`** — 仅包含兼容浏览器的子集：`patchContent`、`setContentValue`、`deleteContentValue`、`PatchContentOptions`、断言辅助函数，以及 `ConfigFormat`、`JsonPatchOp`、`JsonPathSegment` 类型。

---

## 核心层（兼容浏览器）

### `patchContent`

对配置字符串应用一组 RFC 6902 补丁操作。此函数为纯函数，不访问文件系统。

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `content` | `string` | 原始配置内容，必须符合指定的 `format`。 |
| `ops` | `JsonPatchOp[]` | 按顺序执行的操作。空数组会原样返回 `content`。 |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`。 |
| `options.strict` | `boolean` | 为 `true`（默认值）时，操作失败会抛出异常；为 `false` 时，跳过失败操作并调用 `console.warn`。 |

**返回：** 应用补丁后的配置内容（`string`）。

**异常：** `content` 不是字符串或 `ops` 无效时抛出 `TypeError`；`strict` 为 `true` 时，抛出说明失败操作的错误。

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

设置或创建单个值。内部调用 `patchContent` 执行一次 `add` 操作。按 RFC 6902 语义，`add` 替换已有对象属性，或在数组索引处插入元素。

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `content` | `string` | 原始配置内容。 |
| `path` | `readonly (string \| number)[]` | 分段路径，如 `["server", "port"]`，不能为空。 |
| `value` | `unknown` | 要写入的值。 |
| `format` | `ConfigFormat` | 配置格式。 |

**返回：** 更新后的内容（`string`）。

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

删除键或数组元素。内部调用 `patchContent` 执行一次 `remove` 操作，目标路径必须存在。

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

## 文件层（仅 Node.js / Electron）

### `readConfigFile`

从本地文件路径或 `file://` URL 读取 UTF-8 文本。

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `filePath` | `string` | 绝对路径、相对路径或 `file://` URL，不能为空。 |

**返回：** 原始 UTF-8 内容（`Promise<string>`）。

**异常：** 无法读取文件时，抛出封装底层文件系统错误的异常。

---

### `writeConfigFile`

通过**原子写入**（临时文件加重命名）写入内容，默认使用独占**文件锁**。加锁前会创建父目录。

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `filePath` | `string` | 配置文件路径。 |
| `content` | `string` | 要写入的内容，必须是字符串。 |
| `options` | `WriteConfigOptions` | 见下文。 |

**异常：** 输入无效时抛出 `TypeError`；写入失败时封装底层文件系统错误。

#### `WriteConfigOptions`

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `lock` | `boolean` | `true` | 写入时启用文件锁。 |
| `lockTimeoutMs` | `number` | `withFileLock` 默认值（10 秒） | 等待获取锁的最长时间，单位为毫秒。 |
| `lockRetryDelayMs` | `number` | `withFileLock` 默认值（25 毫秒） | 指数退避前的初始重试延迟，单位为毫秒。 |
| `lockStaleThresholdMs` | `number` | `withFileLock` 默认值 | 允许恢复锁之前，锁需要存在的时长，单位为毫秒。 |
| `allowStaleRecovery` | `boolean` | `false` | 是否允许自动回收过期锁。 |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

文件层的主要事务：在锁内读取文件，应用 `patchContent`，并且**仅在内容改变时**原子写回。未提供 `options.format` 时根据扩展名自动识别格式。

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `filePath` | `string` | 配置文件路径，不能为空。 |
| `ops` | `JsonPatchOp[]` | 要执行的操作。空数组直接返回，不读取或写入文件。 |
| `options` | `PatchConfigOptions` | 见下文。 |

**异常：** `filePath` 为空、锁选项无效，或无法识别格式且未提供 `format` 时抛出 `TypeError`；`strict` 为 `true` 时抛出操作错误。

#### `PatchConfigOptions`

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `format` | `ConfigFormat` | 自动识别 | 显式指定格式，优先于扩展名识别结果。 |
| `strict` | `boolean` | `true` | 操作失败时抛出异常。 |
| `lock` | `boolean` | `true` | 启用文件锁。 |
| `lockTimeoutMs` | `number` | 10 秒 | 非负值，等待锁的最长时间。 |
| `lockRetryDelayMs` | `number` | 25 毫秒 | 正数，初始重试延迟。 |
| `lockStaleThresholdMs` | `number` | 计算得出 | 正数，允许恢复过期锁所需的锁存在时长。 |
| `allowStaleRecovery` | `boolean` | `false` | 自动回收过期锁。 |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

添加或替换文件中的嵌套值，将一次 `add` 操作交给 `patchConfigFile` 执行。

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

删除文件中已有的嵌套值，将一次 `remove` 操作交给 `patchConfigFile` 执行。

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

通过进程内队列**和**独占锁文件（`<file>.confedit.lock`）执行异步回调。锁使用所有权令牌；仅当 `allowStaleRecovery` 为 `true` 且锁存在时长超过 `staleThresholdMs` 时才恢复过期锁。这里刻意不检查 PID，因为 PID 可能被重复使用。

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `filePath` | `string` | 要加锁的文件。 |
| `callback` | `() => Promise<T>` | 持有锁期间执行的任务。 |
| `options` | `FileLockOptions` | 见下文。 |

**返回：** `callback` 的返回值（`Promise<T>`）。即使回调抛出异常，也会在 `finally` 块中释放锁。

#### `FileLockOptions`

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | 等待锁的最长时间，单位为毫秒，必须非负。 |
| `retryDelayMs` | `number` | `25` | 初始重试延迟，单位为毫秒，必须为正数。退避延迟按 1.5 倍递增，上限为 1000 毫秒。 |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | 允许恢复锁之前，锁需要存在的时长，单位为毫秒，必须为正数。 |
| `allowStaleRecovery` | `boolean` | `false` | 自动回收过期锁。为避免抢占仍在执行的事务，Electron 单主进程场景默认关闭。 |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

删除当前进程拥有的所有锁文件。应在活动文件事务结束后，于应用关闭时调用。Electron 需要异步清理时，应阻止首次退出事件，待清理完成后恢复退出，具体见示例。单个锁的清理失败会被忽略。

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI 校验

### `validateOpenAPISpec`

校验原始 OpenAPI/Swagger 内容（JSON 或 YAML）。默认将输入视为**内容**；仅在 `inputKind: "file"` 时将其解释为文件路径。校验委托给 `@powerduck/openapi-parser`，本函数补充安全输入处理。

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `input` | `string` | 原始规范内容；`inputKind: "file"` 时为文件路径。 |
| `options` | `ValidateOpenApiOptions` | 见下文。 |

**返回：** 校验成功的文档（`Promise<AnyOpenAPIDocument>`）。

**异常：** 输入为空或不是字符串时抛出 `TypeError`；选项无效或校验过程失败时抛出 [`OpenApiValidationError`](#openapivalidationerror)。

---

### `validateOpenAPIFile`

便捷封装：调用 `validateOpenAPISpec`，设置 `inputKind: "file"`，并将 `baseFilePath` 设为给定路径。必须提供 `allowedRootDirectory`。

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

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | 如何解释 `input`。 |
| `baseFilePath` | `string` | — | 引用解析上下文的基准路径。 |
| `allowedRootDirectory` | `string` | — | 文件输入的根目录；`inputKind` 为 `"file"` 时**必填**。 |
| `timeoutMs` | `number` | `15000` | 操作超时时间，单位为毫秒。 |
| `maxInputBytes` | `number` | `5242880`（5 MB） | 原始输入的最大字节数。 |
| `maxDocumentNodes` | `number` | `100000` | 解析后文档的最大节点数，用于防范拒绝服务攻击。 |
| `maxDocumentDepth` | `number` | `100` | 最大嵌套深度，用于防范拒绝服务攻击。 |
| `maxValidationErrors` | `number` | `50` | 错误消息中包含的最大错误数量。 |
| `maxErrorMessageLength` | `number` | `1000` | 每条校验错误的最大字符数。 |
| `signal` | `AbortSignal` | — | 可选的取消信号。 |

---

### `OpenApiValidationError`

校验失败时抛出的结构化错误。向客户端返回错误前，应在应用边界进行映射处理；错误消息和原因可能包含本地路径或文档细节。

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| 属性 | 类型 | 说明 |
|---|---|---|
| `code` | `string` | 可供程序识别的错误代码，见下表。 |
| `message` | `string` | 便于阅读的详细说明。 |
| `cause` | `unknown` | 可选的底层错误。 |

#### 错误代码

| 代码 | 含义 |
|---|---|
| `INVALID_OPTION` | 提供了无效的选项值。 |
| `INPUT_TOO_LARGE` | 原始内容超过 `maxInputBytes`。 |
| `INPUT_FILE_TOO_LARGE` | 输入文件超过大小限制。 |
| `FILE_INPUT_FORBIDDEN` | 使用文件输入但未指定 `allowedRootDirectory`。 |
| `PATH_OUTSIDE_ROOT` | 文件路径解析到 `allowedRootDirectory` 之外。 |
| `PARSE_ERROR` | 无法解析 JSON/YAML 内容。 |
| `INVALID_DOCUMENT_SHAPE` | 文档不是 JSON 对象。 |
| `UNSUPPORTED_VERSION` | 文档未声明受支持的 OpenAPI/Swagger 版本，仅接受主版本 `2` 和 `3`。 |
| `DOCUMENT_TOO_DEEP` | 嵌套深度超过 `maxDocumentDepth`。 |
| `DOCUMENT_TOO_LARGE` | 节点数超过 `maxDocumentNodes`。 |
| `SPEC_VALIDATION_FAILED` | 规范未通过 OpenAPI 校验。 |
| `OPERATION_TIMEOUT` | 操作超过 `timeoutMs`。 |
| `OPERATION_ABORTED` | 操作通过 `signal` 被取消。 |
| `UNKNOWN_ERROR` | 未预期的错误。 |

---

## 工具函数

### `detectFormat`

根据文件路径或 `file://` URL 的扩展名识别 [`ConfigFormat`](#configformat)。

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| 扩展名 | 结果 |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| 其他扩展名 | 抛出错误 |

---

### `normalizeFilePath`

将本地路径或 `file:` URL 转为本机绝对路径，保留有效空白和 Unicode 文件名。

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL 使用 `fileURLToPath` 解码；绝对路径原样返回；相对路径以 `process.cwd()` 为基准解析。

---

## 断言辅助函数

这些函数重新导出供高级用法及内部模块使用，应用代码通常无需直接调用。

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
若 `value` 不是非空字符串，则抛出 `TypeError`。

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
若 `path` 不是非空数组，或路径段不是非空字符串或安全的非负整数，则抛出异常。

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
校验每个操作：`op` 必须为 `"add" | "replace" | "remove"`；`path` 必须通过 `assertPatchPath`；`add`/`replace` 必须具有自身的 `value` 属性。

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
若 `format` 不是 `"json"`、`"jsonc"` 或 `"yaml"`，则抛出异常。

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
对于 `Error` 实例返回 `error.message`，其他情况返回 `String(error)`。

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
创建 `Error` 并附加 `cause` 属性，使用 `Object.defineProperty`，同时兼容较旧的运行时。

---

## 类型

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
仅支持 `"add"`、`"replace"` 和 `"remove"`，有意不提供 `"move"`、`"copy"` 和 `"test"`。
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

校验返回的受支持 OpenAPI/Swagger 文档结构联合类型：

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` 是较宽松的结构类型：

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## 导出汇总

| 符号 | 主入口 | 核心子路径 | 种类 |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | 函数 |
| `setContentValue` | ✓ | ✓ | 函数 |
| `deleteContentValue` | ✓ | ✓ | 函数 |
| `PatchContentOptions` | ✓ | ✓ | 类型 |
| `assertNonEmptyString` | ✓ | ✓ | 函数 |
| `assertPatchPath` | ✓ | ✓ | 函数 |
| `assertPatchOperations` | ✓ | ✓ | 函数 |
| `assertConfigFormat` | ✓ | ✓ | 函数 |
| `getErrorMessage` | ✓ | ✓ | 函数 |
| `createError` | ✓ | ✓ | 函数 |
| `ConfigFormat` | ✓ | ✓ | 类型 |
| `JsonPatchOp` | ✓ | ✓ | 类型 |
| `JsonPathSegment` | ✓ | ✓ | 类型 |
| `readConfigFile` | ✓ | — | 函数 |
| `writeConfigFile` | ✓ | — | 函数 |
| `WriteConfigOptions` | ✓ | — | 类型 |
| `patchConfigFile` | ✓ | — | 函数 |
| `setConfigValue` | ✓ | — | 函数 |
| `deleteConfigValue` | ✓ | — | 函数 |
| `withFileLock` | ✓ | — | 函数 |
| `releaseAllLocalLocks` | ✓ | — | 函数 |
| `PatchConfigOptions` | ✓ | — | 类型 |
| `FileLockOptions` | ✓ | — | 类型 |
| `detectFormat` | ✓ | — | 函数 |
| `normalizeFilePath` | ✓ | — | 函数 |
| `validateOpenAPISpec` | ✓ | — | 函数 |
| `validateOpenAPIFile` | ✓ | — | 函数 |
| `OpenApiValidationError` | ✓ | — | 类 |
| `ValidateOpenApiOptions` | ✓ | — | 类型 |
| `OpenApiInputKind` | ✓ | — | 类型 |
| `AnyOpenAPIDocument` | ✓ | — | 类型 |