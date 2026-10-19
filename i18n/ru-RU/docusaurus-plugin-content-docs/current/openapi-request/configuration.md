---
sidebar_position: 4
title: "Настройка"
description: "Настройка разделена на три уровня: параметры фабрики клиента или отладчика, объект SendOptions, передаваемый в prepare() и send(), и параметры отдельных протоколов."
---

# Настройка

Настройка разделена на три уровня: параметры фабрики клиента или отладчика, объект `SendOptions`, передаваемый в `prepare()` и `send()`, и параметры отдельных протоколов.

## Параметры фабрики

### `CreateClientOptions`

Передаются в `createClient(options?)`. Все поля необязательны.

| Поле | Тип | Описание |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Определяет, как ответы объединяются со спецификацией |
| `response` | `ToResponseOptions` | Определяет, как нормализуются объекты ответов |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Передаются в `createDebugger(config?)`. Все поля необязательны.

| Поле | Тип | Описание |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Список пользовательских адаптеров (полностью заменяет стандартные) |
| `extraAdapters` | `ProtocolAdapter[]` | Дополнительные адаптеры для стандартного реестра |
| `writeBack` | `WriteBackOptions` | Параметры записи в спецификацию |
| `response` | `ToResponseOptions` | Параметры нормализации ответов |
| `writeBackTruncated` | `boolean` | Записывать схему, выведенную из усечённого потока (по умолчанию: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Запись в спецификацию и сохранённые примеры

`WriteBackOptions` поддерживает `strategy` (`"merge"` или `"replace"`, по умолчанию `"merge"`), `keepExistingDescription` (по умолчанию `true`), `allowedStatusCodes` (пустое значение означает все коды), `protectComponentRefs` (по умолчанию `true`), `overwriteExamples` (по умолчанию `true`) и `requirePassingTests`. Конвейер отправки проверяет условие успешного прохождения тестов; прямой вызов `writeBackResponse` этого не делает.

`ToResponseOptions` поддерживает `includeExamples` (по умолчанию `true`), `maxExampleChars` (по умолчанию `4000`) и `maxEventPreviewChars` (по умолчанию `200`). Отключите сохранение примеров или проверьте их перед публикацией: реальные ответы могут содержать учётные данные или персональную информацию.

Конвейер отправки обычно возвращает изменённую копию в `patchedSpec`; он не изменяет исходный документ и не сохраняет файл. Чтобы пропустить этот шаг, задайте `writeBack: false` для конкретного вызова. Объект `writeBack` фабрики настраивает объединение, а логическое значение на уровне вызова включает или отключает запись.

## `SendOptions`

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

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

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

### `ScriptConfig`

| Поле | Тип | Описание |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Скрипты перед запросом на уровне коллекции |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Тестовые скрипты на уровне коллекции |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Скрипты перед запросом на уровне запроса |
| `test` | `ScriptSource \| ScriptSource[]` | Тестовые скрипты на уровне запроса |
| `fromSpecExtensions` | `boolean` | Читать `x-postman-scripts` из спецификации (по умолчанию: `true`) |
| `captureLastResponse` | `boolean` | Добавить встроенный помощник, предоставляющий последний ответ последующим запросам |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Задайте `scripts.fromSpecExtensions: false`, если не собираетесь выполнять скрипты, встроенные в импортированную спецификацию. Текущее значение по умолчанию — `true`; не рассчитывайте на его изменение в будущем.

## Параметры отдельных протоколов

### HTTP / SSE

HTTP — адаптер по умолчанию. Объявленное содержимое `text/event-stream` указывает на предполагаемое использование SSE; после получения заголовков также классифицируется реальный ответ. `probeStreamingResponse()` — отдельная явная проверка, а не автоматическое предварительное действие при каждом вызове.

Для обычных HTTP-запросов дополнительная настройка не нужна. Расширенные настройки postman-runtime задаются через `SendOptions.runner`.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

Ручная сессия MCP по умолчанию использует Streamable HTTP и `endpoint`. Для stdio передайте `kind: "mcp"`, `transport: "stdio"`, локальную команду `command` и необязательные `args`; запуск сессии запускает настроенный процесс.

### gRPC

Для gRPC нужны адрес, источник дескрипторов (файлы `.proto` или серверная рефлексия), полное имя сервиса и метод:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Фабрики ручных сессий возвращают ещё не открытое соединение. Перед отправкой вызовите `open()`, а при освобождении ресурсов — `close()`. Пример gRPC требует соответствующего локального сервера и proto-файла; параметры ручной сессии отличаются от объекта `SendOptions.grpc`.

## Полный пример

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Дальнейшие шаги

- Все экспортируемые типы описаны в [справочнике API](./api-reference.md)
- Сценарии для отдельных протоколов приведены в разделе [Примеры](./examples.md)
