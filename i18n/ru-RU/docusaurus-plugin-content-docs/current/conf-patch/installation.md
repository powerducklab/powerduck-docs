---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/conf-patch и выберите файловый вход для Node.js или браузерный подпуть ./core."
---

# Установка

Установите `@powerduck/conf-patch` выбранным менеджером пакетов.

## Требования

- **Node.js:** `>= 22.12.0`
- **TypeScript:** необязателен; пакет содержит полные декларации типов, поэтому `@types/...` не нужен.

## Установка

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Зависимости времени выполнения

conf-patch содержит три зависимости времени выполнения, устанавливаемые автоматически:

| Пакет | Версия | Назначение |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Проверка OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Инкрементальные изменения текста JSON и JSONC. |
| `yaml` | `^2.9.0` | Разбор и изменение AST YAML. |

Вам не нужно работать с этими зависимостями напрямую.

## Две точки входа

Пакет предоставляет **два экспорта подпутей**. Выбирайте в зависимости от среды.

### Основной вход — `@powerduck/conf-patch`

Включает **файловый слой** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), ядро и проверку OpenAPI. Используйте в Node.js и Electron. Зависит от `node:fs`, `node:path` и `node:crypto`.

### Подпуть ядра — `@powerduck/conf-patch/core`

Экспортирует **только браузерное ядро**: `patchContent`, `setContentValue`, `deleteContentValue`, вспомогательные проверки и типы ядра. Не зависит от Node.js и подходит для браузеров, Edge Functions и service worker.

:::tip
Для браузера всегда импортируйте из `@powerduck/conf-patch/core`. Это исключает из сборки файловый слой и его зависимость `node:fs`.
:::

## Система модулей: CJS и ESM

Пакет **не задаёт** `"type": "module"`, поэтому файлы `.js` по умолчанию считаются CommonJS. Карта `exports` в `package.json` явно направляет `import` и `require` к нужной сборке.

| Вход | CJS (`require`) | ESM (`import`) | Типы |
|---|---|---|---|
| Основной вход | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Подпуть ядра | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / основной процесс Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (современный Node.js / браузеры / сборщики)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Проверка установки

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Следующие шаги

- [Быстрый старт](/docs/ru-RU/conf-patch/quickstart/) — измените строку в браузере и файл на диске.
- [Справочник API](/docs/ru-RU/conf-patch/api-reference/) — все экспорты, типы и параметры.
