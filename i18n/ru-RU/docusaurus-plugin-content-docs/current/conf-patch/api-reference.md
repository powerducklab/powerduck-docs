---
sidebar_position: 4
title: "Справочник API"
description: "Полный справочник @powerduck/conf-patch с сигнатурами и значениями по умолчанию для каждого экспортируемого символа."
---

# Справочник API

Полный справочник `@powerduck/conf-patch` с сигнатурами и значениями по умолчанию для каждого экспортируемого символа.

Доступны две точки входа:

- **`@powerduck/conf-patch`** — все перечисленные ниже возможности: ядро, файлы, проверка OpenAPI и утилиты.
- **`@powerduck/conf-patch/core`** — только совместимая с браузером часть: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, проверочные функции и типы `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Ядро (совместимо с браузером)

### `patchContent`

Применяет массив операций RFC 6902 к строке конфигурации. Чистая функция без доступа к файловой системе.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Параметр | Тип | Описание |
|---|---|---|
| `content` | `string` | Исходное содержимое конфигурации. Должно соответствовать указанному `format`. |
| `ops` | `JsonPatchOp[]` | Операции, применяемые по порядку. Пустой массив возвращает `content` без изменений. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | При `true` (по умолчанию) неудачная операция вызывает исключение. При `false` она пропускается с предупреждением через `console.warn`. |

**Возвращает:** изменённое содержимое конфигурации (`string`).

**Исключения:** `TypeError`, если `content` не строка или `ops` некорректен; ошибка с описанием неудачной операции, если `strict` равен `true`.

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

Задаёт или создаёт одно значение. Внутри вызывает `patchContent` с одной операцией `add`. По RFC 6902 операция `add` заменяет существующее свойство объекта или вставляет элемент по индексу массива.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Параметр | Тип | Описание |
|---|---|---|
| `content` | `string` | Исходное содержимое конфигурации. |
| `path` | `readonly (string \| number)[]` | Путь по сегментам, например `["server", "port"]`. Не может быть пустым. |
| `value` | `unknown` | Записываемое значение. |
| `format` | `ConfigFormat` | Формат конфигурации. |

**Возвращает:** обновлённое содержимое (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Удаляет ключ или элемент массива. Внутри вызывает `patchContent` с одной операцией `remove`. Путь должен существовать.

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

## Файловый уровень (только Node.js / Electron)

### `readConfigFile`

Читает текст UTF-8 по локальному пути или URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `filePath` | `string` | Абсолютный или относительный путь либо URL `file://`. Не может быть пустым. |

**Возвращает:** исходное содержимое UTF-8 (`Promise<string>`).

**Исключения:** если чтение невозможно, ошибка, содержащая исходную ошибку файловой системы.

---

### `writeConfigFile`

Записывает содержимое **атомарно** через временный файл и переименование. По умолчанию используется исключительная **блокировка файла**. Родительские каталоги создаются до захвата блокировки.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `filePath` | `string` | Путь к файлу конфигурации. |
| `content` | `string` | Записываемое содержимое. Должно быть строкой. |
| `options` | `WriteConfigOptions` | См. ниже. |

**Исключения:** `TypeError` при некорректном вводе; ошибки файловой системы при записи оборачиваются.

#### `WriteConfigOptions`

| Опция | Тип | По умолчанию | Описание |
|---|---|---|---|
| `lock` | `boolean` | `true` | Включить блокировку на время записи. |
| `lockTimeoutMs` | `number` | Значение по умолчанию `withFileLock` (10 с) | Максимальное время ожидания захвата блокировки, мс. |
| `lockRetryDelayMs` | `number` | Значение по умолчанию `withFileLock` (25 мс) | Начальная задержка повторной попытки в миллисекундах до экспоненциального увеличения. |
| `lockStaleThresholdMs` | `number` | Значение по умолчанию `withFileLock` | Возраст блокировки в миллисекундах, после которого разрешено восстановление. |
| `allowStaleRecovery` | `boolean` | `false` | Разрешить автоматическое восстановление устаревших блокировок. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Основная файловая транзакция: читает под блокировкой, применяет `patchContent` и атомарно записывает обратно **только при изменении содержимого**. Если `options.format` не задан, формат определяется по расширению.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `filePath` | `string` | Путь к файлу конфигурации. Не может быть пустым. |
| `ops` | `JsonPatchOp[]` | Применяемые операции. Пустой массив приводит к возврату без чтения и записи. |
| `options` | `PatchConfigOptions` | См. ниже. |

**Исключения:** `TypeError`, если `filePath` пуст, опции блокировки некорректны или формат не определяется и не задан `format`; ошибка операции при `strict`, равном `true`.

#### `PatchConfigOptions`

