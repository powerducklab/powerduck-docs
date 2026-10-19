---
sidebar_position: 5
title: "Примеры"
description: "Практические исполняемые примеры на основе публичного API. Для строк используйте безопасный для браузера @powerduck/conf-patch/core, для файлов — основной пакет @powerduck/conf-patch."
---

# Примеры

Практические исполняемые примеры на основе публичного API. Для строк используйте безопасный для браузера `@powerduck/conf-patch/core`, для файлов — основной пакет `@powerduck/conf-patch`.

---

## 1. Операции JSON Patch (базовый слой)

Примените несколько операций RFC 6902 к строке JSON. `add` вставляет элементы массива либо добавляет/заменяет свойства объекта; для `replace` и `remove` цель должна существовать.

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

Результат:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Укажите `strict: false`, чтобы пропускать неудачные операции вместо исключения:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Изменение вложенного значения YAML (файловый слой)

Задайте `database.port` в YAML-файле. Родительский путь (`database`) должен существовать. Запись атомарна и защищена блокировкой.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Чтобы создать отсутствующий вложенный объект, сначала создайте родительский:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Операции с массивами YAML

Используйте числовые сегменты пути для индексов последовательности. `add` **вставляет**, `replace` заменяет на месте, `remove` удаляет:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC с сохранением комментариев

Изменения JSONC выполняются по диапазонам текста, поэтому комментарии и завершающие запятые вокруг изменённых строк сохраняются.

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

Результат с сохранёнными комментариями:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Проверка документа OpenAPI

Сначала проверьте исходное содержимое спецификации, затем файл. Для файлового режима требуется `allowedRootDirectory`, ограничивающий доступные пути.

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

Отмена через `AbortSignal`:

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

## 5. Безопасный параллельный доступ с блокировкой файлов

Если несколько процессов или одновременных операций одного процесса обращаются к одному файлу, `patchConfigFile` уже сериализует доступ. Используйте `withFileLock` напрямую, чтобы объединить несколько файловых операций в одну критическую секцию.

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

Примечания:

- `withFileLock` ставит операции над **одним файлом** в очередь внутри процесса и использует эксклюзивный файл `.confedit.lock` между процессами.
- При освобождении перед удалением проверяется токен владельца: старое освобождение не удалит новую блокировку, заменившую устаревшую.
- При завершении, например в Electron `will-quit`, освободите оставшиеся блокировки:

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

## 6. Полный пример: изменение спецификации OpenAPI на диске

Пример из самой библиотеки: прочитать спецификацию, задать значения, добавить ответ и выполнить проверку.

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

## Дальнейшие шаги

- [Справочник API](../api-reference/) — полные сигнатуры и значения всех параметров по умолчанию.
- [Быстрый старт](../quickstart/) — первый полный запуск.
