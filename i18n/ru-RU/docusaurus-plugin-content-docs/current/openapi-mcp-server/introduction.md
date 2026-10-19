---
sidebar_position: 1
title: "Введение"
description: "Преобразование OpenAPI в MCP: инструменты, промпты, ресурсы, веб-консоль, stdio, HTTP и CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Введение

`@powerduck/openapi-mcp-server` превращает документ OpenAPI в работающий сервис MCP (Model Context Protocol). Из операций он создаёт **инструменты**, из метаданных и операций API — **промпты**, из каталога API — **ресурсы**. Они доступны по протоколу MCP; для управления предусмотрен встроенный веб-интерфейс.

- **Имя пакета:** `@powerduck/openapi-mcp-server`
- **Версия:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Лицензия:** MIT
- **Требования к Node:** `>=22.12.0`
- **Исполняемый файл CLI:** `openapi-mcp`
- **Формат модулей:** Сборки ESM и CommonJS с включёнными объявлениями типов.

Для проверки и разрешения ссылок используется `@powerduck/openapi-parser`, для протокола — `@modelcontextprotocol/sdk`.

## Что генерируется

- **Tools** — Один инструмент MCP на операцию OpenAPI: полная сериализация параметров (стили path/query/header/cookie и правила explode), кодирование тела запроса (JSON, form-urlencoded, multipart, текст, двоичные данные) и аннотации инструментов MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Общие промпты (`spec_overview`, `integration_guardrails`) и промпты отдельных операций (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Фиксированные ресурсы каталога, например `openapi://spec/summary`, `openapi://catalog/tools`, `openapi://spec/document`.

## Транспорты

- **stdio** — `startStdioServer()` предоставляет один документ локальному клиенту MCP, например Claude Desktop или интеграции редактора.
- **HTTP** — `attachMcpRoutes(app, options)` подключает Streamable HTTP по пути `/mcp` и необязательный устаревший SSE по пути `/sse` в вашем приложении Express. Параметры управляют ограничениями сессий, тайм-аутами бездействия, CORS и защитой от DNS rebinding. `startAdminServer()` добавляет интерфейс управления и использует ограничения сессий по умолчанию. `attachSseRoutes()` сохранён как устаревшая обёртка с позиционными аргументами.

## Сервер управления

`startAdminServer()` запускает приложение Express, предоставляющее:

- веб-консоль для загрузки или вставки спецификации, просмотра инструментов, промптов и ресурсов, работающих сервисов и журналов запросов;
- HTTP-транспорты MCP;
- аутентификацию по ключу API, журналы запросов с маскированием конфиденциальных заголовков и необязательное сохранение состояния.

## Установка

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Быстрый старт

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Дальнейшие шаги

- [Установка](../installation/) — npm/yarn/pnpm, глобальная установка, подпуть `./server` и зависимости.
- [Быстрый старт](../quickstart/) — Использование через CLI и из кода.
- [Конфигурация](../configuration/) — Полное описание `ServerConfig`.
- [Справочник API](../api-reference/) — Все экспорты и команды CLI.
- [Примеры](../examples/) — Практические примеры.

## Лицензия

MIT.
