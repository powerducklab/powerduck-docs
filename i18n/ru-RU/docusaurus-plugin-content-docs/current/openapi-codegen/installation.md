---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/openapi-codegen через npm, yarn или pnpm и используйте в Node.js или браузере. Требуется Node.js 22.12.0 или новее."
---

# Установка

## Требования

- Для работы в Node.js нужен **Node.js** `>= 22.12.0` (указано в поле `engines` пакета).
- **Разобранный** документ OpenAPI в виде объекта JavaScript, а не исходной строки JSON/YAML.
- Для работы в браузере — современный браузер с Fetch API.

Пакет содержит сборки ESM (`dist/index.js`) и CommonJS (`dist/index.cjs`) с декларациями TypeScript. **Зависимостей времени выполнения нет**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Использование в Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Встроенные генераторы **автоматически регистрируются при импорте модуля**, поэтому `generate` работает сразу, без дополнительной настройки.

## Использование в браузере

Библиотека полностью совместима с браузерами и не использует встроенные модули Node.js. Загрузите её из ESM CDN и вызывайте напрямую:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild и webpack также работают без дополнительной настройки; сборка ESM поддерживает tree shaking.

## Передача документа

Передавайте разобранный объект. Для JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Для YAML сначала разберите содержимое отдельным YAML-пакетом:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Структура пакета

| Точка входа | Путь |
|-------|------|
| Вход ESM | `dist/index.js` |
| Вход CommonJS | `dist/index.cjs` |
| Определения типов | `dist/index.d.ts` |

Исполняемого файла CLI нет: библиотека используется только из кода.

## Дальнейшие шаги

- [Быстрый старт](/docs/ru-RU/openapi-codegen/quickstart/) — создайте первый фрагмент кода.
- [Конфигурация](/docs/ru-RU/openapi-codegen/configuration/) — все параметры генерации.