| Опция | Тип | По умолчанию | Описание |
|---|---|---|---|
| `format` | `ConfigFormat` | определяется автоматически | Явный формат, имеющий приоритет над определением по расширению. |
| `strict` | `boolean` | `true` | Неудачные операции вызывают исключения. |
| `lock` | `boolean` | `true` | Включить блокировку файлов. |
| `lockTimeoutMs` | `number` | 10 с | Неотрицательное значение. Максимальное ожидание блокировки. |
| `lockRetryDelayMs` | `number` | 25 мс | Положительное значение. Начальная задержка повторной попытки. |
| `lockStaleThresholdMs` | `number` | вычисляется | Положительное значение. Возраст блокировки для восстановления. |
| `allowStaleRecovery` | `boolean` | `false` | Автоматически восстанавливать устаревшие блокировки. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Добавляет или заменяет вложенное значение в файле. Передаёт одну операцию `add` в `patchConfigFile`.

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

Удаляет существующее вложенное значение из файла. Передаёт одну операцию `remove` в `patchConfigFile`.

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

Выполняет асинхронный callback через локальную очередь процесса **и** исключительный файл блокировки (`<file>.confedit.lock`). Используются токены владельца. Устаревшая блокировка восстанавливается, только если `allowStaleRecovery` равен `true` и возраст превышает `staleThresholdMs`. PID намеренно не проверяются, поскольку могут использоваться повторно.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `filePath` | `string` | Блокируемый файл. |
| `callback` | `() => Promise<T>` | Работа, выполняемая при удержании блокировки. |
| `options` | `FileLockOptions` | См. ниже. |

**Возвращает:** результат `callback` (`Promise<T>`). Блокировка всегда освобождается в блоке `finally`, даже при исключении в callback.

#### `FileLockOptions`

| Опция | Тип | По умолчанию | Описание |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Максимальное ожидание блокировки, мс. Должно быть неотрицательным. |
| `retryDelayMs` | `number` | `25` | Начальная задержка, мс. Должна быть положительной. Увеличивается в 1,5 раза до предела 1000 мс. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Возраст блокировки, разрешающий восстановление, мс. Должен быть положительным. |
| `allowStaleRecovery` | `boolean` | `false` | Автоматическое восстановление устаревших блокировок. По умолчанию отключено для единственного главного процесса Electron, чтобы не прерывать активные транзакции. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Удаляет все файлы блокировок текущего процесса. Используйте при завершении приложения после окончания активных файловых транзакций. Для асинхронной очистки Electron предотвратите первое событие выхода и возобновите выход после очистки, как показано в примерах. Ошибки отдельных блокировок игнорируются.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Проверка OpenAPI

### `validateOpenAPISpec`

