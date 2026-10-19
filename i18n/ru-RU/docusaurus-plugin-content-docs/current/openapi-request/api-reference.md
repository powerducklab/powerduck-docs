---
sidebar_position: 5
title: "Справочник API"
description: "Справочник основных API интеграции @powerduck/openapi-request"
---

# Справочник API

Справочник основных API интеграции `@powerduck/openapi-request`. Таблицы кратко описывают контракты; полный перечень перегрузок и необязательных параметров содержится в декларациях TypeScript пакета. Основная точка входа и подпути протоколов экспортируют разные наборы элементов.

## Основные API

### `createClient(options?): ProtoClient`

Создаёт клиент для пользовательских интерфейсов. Аргумент `options` необязателен.

**Параметры:**

| Имя | Тип | Описание |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Необязательная настройка |
| `options.writeBack` | `WriteBackOptions` | Определяет, как ответы объединяются со спецификацией |
| `options.response` | `ToResponseOptions` | Определяет, как нормализуются объекты ответов |

**Возвращает:** `ProtoClient` со следующими методами:

| Метод | Сигнатура | Описание |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Планирует запрос и возвращает протокол, режим отображения и тип потока |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Выполняет запрос |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Пакетное выполнение с результатами для каждой цели; ошибка не удаляет остальные результаты |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Создаёт ещё не открытую сессию websocket/mcp/grpc; для подключения вызовите `open()` |
| `discover` | `(discoverOptions) => Promise<any>` | Обнаруживает возможности MCP и gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Объединяет наблюдаемый ответ с документом |
| `dispose` | `() => void` | Сейчас ничего не делает; вызывающий код должен сам закрывать сессии |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Выполняет запрос fetch и классифицирует ответ; прочитайте или отмените полученное тело ответа |

**Пример:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Создаёт программируемый отладчик для автоматизации, скриптов и CI.

**Параметры:**

| Имя | Тип | Описание |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Необязательная настройка |
| `config.adapters` | `ProtocolAdapter[]` | Список пользовательских адаптеров, заменяющий стандартные |
| `config.extraAdapters` | `ProtocolAdapter[]` | Дополнительные адаптеры к стандартным |
| `config.writeBack` | `WriteBackOptions` | Параметры записи в спецификацию |
| `config.response` | `ToResponseOptions` | Параметры нормализации ответов |
| `config.writeBackTruncated` | `boolean` | Записывает схему, выведенную из усечённых потоков (по умолчанию: true) |

**Возвращает:** `ProtoKit` с `prepare`, `send`, `sendMany`, `toCollection` и другими методами.

**Пример:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Создаёт длительную дуплексную сессию для WebSocket, MCP или gRPC. Фабрика не выполняет ввод-вывод; подключение открывается вызовом `open()`.

**Параметры:**

| Имя | Тип | Описание |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Используемый протокол |
| `options.url` | `string` | URL подключения WebSocket |
| `options.endpoint` | `string` | Эндпоинт MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Транспорт MCP; по умолчанию Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Локальный исполняемый файл и аргументы для MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Адрес gRPC, полное имя сервиса и метод |

Для gRPC также укажите источник дескрипторов через `protoPaths` или `reflection`. Параметры отдельных протоколов приведены в разделе [Настройка](./configuration.md).

**Возвращает:** сессию с `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` и `state`. `onEvent()` возвращает подписку с методом `unsubscribe()`.

**Пример:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Реестр экземпляров `ProtocolAdapter`. Новый реестр пуст; `createDebugger()` регистрирует встроенные адаптеры HTTP, WebSocket, gRPC, MCP и GraphQL, если они не заменены пользовательским списком. Для управления выбором используйте `register()`, `unregister()`, `get()`, `list()`, `rank()` и `resolve()`.

### `ProtoKitError`

Типизированная ошибка, выбрасываемая отладчиком и основными путями выполнения. Используйте `instanceof ProtoKitError`, чтобы отличать ошибки библиотеки от неожиданных сбоев.

## Основные типы

### `SendOptions`

