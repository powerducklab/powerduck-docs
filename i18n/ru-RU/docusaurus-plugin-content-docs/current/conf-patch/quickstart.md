---
sidebar_position: 3
title: "Быстрый старт"
description: "Начало работы с @powerduck/conf-patch: изменение строк JSON/YAML через браузерное ядро и редактирование файлов в Node.js или Electron."
---

# Быстрый старт

Руководство последовательно знакомит с двумя слоями: **ядром**, которое обрабатывает строки в любой среде, и **файловым слоем**, работающим с реальными файлами в Node.js или Electron.

Предварительно установите пакет. [Установка](/docs/ru-RU/conf-patch/installation/)

## 1. Ядро — изменение строки в браузере

Импортируйте из `@powerduck/conf-patch/core`. Обращений к файловой системе нет: новое содержимое возвращается строкой, которую можно сохранить где угодно — в localStorage, IndexedDB или строковой константе.

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

### Тот же подход для YAML

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
`setContentValue` использует `add`, который **добавляет или заменяет** свойство объекта. `deleteContentValue` использует `remove`. Полный набор операций описан в [`patchContent`](/docs/ru-RU/conf-patch/api-reference/#patchcontent).
:::

## 2. Файловый слой — изменение файла на диске

Импортируйте из основной точки входа. Эти функции являются `async`, читают и записывают реальные файлы и выполняют атомарную запись с блокировками.

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

Формат определяется автоматически по расширению (`.json`, `.jsonc`, `.yaml`, `.yml`). Если расширение неоднозначно, передайте `format` явно.

## 3. Обработка ошибок

Оба слоя выбрасывают ошибки при некорректных входных данных. В режиме `strict`, включённом по умолчанию, неудачная операция патча тоже вызывает ошибку.

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

Установите `strict: false`, чтобы пропускать неудачные операции вместо выбрасывания ошибки:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Пример Electron IPC

Обычно файловый слой запускают в основном процессе Electron и предоставляют к нему доступ через IPC:

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

## Следующие шаги

- [Справочник API](/docs/ru-RU/conf-patch/api-reference/) — Все функции, типы и параметры.
- [Примеры](/docs/ru-RU/conf-patch/examples/) — Патчи JSON, YAML, JSONC с комментариями, проверка OpenAPI и блокировки файлов.
