---
sidebar_position: 2
title: "Установка"
description: "Установка @powerduck/openapi-mcp-server через npm, yarn, pnpm или глобально. CLI openapi-mcp, подпуть ./server и зависимости. Требуется Node.js 22.12.0 или новее."
---

# Установка

## Требования

- **Node.js `>=22.12.0`** (указано в `engines`).

## Установка

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Пакет регистрирует программу `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI содержит одну команду `serve` (см. [Быстрый старт](/docs/ru-RU/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Оба формата сборки включают декларации типов. Дополнительные `@types/*` не нужны:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Экспорт подпути

| Импорт | Содержимое |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Основная библиотека: загрузка спецификаций, создание инструментов, промптов и ресурсов, выполнение запросов, построение MCP-сервера, транспорты stdio и HTTP. |
| `@powerduck/openapi-mcp-server/server` | Административный HTTP-сервер и middleware аутентификации (`startAdminServer`, `createAuthMiddleware`). |

## Зависимости времени выполнения

Эти зависимости устанавливаются автоматически вместе с пакетом:

- `@modelcontextprotocol/sdk` — реализация протокола MCP.
- `@powerduck/openapi-parser` — валидация OpenAPI, разыменование ссылок и обновление версии.
- `express` и `cors` — административный HTTP-сервер и CORS.
- `axios` — HTTP-клиент для обращения к целевому серверу при выполнении инструментов.
- `commander` — фреймворк CLI.
- `js-yaml` — разбор YAML.
- `multer` — обработка загрузки спецификаций.
- `terser` — минификация ресурсов встроенного веб-интерфейса.

## Проверка

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Дальнейшие шаги

- [Быстрый старт](/docs/ru-RU/openapi-mcp-server/quickstart/)
- [Конфигурация](/docs/ru-RU/openapi-mcp-server/configuration/)