Основной входной объект для `prepare()` и `send()`. В нём передаются спецификация, целевая операция, значения и все настройки запроса.

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Да | Полный документ OpenAPI 3.2 |
| `target` | `OperationTarget` | Да | Идентификатор операции (см. ниже) |
| `values` | `RequestValues` | Нет | Конкретные значения пути, строки запроса, заголовков, cookie и тела |
| `serverUrl` | `string` | Нет | Переопределяет `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Нет | Переменные шаблона URL сервера |
| `variables` | `Record<string, string>` | Нет | Переменные окружения, доступные через `{{name}}` |
| `globals` | `Record<string, string>` | Нет | Глобальные переменные в стиле Postman |
| `localVariables` | `Record<string, string>` | Нет | Локальные переменные |
| `collectionVariables` | `Record<string, string>` | Нет | Переменные уровня коллекции |
| `auth` | `AuthConfig` | Нет | Настройки аутентификации |
| `scripts` | `ScriptConfig` | Нет | Скрипты перед запросом и тестовые скрипты |
| `runner` | `RuntimeRunOptions` | Нет | Прямая передача всех параметров postman-runtime (наивысший приоритет) |
| `websocket` | `WebSocketOptions` | Нет | Параметры WebSocket |
| `graphql` | `GraphQLOptions` | Нет | Параметры GraphQL |
| `mcp` | `McpOptions` | Нет | Параметры MCP |
| `grpc` | `any` | Нет | Параметры gRPC |
| `timeout` | `number` | Нет | Тайм-аут отдельного запроса в мс (сокращённая запись для `runner.timeout.request`) |

`SendOptions` также принимает следующие параметры выполнения и потоковой обработки:

| Поле | Тип | Описание |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Изолированный транспорт fetch, предоставленный приложением, где он поддерживается; HTTP/SSE по-прежнему используют postman-runtime. |
| `writeBack` | `boolean` | Значение `false` оставляет `patchedSpec` неопределённым, но не мешает формированию `responseFragment`. |
| `signal` | `AbortSignal` | Отменяет выполнение или сбор выборки; при этом может вернуться частичный результат. |
| `maxEvents` | `number` | Максимальное число сохраняемых событий потока. |
| `maxStreamMs` | `number` | Максимальная длительность сбора выборки потока в миллисекундах. |
| `maxResponseSize` | `number` | Ограничение размера ответа в байтах. |
| `maxBufferChars` | `number` | Лимит буфера парсера SSE до границы события; по умолчанию `4194304` символа. |
| `maxEventChars` | `number` | Лимит сохраняемых данных одного события SSE; по умолчанию `1048576` символов. |
| `inheritEventId` | `boolean` | Наследовать последний ID события SSE, если новый не указан; по умолчанию `true`. Для более строгого вывода схемы задайте `false`. |
| `onEvent` | `(event: StreamEvent) => void` | Получение событий потока. |
| `onConsole` | `(log: ConsoleLog) => void` | Получение вывода консоли скриптов. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Получение результатов проверок. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Просмотр ранних заголовков HTTP/SSE и признака `streaming`. |
| `onOpen` | `(info) => void` | Получение сведений о соединении WebSocket: URL, протокол и заголовки. |

Адаптеры протоколов могут по-разному трактовать ограничения. Обработчики интерфейса должны оставаться лёгкими; исключения из обработчиков перехватывает слой выполнения. Для настроек отправителя HTTP-запросов используйте `runner.requester`; если указан `maxResponseSize`, он должен быть положительным, а не нулевым.

### `OperationTarget`

Определяет одну операцию. Предпочтительно использовать либо `operationId`, либо `method` + `path`. Если указаны оба варианта, приоритет имеет `operationId`.

| Поле | Тип | Описание |
| --- | --- | --- |
| `operationId` | `string` | Альтернативный ключ поиска; имеет приоритет над парой путь + метод |
| `method` | `string` | Метод HTTP без учёта регистра. Требует `path`. |
| `path` | `string` | Шаблон пути, например `/users/{id}`. Требует `method`. |

### `RequestValues`

Конкретные значения, подставляемые в сформированный запрос.

| Поле | Тип | Описание |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Значения параметров пути |
| `query` | `Record<string, unknown>` | Значения параметров строки запроса |
| `header` | `Record<string, unknown>` | Значения заголовков |
| `cookie` | `Record<string, unknown>` | Значения cookie |
| `querystring` | `string` | Готовая закодированная строка запроса (расположение `querystring` в OpenAPI 3.2) |
| `body` | `unknown` | Тело запроса |
| `contentType` | `string` | Принудительный выбор типа содержимого запроса, если операция объявляет несколько типов |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Поле | Тип | Описание |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Тип аутентификации |
| `token` | `string` | Токен Bearer (для `type: "bearer"`) |
| `username` | `string` | Имя пользователя Basic (для `type: "basic"`) |
| `password` | `string` | Пароль Basic (для `type: "basic"`) |
| `key` | `string` | Имя ключа API (для `type: "apikey"`) |
| `value` | `string` | Значение ключа API (для `type: "apikey"`) |
| `in` | `"header" \| "query"` | Расположение ключа API (для `type: "apikey"`) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Расширенные типы аутентификации: `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` и `edgegrid`. Поля соответствующих механизмов Postman для HTTP/SSE/GraphQL передаются через `parameters: Record<string, string | boolean | number>`. Необязательное поле `oauth2: OAuth2FlowConfig` включает получение и обновление токенов для типа OAuth 2.0; не следует считать, что каждый механизм аутентификации применим ко всем протоколам.

### `PreparedRequest`

Возвращается из `createClient().prepare()`. У отладчика другой результат планирования: `createDebugger().prepare()` возвращает `PlanResult` с `located`, `adapter` и `plan`.

| Поле | Тип | Описание |
| --- | --- | --- |
| `protocol` | `string` | Определённый протокол (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Определённый транспорт |
| `target` | `OperationTarget` | Исходная цель |
| `operation` | `any` | Найденный объект операции OpenAPI |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Классификация потока (см. ниже) |
| `stream.expected` | `boolean` | Ожидается ли потоковая передача |
| `openapi.extensions` | `Record<string, unknown>` | Определённые расширения OpenAPI |
| `warnings` | `string[]` | Предупреждения, возникшие при планировании |

### `StreamKind`

Точная классификация потоков: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Вспомогательные функции OpenAPI

| Экспорт | Сигнатура | Описание |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Находит операцию по `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Выводит JSON Schema из одного наблюдаемого значения |
| `inferSchemaFromMany` | `(values) => Schema` | Выводит схему, охватывающую несколько наблюдаемых значений |
| `mergeSchema` | `(a, b) => Schema` | Объединяет две выведенные схемы (объединение или комбинация) |
| `sampleFromSchema` | `(schema) => unknown` | Создаёт реалистичный пример значения для схемы |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Создаёт объект ответа OpenAPI из наблюдаемого результата |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Объединяет наблюдаемый ответ с документом |

