---
sidebar_position: 3
title: "Быстрый старт"
description: "Создайте первый исполняемый пример HTTP-запроса с @powerduck/openapi-codegen и просмотрите доступные генераторы."
---

# Быстрый старт

В этом руководстве показано, как создать исполняемый пример запроса и найти доступные генераторы.

## 1. Установка

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Генерация из документа

Передайте **уже разобранный** документ OpenAPI и нужные `path`, `method`, `language`, `client`. `generate()` возвращает исходный код в виде строки.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Эквивалент для CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Список доступных генераторов

`list()` возвращает дескрипторы всех зарегистрированных генераторов:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Формат каждого дескриптора: `{ language: string; client: string }`. Идентификаторы чувствительны к регистру; используйте точные значения из списка генераторов в справочнике API. [Справочник API](/docs/ru-RU/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Генератор можно выбрать программно:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Передача учётных данных

Используйте `securityValues`, чтобы заполнить именованные схемы безопасности. Ключи должны совпадать с именами схем в документе:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Переопределение URL сервера

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Обработка ошибок

`generate()` выбрасывает исключение при отсутствии входных данных или неподдерживаемом генераторе. При обработке недоверенных документов перехватывайте исключения:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Следующие шаги

- [Настройка](/docs/ru-RU/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Примеры](/docs/ru-RU/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, собственный генератор, плагин и прямое использование `RequestIR`.
- [Справочник API](/docs/ru-RU/openapi-codegen/api-reference/) — Все экспорты.
