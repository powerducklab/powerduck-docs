---
sidebar_position: 4
title: "Настройка"
description: "Параметры генерации @powerduck/openapi-codegen: GenerateOptions, RequestIR, интерфейсы Generator и Plugin."
---

# Настройка

Отдельного файла конфигурации нет. Генерацией управляет объект `GenerateOptions`, переданный в [`generate()`](/docs/ru-RU/openapi-codegen/api-reference/).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Параметр | Тип | Обязателен | Описание |
|---|---|---|---|
| `language` | `string` | да | Идентификатор целевого языка без учёта регистра, например `"javascript"` |
| `client` | `string` | да | Идентификатор HTTP-клиента, например `"fetch"` |
| `request` | `RequestIR` | один вариант* | Уже нормализованный запрос; пропускает `normalize` |
| `document` | `unknown` | один вариант* | Разобранный объект документа OpenAPI |
| `path` | `string` | с `document` | Точный шаблон пути OpenAPI, например `"/pets/{id}"` |
| `method` | `string` | с `document` | Метод HTTP, например `"get"` / `"post"` |
| `serverUrl` | `string` | нет | Заменяет URL сервера из документа |
| `securityValues` | `Record<string, string>` | нет | Учётные данные с ключами по именам схем безопасности |
| `softRefMode` | `boolean` | нет | Не выбрасывает ошибку при неверных или циклических `$ref`, возвращает частичные значения |

\* Нужно передать либо только `request`, либо `document` + `path` + `method`. Если задан `request`, параметры `document`, `path`, `method`, `serverUrl`, `securityValues` и `softRefMode` игнорируются.

### Ошибки проверки входных данных

`generate()` выбрасывает ошибку при отсутствии обязательных данных:

- `TypeError: generate() requires an options object` — Нет объекта параметров.
- `Error: Unsupported generator: <language>/<client>` — Неизвестная комбинация.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

Сама `normalize()` выбрасывает `Error` для неподдерживаемых методов, отсутствующих `paths`, неизвестных путей и отсутствующих операций; если документ не является объектом — `TypeError`.

## RequestIR

Нормализованное представление запроса, не зависящее от генератора кода. Его можно создать напрямую и передать как `options.request`, минуя `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Маркеры multipart-файлов имеют следующую структуру:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Генератором может быть любой объект, соответствующий этому интерфейсу. Встроенные генераторы создаются через `createGenerator(language, client, emit)`, но можно зарегистрировать собственный:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` получает `RequestIR` и возвращает строку с созданным исходным кодом.

## Plugin

Плагин регистрирует один или несколько генераторов через `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Пример:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Этот тип объявлен для будущих результатов генерации, которые могут включать несколько файлов. Сейчас `generate()` по-прежнему возвращает `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Структура результата normalize

Прямой вызов `normalize()` (см. [справочник API](/docs/ru-RU/openapi-codegen/api-reference/#normalizeoptions)) возвращает объект немного шире, чем `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Порядок определения URL сервера

`baseUrl` получает первое непустое значение из списка:

1. `options.serverUrl`
2. `servers` операции
3. `servers` элемента пути
4. корневой `servers`
5. резервное значение `"https://example.com"`

Подстановки `{variable}` в адресе сервера заполняются из `server.variables`: используется `default`, затем `example`, со значением в URI-кодировке.
