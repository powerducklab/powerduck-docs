---
sidebar_position: 5
title: "Примеры"
description: "Практические исполняемые примеры на основе публичного API"
---

# Примеры

Практические исполняемые примеры на основе публичного API. Функции преобразования асинхронны: используйте `await`. Они разбирают входные данные локально, не отправляя записанные HTTP-запросы.

---

## 1. Простая команда curl

Преобразуйте одну команду curl и изучите полученный документ.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Диагностика возвращается даже при успешном преобразовании:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Несколько команд curl в пакете

Передайте массив команд или строку с несколькими командами. Запросы с одинаковыми методом и путём объединяются; схемы сливаются структурно.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Вывод браузера «Копировать всё как cURL»

Вставьте блок целиком: [`splitCurlCommands`](./api-reference.md#splitcurlcommands) обрабатывает кавычки, переносы команд, приглашения оболочки и `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Коллекция Postman

Преобразуйте объект коллекции. Учитываются вложенные папки, наследование аутентификации и тестовые скрипты.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

Можно передать и строку JSON:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Вывод параметров пути

При включённом `inferPathParameters` (по умолчанию) запросы группируются по методу, источнику и структуре пути. Сегмент становится параметром, только если в группе не менее `pathParameterMinSamples` запросов, значения различаются и **каждое** похоже на идентификатор: число, UUID, ULID или шестнадцатеричную строку длиной не менее 8 символов.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Имена параметров образуются из ближайшего предшествующего статического сегмента, преобразованного в единственное число и camelCase:

| Шаблон пути | Имена параметров |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Повторяющиеся имена в одном пути получают числовые суффиксы (`userId`, `userId2`).

Отключите вывод параметров, чтобы сохранить буквальные сегменты пути:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Пользовательский адаптер

Реализуйте [`SourceAdapter`](./api-reference.md), чтобы добавить источник, например HAR, HTTPie или Insomnia, затем зарегистрируйте его в `XToOpenApi`.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Обработка ошибок и строгий режим

Проблемы собираются в `result.diagnostics`. При `strict: true` диагностика уровня ошибки вызывает [`ConversionError`](./api-reference.md#conversionerror), а предупреждения сами по себе — нет. Некорректные параметры и неизвестные ID адаптеров тоже могут вызывать исключения.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

Текущая проверка размера выбрасывает `ConversionError`, если строка или суммарная длина строковых элементов массива превышает 10 × 1024 × 1024 кодовых единиц JavaScript, независимо от `strict`. Это не ограничение байтов UTF-8, и уже разобранные объекты не измеряются. Перед приёмом недоверенных данных применяйте собственный лимит в байтах.

---

## Дальнейшие шаги

- [Справочник API](./api-reference.md): значения параметров по умолчанию и коды диагностики.
- [Быстрый старт](./quickstart.md): первое сквозное преобразование.
