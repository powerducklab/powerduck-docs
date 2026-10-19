---
sidebar_position: 5
title: "Справочник API"
description: "Полный справочник @powerduck/openapi-mcp-server: загрузка спецификаций, генерация инструментов, промптов и ресурсов, построение и выполнение запросов, MCP-сервер, транспорты, управление, аутентификация, реестр сервисов и CLI."
---

# Справочник API

Все публичные экспорты `@powerduck/openapi-mcp-server`, сгруппированные по назначению.

## Загрузка спецификаций

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Читает файл JSON или YAML, проверяет его, разрешает ссылки и проверяет уникальность ID операций. YAML определяется по расширению `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Разбирает документ из строки. Пустой или неверный ввод вызывает исключение. |

## Генерация инструментов

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Генерирует определения MCP `Tool` для каждой операции. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Возвращает `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Сопоставляет имена сгенерированных инструментов с их `ToolBinding`; псевдоним `getBindingIndex`. |

Экспортируемые типы: `ToolBinding`, `GeneratedToolWithBinding` (псевдоним `GeneratedTool` в пакете).

## Промпты и ресурсы

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Перечисляет все сгенерированные промпты. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Находит промпт по имени; возвращает `null`, если он неизвестен. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Перечисляет ресурсы каталога. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Читает один ресурс по URI. |

## Построение и выполнение запросов

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Сериализует аргументы в `{ url, query, headers, body, dropped }`. Позиционные аргументы. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Выполняет сгенерированный инструмент через целевой API. Ответы не-2xx возвращаются как данные; ошибки транспорта вызывают исключения. |

Поля `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Утилиты спецификаций

| Экспорт | Описание |
| --- | --- |
| `iterateOperations(spec, issues?)` | Генератор всех разрешённых операций, включая `additionalOperations` из OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Объединяет параметры элемента пути и операции по ключу `(name, in)`. |
| `normalizeParameter(candidate)` | Нормализует исходный параметр; возвращает `null`, если он непригоден. |
| `synthesizeOperationId(method, pathTemplate)` | Детерминированный резервный ID, если в операции отсутствует `operationId`. |
| `ensureUniqueName(candidate, taken)` | Добавляет числовой суффикс, чтобы сохранить уникальность имени. |
| `extractPathTemplateVariables(pathTemplate)` | Извлекает переменные `{name}`, удаляя повторы и сохраняя первое вхождение. |
| `effectiveStyle(parameter)` | Применяет значение `style` по умолчанию из спецификации. |
| `effectiveExplode(parameter)` | Применяет значение `explode` по умолчанию из спецификации. |
| `findOperationById(spec, operationId)` | Поиск за O(1) после первого построения; возвращает `null` для неизвестного ID. |
| `findDuplicateOperationIds(spec)` | Сообщает о повторяющихся ID, объявленных автором. |
| `assertUniqueOperationIds(spec)` | Выбрасывает исключение при повторяющихся ID операций. |
| `isPlainObject(value)` | Сужает тип до обычного объекта. |
| `truncateGeneratedName(name, limit=64)` | Сокращает имя, сохраняя уникальность. |

Экспортируемые типы: `OperationEntry`, `DuplicateOperationId`.

## MCP-сервер и транспорты

| Экспорт | Описание |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Создаёт `Server` из SDK с обработчиками инструментов, промптов и ресурсов. Позиционные аргументы. |
| `startStdioServer(spec, context?, options?)` | Предоставляет один документ через stdio; возвращает `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Подключает маршруты Streamable HTTP (`/mcp`) и необязательный устаревший SSE (`/sse`). Принимает `AttachMcpRoutesOptions` и возвращает `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Устаревшая обёртка с позиционными аргументами. Возвращает `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Создаёт автономный хост сессий Streamable HTTP для собственных транспортных интеграций. |

Типы: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` экспортируется из корня пакета. В параметрах задаются `maxSessions`, `allowedOrigins`, `sessionIdleMs` и защита от DNS rebinding. Объект предоставляет `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` и `dispose`. При завершении вызовите `dispose()`, чтобы остановить периодическую очистку и закрыть сессии.

## Сервер управления и аутентификация (подпуть `./server`) {#admin-server-and-auth-server-subpath}

Импортируйте `startAdminServer` из `@powerduck/openapi-mcp-server/server` или корня пакета. Импортируйте `createAuthMiddleware` из корня: подпуть `./server` его не экспортирует.

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Запускает приложение Express для управления с веб-интерфейсом и маршрутами MCP. Возвращает `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Проверка доступа через Bearer или `x-api-key`. Без ключа отключена. Позиционный аргумент. |

## Среда выполнения и утилиты

| Экспорт | Описание |
| --- | --- |
| `ServiceRegistry` | Класс для `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Истина для `AbortError` или `CanceledError` из axios. |
| `newId()` | UUID с резервным значением на основе временной метки. |

## CLI

Исполняемый файл **`openapi-mcp`**. Единственная команда — `serve`:

```
openapi-mcp serve [options]
```

| Параметр | По умолчанию | Описание |
| --- | --- | --- |
| `--port <n>` | `3000` | HTTP-порт веб-транспорта. |
| `--host <host>` | `127.0.0.1` | HTTP-хост. |
| `--transport <mode>` | `web` | `stdio` или `web`. |
| `--spec <path>` | — | Путь к файлу OpenAPI, обязательный в режиме stdio. |
| `--base-url <url>` | — | Заменяет базовый URL целевого сервиса. |
| `--api-key <key>` | — | Ключ API управления. |
| `--upstream-header "Name: value"` | — | Заголовок целевого запроса; можно указать несколько раз. |
| `--timeout <ms>` | `30000` | Тайм-аут целевого запроса. |
| `--no-persist` | — | Отключает сохранение состояния. |

## Типы (реэкспорт из `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` устарел. Функции проверки: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Ошибки и поведение

- Неизвестные ID инструментов, промптов и ресурсов вызывают ошибки MCP `InvalidParams`, а не ошибки внутри обычного результата.
- Отсутствие спецификации при активной сессии приводит к `InternalError`.
- Ответы целевого сервиса 4xx/5xx возвращаются модели как содержимое с `isError: true`, без исключений. Исключения вызывают только транспортные сбои: DNS, TLS, тайм-аут или отмена.

## См. также

- [Конфигурация](../configuration/)
- [Примеры](../examples/)