Экспортируемые типы: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Следующие имена доступны из основной точки входа. Подпуть `@powerduck/openapi-request/http` экспортирует `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` и `runWithPostman`; функции определения типа потока и `BUILTIN_CAPTURE_TEST` импортируйте из основной точки входа.

| Экспорт | Описание |
| --- | --- |
| `HttpAdapter` | Стандартный адаптер протокола HTTP/HTTPS |
| `SseParser` | Потоковый парсер, преобразующий поток байтов SSE в структурированные события |
| `isStreamingOperation` | Определяет потоковую операцию по объявленным типам содержимого |
| `isSseContentType` | Проверяет, указывает ли тип содержимого на SSE |
| `isStreamingContentType` | Проверяет, указывает ли тип содержимого на потоковую передачу |
| `acceptHeaderFor` | Формирует подходящий заголовок Accept для операции |
| `probeStreamingResponse` | Выполняет запрос fetch и классифицирует ответ; прочитайте или отмените полученное тело ответа |
| `BUILTIN_CAPTURE_TEST` | Встроенный тестовый скрипт Postman для сохранения последнего ответа |

## WebSocket

Импортируйте из `@powerduck/openapi-request/ws`.

| Экспорт | Описание |
| --- | --- |
| `WebSocketAdapter` | Адаптер протокола для целей WebSocket |
| `createWsManualSession` | Создаёт ручную дуплексную сессию WebSocket; также доступен как `runWebSocketSession` и `wsManualSession` |

## GraphQL

Импортируйте из `@powerduck/openapi-request/graphql`.

| Экспорт | Описание |
| --- | --- |
| `GraphQLAdapter` | Адаптер протокола для целей GraphQL |
| `resolveGraphQLConfig` | Определяет конфигурацию GraphQL из операции |
| `runGraphQL` | Выполняет операцию GraphQL |
| `introspectSchema` | Получает схему эндпоинта GraphQL через интроспекцию |
| `INTROSPECTION_QUERY` | Стандартный запрос интроспекции GraphQL |
| `generateOperation` | Генерирует документ запроса по схеме GraphQL, полученной интроспекцией, и полю |
| `generateAllOperations` | Генерирует документы запросов для полей схемы GraphQL, полученной интроспекцией |
| `writeGraphQLOperations` | Записывает сгенерированные операции GraphQL в спецификацию |
| `discoverAndWriteGraphQLSchema` | Обнаруживает схему GraphQL и записывает её в спецификацию |

## MCP (Model Context Protocol)

