---
sidebar_position: 4
title: "Справочник API"
description: "Полная документация API @powerduck/openapi-codegen."
---

# Справочник API

Полная документация API `@powerduck/openapi-codegen`.

## Функции верхнего уровня

| Экспорт | Сигнатура | Описание |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Создаёт исполняемый исходный код для одной операции |
| `register` | `(generator: Generator) => void` | Регистрирует собственный генератор |
| `get` | `(language: string, client: string) => Generator \| undefined` | Находит генератор |
| `list` | `() => Array<{ language: string; client: string }>` | Возвращает список всех зарегистрированных генераторов |
| `use` | `(plugin: Plugin) => void` | Применяет плагин, регистрирующий генераторы |
| `registerBuiltins` | `() => void` | Регистрирует все встроенные генераторы, автоматически при импорте |
| `normalize` | `(options) => NormalizedRequest` | Преобразует документ, путь и метод в нормализованный запрос |
| `builtinGenerators` | `Generator[]` | Исходный массив определений всех встроенных генераторов |

Встроенные генераторы регистрируются при загрузке модуля автоматически, поэтому ручной вызов `registerBuiltins()` необязателен.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Возвращает созданный исходный код строкой. Находит генератор через `get(options.language, options.client)`; если `options.request` отсутствует, вызывает `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`, затем `generator.generate(request)`.

Возможные ошибки:

- `TypeError`, если `options` не является объектом или отсутствуют обязательные данные.
- `Error: Unsupported generator: <language>/<client>` для неизвестной комбинации.
- Ошибки `normalize()`: неизвестный путь или метод, некорректный документ, неверные или циклические `$ref`, если не включён `softRefMode`.

Полная таблица параметров приведена в разделе [Конфигурация](/docs/ru-RU/openapi-codegen/configuration/#generateoptions).

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Регистрирует во внутреннем хранилище без учёта регистра по ключу `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Возвращает `Generator` или `undefined`, если он не найден.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

Эквивалент вызова `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Идемпотентная операция с внутренним флагом. Регистрирует все элементы `builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

Разрешает `$ref`, объединяет параметры пути и операции, выбирает тип содержимого тела, создаёт примеры значений, обрабатывает безопасность и вычисляет `baseUrl`. Выбрасывает ошибки для неизвестных путей/методов и неподдерживаемых методов.

## Встроенные генераторы (21 язык, 41 клиент) {#built-in-generators-21-languages-41-clients}

Точные идентификаторы `language` и `client`, зарегистрированные в `src/emitters/index.ts`. Поиск не учитывает регистр; таблица содержит канонические идентификаторы.

| Язык | `language` | Значения `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| Файл HTTP-запроса | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Всего: 21 язык, 41 комбинация.

> Наличие генератора не означает, что любой клиент может представить любую операцию. Например, `shell/wget` не может безопасно сформировать произвольный запрос `multipart/form-data`; используйте `shell/curl` или `shell/httpie`.

## Основные типы

Реэкспортируются из `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Функции ядра

Все реэкспортируются из корня пакета.

### refs

| Экспорт | Описание |
|--------|-------------|
| `RefResolver` | Класс разрешения JSON Pointer `#/...` внутри документа. Конструктор: `(root, softMode = false)`. Методы: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Публичное поле: `softMode`. Выбрасывает ошибки для внешних, неверных и циклических ссылок, если `softMode` не истинен. |

### example

| Экспорт | Описание |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Создаёт пример значения из JSON Schema. Учитывает `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, типы, форматы и ограничения. |
| `ExampleGenContext` | Тип `{ isRequestBody: boolean; isResponse: boolean }`, управляющий фильтрацией `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Значение по умолчанию: `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Экспорт | Описание |
|--------|-------------|
| `Pair` | Тип `[string, string]`. |
| `parameter(parameter)` | Сериализует параметр в `Pair[]` по правилам OpenAPI `style`/`explode`: form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject. |
| `query(pairs)` | Объединяет пары в строку запроса. |
| `cookie(pairs)` | Объединяет пары в значение заголовка `Cookie`. |
| `headerValue(value)` | Очищает значение заголовка от CR/LF/NUL. |

### generator

| Экспорт | Описание |
|--------|-------------|
| `createGenerator(language, client, emit)` | Оборачивает функцию `emit(request) => string` в `Generator`. |
| `GeneratorEmitter` | Тип `(request: RequestIR) => string`. |

### registry

| Экспорт | Описание |
|--------|-------------|
| `registerGenerator(generator)` | Добавляет запись в хранилище без учёта регистра. |
| `getGenerator(language, client)` | Читает из хранилища. |
| `listGenerators()` | Возвращает `[{ language, client }, ...]`. |

### plugin

| Экспорт | Описание |
|--------|-------------|
| `PluginApi` | Тип `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Вызывает `plugin.register(api)`. |

### request

| Экспорт | Описание |
|--------|-------------|
| `CompiledRequest` | Тип `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Подставляет параметры пути, формирует пары query/header/cookie, применяет безопасность и собирает URL. |
| `form(value)` | Сериализует объект в строку `application/x-www-form-urlencoded`. |

### helpers

Часто используемые утилиты:

| Экспорт | Описание |
|--------|-------------|
| `isRecord(value)` | Проверка типа для обычных объектов. |
| `isFileValue(value)` | Проверка типа для маркера `FileValue`. |
| `firstDefined(...values)` | Первое значение, отличное от `undefined`. |
| `nonBlankString(value, fallback?)` | Непустая строка без пробелов по краям либо `undefined`/резервное значение. |
| `normalizeMethod(method)` | Метод в верхнем регистре; по умолчанию `GET`. |
| `supportsRequestBody(method)` | `false` для `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` для `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Фактический тип содержимого из тела или заголовка Content-Type. |
| `hasJsonBody(request)` | Тип содержимого JSON или `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Исходный текст тела или форматированный JSON. |
| `toHeaderObject(headers)` | Преобразует пары в `Record<string,string>`. |
| `toKeyValueBody(value)` | Разворачивает multipart-тело в упорядоченные описания полей. |
| `collectByLocation(request, location)` | Фильтрует параметры по расположению OpenAPI. |
| `operationName(request)` | Выводит имя функции или переменной в snake_case из метода и пути. |
| `sanitizeIdentifier(value)` | Преобразует произвольный текст в допустимый идентификатор. |
| `indent(text, prefix="  ")` | Добавляет отступ каждой непустой строке. |
| `stringifyLiteral(value)` | Форматированный JSON с безопасным резервным вариантом. |
| `kotlinValue(value)` / `formFieldValue(value)` | Сериализует значение для литерала или поля формы. |
| `fileComment(path, fieldName)` | Создаёт TODO-комментарий для временного пути multipart-файла. |
| `mergeAllOfSchemas(schemas, resolver)` | Поверхностно объединяет схемы `allOf`. |
| `lightweightOpenAPIPreCheck(doc)` | Возвращает структурные предупреждения о документе. |
| `browserHeaders(headers, multipart)` | Удаляет заголовки, запрещённые браузером. |
| `isBrowserForbiddenHeader(name)` | Определяет, управляется ли заголовок сетевыми API браузера. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Функции экранирования строковых литералов для каждого языка. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Проверки утверждений во время выполнения. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Константы для файлов-заглушек при загрузке. |
