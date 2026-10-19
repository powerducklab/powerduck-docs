---
sidebar_position: 4
title: "Конфигурация"
description: "Полная конфигурация @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode и объединения литералов для источников, состояний, протоколов, уровней журналирования и кодировок тела."
---

# Конфигурация

Основной объект конфигурации — `ServerConfig`, который принимает `startAdminServer()`. Связанные типы контекста используются при выполнении инструментов.

## `ServerConfig`

Обязателен только `port`.

| Поле | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `port` | `number` | — (обязательно) | TCP-порт для прослушивания, целое число от 0 до 65535. |
| `host` | `string` | `"127.0.0.1"` | Сетевой интерфейс; по умолчанию loopback, чтобы избежать случайного внешнего доступа. |
| `apiKey` | `string` | undefined | Общий секрет, который при настройке требуется для API управления и HTTP-транспорта. |
| `specPath` | `string` | undefined | Спецификация, загружаемая один раз при запуске. |
| `baseUrlOverride` | `string` | undefined | Заменяет базовый URL целевого сервиса, полученный из `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Заголовки, добавляемые к каждому запросу в целевой сервис. |
| `requestTimeoutMs` | `number` | undefined | Тайм-аут каждого запроса в целевой сервис, в миллисекундах. |
| `persistState` | `boolean` | `true` | Сохраняет загруженную спецификацию между перезапусками. |
| `stateFilePath` | `string` | undefined | Расположение файла сохранённого состояния. |
| `allowedOrigins` | `string[]` | undefined | Разрешённые источники CORS; пустое или отсутствующее значение отключает межсайтовый доступ. |
| `allowedHosts` | `string[]` | undefined | Разрешённые значения заголовка `Host`. |
| `maxLogEntries` | `number` | 200 | Максимальное число записей журнала в памяти. |
| `redactSensitiveHeaders` | `boolean` | `true` | Маскирует значения конфиденциальных заголовков до журналирования. |
| `redactHeaderNames` | `string[]` | undefined | Дополнительные имена заголовков для маскирования сверх встроенного списка. |
| `security` | `SecurityContext` | undefined | Учётные данные, передаваемые целевому API при каждом вызове инструмента. |

## `SecurityContext`

| Поле | Тип | Формат передачи |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Точные пары имени заголовка и значения. |

Учётные данные добавляет исполнитель; они никогда не передаются модели в качестве аргументов инструмента.

## `ExecutionContext`

Контекст отдельного вызова, передаваемый в `executeToolCall` и возвращаемый `ContextProvider`:

| Поле | Тип | Описание |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Заменяет URL сервера из спецификации для этого вызова. |
| `upstreamHeaders` | `Record<string, string>` | Дополнительные заголовки целевого запроса. |
| `requestTimeoutMs` | `number` | Тайм-аут вызова, не менее 1 секунды. |
| `security` | `SecurityContext` | Учётные данные для отдельного вызова. |
| `correlationId` | `string` | Связывает записи журнала одного вызова. |
| `protocol` | `ProtocolHint` | Транспорт, инициировавший вызов. |
| `onLog` | `(entry) => void` | Получает записи журнала запросов и ответов; не должен выбрасывать исключения. |
| `signal` | `AbortSignal` | Отменяет выполняющийся запрос в целевой сервис. |

## Объединения литералов и функции проверки

| Объединение | Значения | Функция проверки |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Передаётся третьим аргументом в `buildMcpServer()`:

| Поле | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Объявляемая подсказка о протоколе. |
| `name` | `string` | `"openapi-mcp"` | Объявляемое имя сервера. |
| `version` | `string` | `"1.1.0"` | Объявляемая версия сервера. |
| `pageSize` | `number` | 100 | Максимальное число элементов в ответе со списком, не более 500. |
| `instructions` | `string` | встроено | Подсказка по использованию, доступная через MCP `instructions`. |

## Параметры транспортного слоя (`AttachMcpRoutesOptions`)

Импортируйте `attachMcpRoutes` из `@powerduck/openapi-mcp-server` и передайте объект параметров вторым аргументом. Устаревшая обёртка `attachSseRoutes()` принимает только позиционные аргументы `(app, specProvider, contextProvider, routeGuard?)`.

| Поле | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (обязательно) | Предоставляет документ для новых сессий. |
| `contextProvider` | `ContextProvider` | — (обязательно) | Предоставляет контекст целевого запроса для каждого вызова. |
| `routeGuard` | `RequestHandler` | undefined | Middleware, применяемый ко всем маршрутам MCP. |
| `maxSessions` | `number` | 64 | Максимальное число одновременных сессий. |
| `sessionIdleMs` | `number` | 600000 | Тайм-аут бездействия в миллисекундах; 0 отключает его. |
| `allowedOrigins` | `string[]` | undefined | Разрешённые источники; непустой список включает защиту от DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Разрешённые значения заголовка `Host`. |
| `enableLegacySse` | `boolean` | `true` | Подключает устаревший транспорт HTTP+SSE. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Получает события жизненного цикла; не должен выбрасывать исключения. |

> Это параметры `attachMcpRoutes`, а не дополнительные поля `ServerConfig`. Сервер управления передаёт настройки источников и хостов, но использует ограничения сессий и тайм-аут бездействия транспорта по умолчанию. Чтобы изменить эти ограничения, используйте публичную транспортную функцию напрямую.

## См. также

- [Справочник API](../api-reference/)
- [Примеры](../examples/)