Проверяет исходное содержимое OpenAPI/Swagger в JSON или YAML. По умолчанию ввод считается **содержимым**; как путь он интерпретируется только при `inputKind: "file"`. Проверку выполняет `@powerduck/openapi-parser`; эта функция добавляет защитные ограничения для ввода.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `input` | `string` | Исходное содержимое спецификации или путь к файлу при `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | См. ниже. |

**Возвращает:** успешно проверенный документ (`Promise<AnyOpenAPIDocument>`).

**Исключения:** `TypeError` при пустом вводе или значении нестрокового типа; [`OpenApiValidationError`](#openapivalidationerror) при некорректных опциях или ошибках проверки.

---

### `validateOpenAPIFile`

Удобная обёртка, вызывающая `validateOpenAPISpec` с `inputKind: "file"` и указанным путём в `baseFilePath`. Требует `allowedRootDirectory`.

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

| Опция | Тип | По умолчанию | Описание |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Способ интерпретации `input`. |
| `baseFilePath` | `string` | — | Базовый путь для контекста разрешения ссылок. |
| `allowedRootDirectory` | `string` | — | Корневой каталог для файлового ввода. **Обязателен**, если `inputKind` равен `"file"`. |
| `timeoutMs` | `number` | `15000` | Предельное время операции, мс. |
| `maxInputBytes` | `number` | `5242880` (5 МБ) | Максимальный размер исходного ввода в байтах. |
| `maxDocumentNodes` | `number` | `100000` | Максимальное число узлов разобранного документа для защиты от DoS. |
| `maxDocumentDepth` | `number` | `100` | Максимальная глубина вложенности для защиты от DoS. |
| `maxValidationErrors` | `number` | `50` | Максимальное число ошибок в сообщении. |
| `maxErrorMessageLength` | `number` | `1000` | Максимальное число символов на одну ошибку проверки. |
| `signal` | `AbortSignal` | — | Необязательный сигнал отмены. |

---

### `OpenApiValidationError`

Структурированная ошибка проверки. Преобразуйте ошибки на границе приложения перед возвратом клиенту: сообщения и причины могут содержать локальные пути или детали документа.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Свойство | Тип | Описание |
|---|---|---|
| `code` | `string` | Машиночитаемый код ошибки; см. таблицу ниже. |
| `message` | `string` | Понятное пользователю описание. |
| `cause` | `unknown` | Необязательная исходная ошибка. |

#### Коды ошибок

| Код | Значение |
|---|---|
| `INVALID_OPTION` | Передано некорректное значение опции. |
| `INPUT_TOO_LARGE` | Исходное содержимое превышает `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Входной файл превышает ограничение размера. |
| `FILE_INPUT_FORBIDDEN` | Файловый ввод использован без `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | Разрешённый путь находится за пределами `allowedRootDirectory`. |
| `PARSE_ERROR` | Не удалось разобрать JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | Документ не является JSON-объектом. |
| `UNSUPPORTED_VERSION` | Документ не объявляет поддерживаемую версию OpenAPI/Swagger; допускаются только основные версии `2` и `3`. |
| `DOCUMENT_TOO_DEEP` | Глубина превышает `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Число узлов превышает `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | Спецификация не прошла проверку OpenAPI. |
| `OPERATION_TIMEOUT` | Операция превысила `timeoutMs`. |
| `OPERATION_ABORTED` | Операция отменена через `signal`. |
| `UNKNOWN_ERROR` | Непредвиденная ошибка. |

---

## Утилиты

### `detectFormat`

Определяет [`ConfigFormat`](#configformat) по расширению пути или URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Расширение | Результат |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| любое другое расширение | вызывает ошибку |

---

### `normalizeFilePath`

Преобразует локальный путь или URL `file:` в абсолютный путь в формате системы. Сохраняет допустимые пробелы и имена файлов Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

URL `file:` декодируется через `fileURLToPath`; абсолютный путь возвращается как есть; относительный разрешается относительно `process.cwd()`.

---

## Проверочные функции

Повторно экспортируются для расширенных сценариев и внутренних модулей. Код приложения редко нуждается в них напрямую.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Вызывает `TypeError`, если `value` не является непустой строкой.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Вызывает исключение, если `path` не является непустым массивом непустых строк или безопасных неотрицательных целых чисел.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Проверяет каждую операцию: `op` должен быть `"add" | "replace" | "remove"`, `path` должен пройти `assertPatchPath`, а `add`/`replace` должны иметь собственное свойство `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Вызывает исключение, если `format` не равен `"json"`, `"jsonc"` или `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Возвращает `error.message` для экземпляров `Error`, иначе `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Создаёт `Error` и добавляет свойство `cause` через `Object.defineProperty`, с резервным способом для старых сред выполнения.

---

## Типы

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
Поддерживаются только `"add"`, `"replace"` и `"remove"`. `"move"`, `"copy"` и `"test"` намеренно исключены.
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

Объединение поддерживаемых структур документов OpenAPI/Swagger, возвращаемых проверкой:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` — структурный тип с широкими ограничениями:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Сводка экспортов

| Символ | Основной вход | Подпуть ядра | Категория |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | функция |
| `setContentValue` | ✓ | ✓ | функция |
| `deleteContentValue` | ✓ | ✓ | функция |
| `PatchContentOptions` | ✓ | ✓ | тип |
| `assertNonEmptyString` | ✓ | ✓ | функция |
| `assertPatchPath` | ✓ | ✓ | функция |
| `assertPatchOperations` | ✓ | ✓ | функция |
| `assertConfigFormat` | ✓ | ✓ | функция |
| `getErrorMessage` | ✓ | ✓ | функция |
| `createError` | ✓ | ✓ | функция |
| `ConfigFormat` | ✓ | ✓ | тип |
| `JsonPatchOp` | ✓ | ✓ | тип |
| `JsonPathSegment` | ✓ | ✓ | тип |
| `readConfigFile` | ✓ | — | функция |
| `writeConfigFile` | ✓ | — | функция |
| `WriteConfigOptions` | ✓ | — | тип |
| `patchConfigFile` | ✓ | — | функция |
| `setConfigValue` | ✓ | — | функция |
| `deleteConfigValue` | ✓ | — | функция |
| `withFileLock` | ✓ | — | функция |
| `releaseAllLocalLocks` | ✓ | — | функция |
| `PatchConfigOptions` | ✓ | — | тип |
| `FileLockOptions` | ✓ | — | тип |
| `detectFormat` | ✓ | — | функция |
| `normalizeFilePath` | ✓ | — | функция |
| `validateOpenAPISpec` | ✓ | — | функция |
| `validateOpenAPIFile` | ✓ | — | функция |
| `OpenApiValidationError` | ✓ | — | класс |
| `ValidateOpenApiOptions` | ✓ | — | тип |
| `OpenApiInputKind` | ✓ | — | тип |
| `AnyOpenAPIDocument` | ✓ | — | тип |