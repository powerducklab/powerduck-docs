---
sidebar_position: 3
title: "Быстрый старт"
description: "Начало работы с @powerduck/x-to-openapi: преобразование команд curl и коллекций Postman, регистрация собственных адаптеров через XToOpenApi."
---

# Быстрый старт

Руководство охватывает три основных способа работы: функции `curlToOpenApi` и `postmanToOpenApi`, а также класс `XToOpenApi` для собственной конфигурации.

Предварительно установите пакет. [Установка](/docs/ru-RU/x-to-openapi/installation/)

:::note
Все функции преобразования **асинхронные** и возвращают [`ConvertResult`](/docs/ru-RU/x-to-openapi/api-reference/#convertresult). Всегда используйте `await`.
:::

## 1. Преобразование команды curl

Передайте одну команду curl в [`curlToOpenApi`](/docs/ru-RU/x-to-openapi/api-reference/#curltoopenapi). Поле `document` результата содержит созданный объект OpenAPI 3.2.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Созданный документ выглядит так, в сокращённом виде:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

Проверьте успех преобразования и диагностические сообщения:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Преобразование коллекции Postman

Передайте разобранный объект коллекции или строку JSON в [`postmanToOpenApi`](/docs/ru-RU/x-to-openapi/api-reference/). Тестовые скрипты сохраняются в `x-postman-scripts`.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

Строка JSON тоже подходит:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Класс `XToOpenApi` с собственными параметрами

Используйте класс для явного управления зарегистрированными адаптерами и [`ConvertOptions`](/docs/ru-RU/x-to-openapi/api-reference/#convertoptions).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### Регистрация нескольких адаптеров и режим `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Диагностика и строгий режим

По умолчанию преобразование собирает проблемы в записи [`Diagnostic`](/docs/ru-RU/x-to-openapi/api-reference/) и всё равно возвращает результат. Установите `strict: true`, чтобы при первом сообщении уровня ошибки выбрасывалась [`ConversionError`](/docs/ru-RU/x-to-openapi/api-reference/#conversionerror).

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## Следующие шаги

- [Примеры](/docs/ru-RU/x-to-openapi/examples/) — Пакетная обработка curl, определение параметров пути, аутентификация Postman и собственный адаптер.
- [Справочник API](/docs/ru-RU/x-to-openapi/api-reference/) — Все экспорты, параметры и диагностические коды.
