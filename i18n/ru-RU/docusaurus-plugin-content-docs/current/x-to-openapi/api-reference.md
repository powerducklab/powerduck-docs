---
sidebar_position: 4
title: "Справочник API"
description: "Справочник по публичной точке входа @powerduck/x-to-openapi"
---

# Справочник API

Справочник по публичной точке входа `@powerduck/x-to-openapi`. Приведённые сигнатуры кратко описывают API; полные аннотации readonly и импортируемые типы см. в декларациях TypeScript пакета.

---

## Вспомогательные функции без настройки

### `curlToOpenApi`

Преобразование за один вызов: регистрирует [`CurlAdapter`](#curladapter) и вызывает [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `input` | `string \| readonly string[]` | Команда curl, массив команд или результат «Copy all as cURL» в браузере; текст с несколькими командами разбивается автоматически. |
| `options` | `ConvertOptions` | Необязательные настройки преобразования. |

**Возвращает:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Преобразование за один вызов: регистрирует [`PostmanAdapter`](#postmanadapter) и преобразует разобранный объект коллекции или строку JSON. Тестовые скрипты сохраняются как `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Параметр | Тип | Описание |
|---|---|---|
| `input` | `unknown` | Объект Postman Collection v2.0/v2.1.0 или его представление в виде строки JSON. |
| `options` | `ConvertOptions` | Необязательные настройки преобразования. |

**Возвращает:** [`ConvertResult`](#convertresult).

---

## Основные компоненты

### `XToOpenApi`

Класс преобразователя. Содержит [`AdapterRegistry`](#adapterregistry) и выполняет последовательность разбор → построение → проверка.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

Регистрирует адаптер. Возвращает `this` для цепочек вызовов. Проверяет `id` адаптера по `/^[a-z][a-z0-9-]*$/`, требует метод `parse()` и отклоняет повторяющиеся идентификаторы.

#### `adapters()`

Возвращает идентификаторы зарегистрированных адаптеров как `string[]`.

#### `convert(source, input, options?)`

Единая точка входа.

| Параметр | Тип | Описание |
|---|---|---|
| `source` | `string` | Идентификатор адаптера (`"curl"`, `"postman"`, …) или `"auto"` для выбора через `canHandle()`. |
| `input` | `unknown` | Исходные данные; их структура зависит от адаптера. |
| `options` | `ConvertOptions` | Необязательные настройки преобразования. |

**Порядок работы:**

1. Дополняет параметры значениями из [`DEFAULT_OPTIONS`](#default_options) и проверяет их.
2. Отклоняет с `ConversionError` строки или суммарные строковые элементы массива длиной более **10 × 1024 × 1024 кодовых единиц JavaScript**. Это не ограничение в байтах UTF-8; размер разобранных объектов не измеряется.
3. Выбирает адаптер по явному идентификатору или через определение `"auto"`.
4. Разбирает входные данные в `NormalizedRequest[]`; ошибки разбора становятся диагностическими сообщениями.
5. Создаёт документ OpenAPI 3.2 через [`buildOpenApi32`](#buildopenapi32).
6. Если `validate` равно `true`, проверяет документ через [`validateOpenApi32`](#validateopenapi32) и включает полученные диагностические сообщения в результат.
7. Возвращает [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Значения по умолчанию, с которыми объединяются все [`ConvertOptions`](#convertoptions). Экспортируются как `ResolvedConvertOptions`.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

Хранит зарегистрированные адаптеры по идентификатору.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Метод | Описание |
|---|---|
| `register(adapter)` | Проверяет идентификатор (`/^[a-z][a-z0-9-]*$/`), наличие `parse()` и отсутствие дубликатов. Возвращает `this`. |
| `has(id)` | Проверяет, зарегистрирован ли адаптер. |
| `get(id)` | Возвращает адаптер или выбрасывает ошибку со списком зарегистрированных идентификаторов. |
| `detect(input)` | Возвращает первый адаптер, чей `canHandle()` принимает входные данные. Исключения в проверяющих функциях перехватываются, а соответствующий адаптер пропускается. |
| `ids()` | Перечисляет зарегистрированные идентификаторы. |

---

### `ConversionError`

Выбрасывается при диагностических сообщениях уровня ошибки в режиме `strict`, слишком длинных входных строках или неудачном автоматическом выборе адаптера. Содержит доступные диагностические сообщения; список может быть пустым. Недопустимые параметры и ошибки регистрации могут вместо этого приводить к `TypeError` или `Error`.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

Внутренний сборщик для [`XToOpenApi.convert`](#convertsource-input-options). Удаляет повторяющиеся диагностические сообщения и выбрасывает `ConversionError` для сообщений уровня ошибки, если `strict` равно `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Адаптеры

### `CurlAdapter`

Преобразует одиночные команды curl, наборы команд или экспорт браузера в `NormalizedRequest[]`. Оборачивает `curlconverter` и нормализует его вывод.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` принимает строку или первый элемент массива, начинающийся с необязательного приглашения оболочки (`$`, `#`, `>`), за которым следует `curl` или `curl.exe`.
- `parse` разбивает ввод из нескольких команд через [`splitCurlCommands`](#splitcurlcommands), пропускает URL не на HTTP(S), удаляет псевдозаголовки HTTP/2, разбирает тела и cookie, а также определяет аутентификацию.

> `resolveBackend`, `availableExports` и `resetBackend` — внутренние средства интеграции, а не поддерживаемые экспорты пакета. Импортируйте публичный адаптер, а не внутренние файлы.

---

### `splitCurlCommands`

Разбивает результат браузерной команды «Copy all as cURL» на отдельные команды. Поддерживает одинарные и двойные кавычки, продолжения строк с обратной косой чертой и знаком `^`, CRLF, приглашения оболочки (`$`, `#`, `>`, `PS C:\>`) и `curl.exe`.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

Преобразует Postman Collections v2.0/v2.1.0 в `NormalizedRequest[]`. Обходит вложенные папки, разрешает наследование аутентификации с приоритетом элемент > папка > коллекция, сопоставляет режимы тела и сохраняет тестовые скрипты.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` принимает объект или разобранную строку JSON с объектом `info` и массивом `item`. Поддерживаются URL схем v2.1.0 и v2.0, а также структурно корректные коллекции без URL схемы.
- События тестирования и подготовки запроса сохраняются в операции как `x-postman-scripts`.

---

### `PostmanTypes`

Пространство имён со всеми типами коллекций Postman, используемыми адаптером:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

Основные элементы: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Компоненты построения OpenAPI

### `buildOpenApi32`

Низкоуровневый построитель. Создаёт документ OpenAPI 3.2 из массива уже нормализованных запросов. Обычно вызывается косвенно через [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Группирует операции по пути и методу, собирает параметры строки запроса, заголовков, cookie и пути, объединяет схемы тел, формирует `securitySchemes`, помещает нестандартные методы в `additionalOperations` и назначает `operationId`/`tags`.

---

### `buildPathTemplates`

Группирует запросы одинаковой структуры и заменяет параметрами сегменты, которые меняются как минимум в `minSamples` образцах и во всех образцах похожи на идентификаторы.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Возвращает отображение с ключом `sourceIndex`. Каждый `PathTemplate` содержит:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Если `enabled` равно `false`, каждый запрос получает статический шаблон, совпадающий с исходным путём.

---

### `looksLikeIdentifier`

Единое правило определения сегментов, которые можно заменить параметрами.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Возвращает `true`, если сегмент состоит только из цифр, является UUID, ULID или шестнадцатеричной строкой длиной не менее 8 символов.

---

### `scalar`

Выводит JSON Schema из одного строкового образца, намеренно используя консервативный подход.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Определяет `boolean`, `integer` с ограничением длины для безопасных целых чисел, `number` или `string` с `format` (`uuid`, `date`, `date-time`); иначе использует обычный `string`.

---

### `jsonSchema`

Выводит JSON Schema из любого значения JSON: объекта, массива или скаляра.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Объекты преобразуются в `{ type: "object", properties, required }`, массивы — в `{ type: "array", items }` с `{}` для пустых массивов; скаляры типизируются аналогично `scalar`.

---

### `mergeSchemas`

Структурно объединяет несколько схем образцов. Объединяет свойства объектов; свойство, отсутствующее хотя бы в одном образце, становится необязательным. Массивы обрабатываются рекурсивно; `integer` расширяется до `number`. Форматы сохраняются только при совпадении во всех образцах.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Структурное подмножество JSON Schema для выведенных схем тел и параметров.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## Канонический тип и проверка

### `validateOpenApi32`

Проверяет документ OpenAPI по схеме OpenAPI 3.2 через `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Ошибки проверки преобразуются в диагностические сообщения с кодом `OAS_VALIDATION_ERROR`, а сбои валидатора — с кодом `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Канонический псевдоним [`validateOpenApi32`](#validateopenapi32). Зависимые библиотеки `@powerduck/*` должны импортировать это стабильное имя.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Канонический тип документа OpenAPI 3.2 — псевдоним `Oas32Document` из `@powerduck/openapi-parser`. Все библиотеки `@powerduck/*` должны использовать его вместо прямого обращения к сторонним пакетам типов.

### `OpenApi32Document`

Псевдоним `OpenApiDocument`, привязанный к версии.

---

## Типы

### `ConvertOptions`

Все настройки преобразования. Неуказанные поля получают значения из [`DEFAULT_OPTIONS`](#default_options).

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Поддерживается только `"3.2.0"`; любое другое значение вызывает ошибку. |
| `title` | `string` | `"Generated API"` | `info.title`. Не может быть пустым. |
| `version` | `string` | `"1.0.0"` | `info.version`. Не может быть пустым. |
| `description` | `string` | `""` | `info.description`. Пропускается при пустом значении. |
| `inferPathParameters` | `boolean` | `true` | Заменяет параметрами изменяющиеся сегменты, похожие на идентификаторы. |
| `pathParameterMinSamples` | `number` | `2` | Минимальное число запросов в группе для шаблонизации. Должно быть положительным целым числом. |
| `inferSecurity` | `boolean` | `true` | Создаёт `securitySchemes` и `security` для каждой операции. |
| `includeCommonHeaders` | `boolean` | `false` | Включает вспомогательные заголовки браузера. Транспортные заголовки всегда исключаются. |
| `includeCookies` | `boolean` | `false` | Выводит cookie как параметры. |
| `includeExamples` | `boolean` | `false` | Заполняет примеры схем и параметров наблюдаемыми значениями. |
| `useServerBasePath` | `boolean` | `false` | Переносит общий префикс пути в `servers[0].url`, если все запросы имеют один источник. |
| `validate` | `boolean` | `true` | Проверяет выходной документ. Ошибки проверки становятся диагностическими сообщениями; строгий режим может превратить их в исключения. |
| `strict` | `boolean` | `false` | Выбрасывает `ConversionError` при любом диагностическом сообщении уровня ошибки. |

`ResolvedConvertOptions` соответствует `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Возвращаемое значение каждого преобразования.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

Промежуточное представление, не зависящее от адаптера и создаваемое каждым адаптером.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` — объединение строковых типов для всех кодов, которые может сообщить фреймворк:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Другие основные типы

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Преобразование промежуточного представления обнаружения

### `discoveryToOpenApi`

Преобразует переданный `DiscoveredProject` в OpenAPI 3.2. Самостоятельно не сканирует исходные файлы. Неразрешённые маршруты создают предупреждения и никогда не добавляются в `paths` без уведомления; позиции в исходниках и уровень уверенности сохраняются в возвращённом проекте.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false` повышает уровень диагностик пробелов в операциях и схемах до ошибок; это не переключатель исключений строгого режима. Всегда проверяйте `ok`, `documentValid` и `diagnostics`. Предупреждения о неразрешённых маршрутах сообщаются отдельно. При отключённой проверке `documentValid` имеет истинное значение без валидации схемы.

### `buildDiscoveryOpenApi32`

Низкоуровневый синхронный построитель для того же промежуточного представления. Передаёт диагностики в указанный обратный вызов и не проверяет документ. Если нужны проверка и полный объект результата, используйте асинхронную обёртку.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Типы обнаружения, экспортируемые из основной точки входа: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## Сводка экспортов

| Символ | Категория |
|---|---|
| `curlToOpenApi` | функция |
| `postmanToOpenApi` | функция |
| `XToOpenApi` | класс |
| `DEFAULT_OPTIONS` | константа |
| `AdapterRegistry` | класс |
| `ConversionError` | класс |
| `DiagnosticBag` | класс |
| `CurlAdapter` | класс |
| `splitCurlCommands` | функция |
| `PostmanAdapter` | класс |
| `PostmanTypes` | пространство имён |
| `buildOpenApi32` | функция |
| `buildPathTemplates` | функция |
| `looksLikeIdentifier` | функция |
| `scalar` | функция |
| `jsonSchema` | функция |
| `mergeSchemas` | функция |
| `Schema` | тип |
| `discoveryToOpenApi` | функция |
| `buildDiscoveryOpenApi32` | функция |
| `validateOpenApi32` | функция |
| `validateOpenApiDocument` | функция (псевдоним) |
| `OpenApiDocument` | тип |
| `OpenApi32Document` | тип |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | типы |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | типы |