Большинство перечисленных ниже элементов доступны из `@powerduck/openapi-request/mcp`. Импортируйте `initializeMcpSession` из основной точки входа; в подпути эта функция называется `initializeSession`. Подпуть также предоставляет `runMcp`, `createMcpSessionCore` и `createMcpStdioConnection`.

| Экспорт | Описание |
| --- | --- |
| `McpAdapter` | Адаптер протокола для целей MCP |
| `createMcpManualSession` | Создаёт ручную сессию MCP; также доступен как `mcpManualSession` |
| `createMcpStdioSession` | Создаёт сессию MCP через stdio |
| `runMcpManualSession` | Устарело: используйте `createMcpManualSession` |
| `resolveMcpConfig` | Определяет конфигурацию MCP из операции |
| `initializeMcpSession` | Инициализирует сессию MCP (псевдоним `initializeSession`) |
| `discoverMcpCapabilities` | Обнаруживает возможности сервера MCP |
| `MCP_PROTOCOL_VERSION` | Поддерживаемая версия протокола MCP |
| `generateMcpCall` | Генерирует один вызов инструмента MCP |
| `generateAllMcpCalls` | Генерирует все вызовы инструментов MCP |
| `writeMcpOperations` | Записывает операции MCP в спецификацию |
| `discoverAndWriteMcpCapabilities` | Обнаруживает возможности MCP и записывает их в спецификацию |
| `createHttpMcpTransport` | Создаёт транспорт HTTP для MCP |
| `createStdioMcpTransport` | Создаёт транспорт stdio для MCP |

## gRPC

Импортируйте низкоуровневые функции обнаружения, вызовов и работы с дескрипторами из `@powerduck/openapi-request/grpc`. `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` и `discoverGrpc` импортируются из основной точки входа; в подпути функция обнаружения называется `discover`. Подпуть также предоставляет `discoverFromCatalog`, `describeMethod` и `describeFromCatalog`, позволяя повторно использовать каталог без повторения рефлексии для каждого метода.

| Экспорт | Описание |
| --- | --- |
| `GrpcProtocolAdapter` | Адаптер протокола gRPC для OpenAPI |
| `GrpcAdapter` | Низкоуровневый адаптер gRPC |
| `grpcDiscover` / `discoverGrpc` | Обнаруживает сервисы и методы gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Создаёт ручную сессию gRPC |
| `grpcCall` | Выполняет один вызов gRPC |
| `resolveMethod` | Находит дескриптор метода gRPC |
| `buildMessageTemplate` | Создаёт шаблон сообщения по дескриптору |
| `buildCatalog` | Создаёт каталог сервисов и методов |
| `LOADER_OPTIONS` | Стандартные параметры загрузчика proto |
| `scanProtoFiles` | Ищет proto-файлы в каталогах |
| `deriveIncludeDirsDetailed` | Определяет каталоги включения по путям proto-файлов |
| `fetchDescriptorSet` | Получает набор дескрипторов через рефлексию gRPC |
| `fetchFullDescriptorSet` | Получает полный набор дескрипторов со всеми зависимостями |
| `listServices` | Перечисляет сервисы из набора дескрипторов |
| `listServicesDetailed` | Перечисляет сервисы с подробной информацией о методах |
| `serializeDescriptorSet` | Сериализует набор дескрипторов в байты |
| `decodeFileDescriptorProto` | Декодирует один proto дескриптора файла |
| `decodeFileDescriptorSet` | Декодирует набор дескрипторов файлов |
| `buildCredentials` | Создаёт учётные данные gRPC синхронно |
| `buildCredentialsAsync` | Создаёт учётные данные gRPC асинхронно |
| `buildCredentialsChecked` | Создаёт учётные данные с проверкой синхронно |
| `buildCredentialsCheckedAsync` | Создаёт учётные данные с проверкой асинхронно |
| `loadGrpc` | Динамически загружает пакет `@grpc/grpc-js` |
| `isGrpcAvailable` | Проверяет доступность зависимостей gRPC |
| `requireCapability` | Требует указанную возможность gRPC и выбрасывает ошибку, если она недоступна |

Основная точка входа экспортирует псевдонимы типов `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` и `GrpcDiscoveredService`. В подпути gRPC они называются `DiscoveryResult`, `DiscoveredMethod` и `DiscoveredService`.

Типы ошибок: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Дополнительные утилиты

Основная точка входа также экспортирует функции OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` и `authFromOAuth2Token`, утилиту копирования `toCloneable`, базовый класс `UnifiedSession` и функции записи gRPC `writeGrpcOperations` и `discoverAndWriteGrpcOperations`.

## Экспорты подпутей

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
