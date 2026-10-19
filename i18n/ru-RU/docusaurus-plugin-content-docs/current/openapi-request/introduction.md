---
sidebar_position: 1
title: "Введение в @powerduck/openapi-request"
description: "@powerduck/openapi-request — отладчик коллекций и среда выполнения запросов для OpenAPI 3.2. Библиотека формирует и отправляет запросы на основе документа OpenAPI, распознаёт потоковые ответы и может создавать обновлённый документ по полученным ответам. Компактный интерфейс поддерживает шесть протоколов обмена данными."
---

# Введение в @powerduck/openapi-request

`@powerduck/openapi-request` — отладчик коллекций и среда выполнения запросов для OpenAPI 3.2. Библиотека формирует и отправляет запросы на основе документа OpenAPI, распознаёт потоковые ответы и может создавать обновлённый документ по полученным ответам. Компактный интерфейс поддерживает шесть протоколов обмена данными.

- **Имя пакета:** `@powerduck/openapi-request`
- **Версия:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Лицензия:** MIT
- **Формат модулей:** сборки ESM и CommonJS со встроенными объявлениями типов.

## Назначение

Библиотека решает три задачи, используя один и тот же документ как основной источник данных:

- **Клиент для графического интерфейса** — `createClient()` возвращает объект с методами `prepare()`, `send()`, `connect()`, `discover()` и `writeback()`, соответствующими этапам работы графического редактора запросов.
- **Отладчик для сценариев** — `createDebugger()` возвращает `ProtoKit` с методами `send()`, `sendMany()` и `toCollection()` для автоматизации, скриптов и CI.
- **Длительные сеансы с ручным управлением** — `createManualSession()` возвращает объект двунаправленного сеанса с открытием, отправкой, закрытием и потоком событий. Структура одинакова для WebSocket, MCP и gRPC, поэтому один интерфейс может управлять всеми тремя.

## Адаптеры протоколов

Ядро не зависит от транспорта; поведение конкретного протокола обеспечивают адаптеры, зарегистрированные в `AdapterRegistry`.

- **HTTP / SSE** — поддержка по умолчанию. Обычные JSON-запросы и потоки Server-Sent Events распознаются автоматически по объявленным типам содержимого или фактическим заголовкам ответа.
- **WebSocket** — двунаправленные текстовые и двоичные сеансы с общей структурой событий.
- **gRPC** — унарные вызовы, серверный, клиентский и двунаправленный стриминг на основе файлов `.proto` или рефлексии сервера.
- **MCP** — вызовы инструментов Model Context Protocol через Streamable HTTP или stdio.
- **GraphQL** — интроспекция, создание и выполнение операций.

## Основные возможности

- **Модель коллекций OpenAPI 3.2** — поиск операций по `operationId` или `method`+`path` и формирование запросов из параметров, тел запросов и примеров.
- **Обнаружение потоковых ответов** — `isStreamingOperation()`, `isSseContentType()` и `isStreamingContentType()` классифицируют ответы по объявленным типам содержимого, а `probeStreamingResponse()` проверяет фактические заголовки ответа.
- **Запись ответов в документ** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` и `writeBackResponse()` выводят схемы ответов и возвращают обновлённый документ. По умолчанию при успешной записи `send()` возвращает его в `patchedSpec`; значение `writeBack: false` отключает это поведение. Исходный документ не изменяется, файлы автоматически не сохраняются. Перед сохранением результата проверьте `writeBackSkippedReason` и `writeBackWarnings`.
- **Вспомогательные функции для схем** — `sampleFromSchema()` создаёт примеры данных по схеме.
- **Отложенная загрузка крупных зависимостей** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) и MCP (`@modelcontextprotocol/sdk`) загружаются при первом использовании. При работе только с HTTP затраты на их загрузку отсутствуют.

## Установка

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Быстрый старт

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Следующие шаги

- [Установка](./installation.md) — структура пакета, экспорты через подпути и одноранговые зависимости для возможностей протоколов.
- [Быстрый старт](./quickstart.md) — первый запрос, запуск отладчика и ручной сеанс.
- [Настройка](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` и настройки отдельных протоколов.
- [Справочник API](./api-reference.md) — все экспорты, сгруппированные по назначению.
- [Примеры](./examples.md) — исполняемые примеры для HTTP, SSE, WebSocket, GraphQL, MCP и gRPC.

## Лицензия

MIT.
