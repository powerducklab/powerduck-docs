---
sidebar_position: 5
title: "Примеры"
description: "Практические примеры @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, собственные генераторы, плагины и прямой RequestIR."
---

# Примеры

Практические примеры для `@powerduck/openapi-codegen`. Во всех примерах предполагается наличие разобранного объекта OpenAPI с именем `document`.

## 1. JavaScript `fetch`

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Другие клиенты JavaScript: `axios`, `ofetch`, `jquery`, `xhr`. Для серверных аналогов Node используйте `node/fetch`, `node/axios`, `node/ofetch` или `node/undici`.

## 2. Python `requests`

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

Другие клиенты Python: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

## 3. cURL (shell)

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
  securityValues: { bearerAuth: "YOUR_ACCESS_TOKEN" },
});

console.log(code);
```

Другие клиенты shell: `wget` и `httpie`. Для загрузки `multipart/form-data` предпочтительнее `shell/curl` или `shell/httpie`, а не `shell/wget`.

## 4. Поиск и выбор генератора

Вызовите `list()`, чтобы узнать доступные генераторы, затем используйте выбранную пару:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const all = list();
console.log(all.length, "generators available");

const picked = all.find(
  (g) => g.language === "python" && g.client === "requests",
);

if (!picked) throw new Error("generator unavailable");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 5. Регистрация собственного генератора

Реализуйте интерфейс `Generator` и вызовите `register`:

```typescript
import { register, generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

register({
  language: "mylang",
  client: "my-client",
  generate(request: RequestIR): string {
    return [
      `// ${request.method} ${request.baseUrl}${request.path}`,
      `mylang.request(${JSON.stringify({
        method: request.method,
        url: request.baseUrl + request.path,
      })})`,
    ].join("\n");
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "mylang",
  client: "my-client",
});

console.log(code);
```

## 6. Использование плагина

Плагин объединяет регистрацию одного или нескольких генераторов через `use()`:

```typescript
import { use, generate } from "@powerduck/openapi-codegen";

use({
  name: "internal-generators",
  register(api) {
    api.register({
      language: "go",
      client: "our-wrapper",
      generate(request) {
        return `// go wrapper for ${request.method} ${request.path}`;
      },
    });
    api.register({
      language: "ruby",
      client: "our-wrapper",
      generate(request) {
        return `# ruby wrapper for ${request.method} ${request.path}`;
      },
    });
  },
});

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "go",
  client: "our-wrapper",
});
```

## 7. Генерация напрямую из `RequestIR`

Создайте `RequestIR` самостоятельно, чтобы полностью пропустить `normalize`:

```typescript
import { generate } from "@powerduck/openapi-codegen";
import type { RequestIR } from "@powerduck/openapi-codegen";

const request: RequestIR = {
  method: "GET",
  baseUrl: "https://api.example.com",
  path: "/users/{id}",
  parameters: [
    { name: "id", in: "path", value: 123 },
    { name: "limit", in: "query", value: 10, style: "form", explode: true },
  ],
  headers: [
    { name: "Accept", in: "header", value: "application/json" },
  ],
  body: undefined,
  security: [
    { name: "bearerAuth", type: "http", scheme: "bearer", value: "token-abc" },
  ],
};

const code = generate({
  request,
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

## 8. Обработка ошибок

`generate()` выбрасывает ошибки при отсутствии входных данных, неизвестных генераторах и неразрешённых ссылках. Всегда перехватывайте ошибки при обработке недоверенных данных:

```typescript
try {
  const code = generate({
    document,
    path: "/does-not-exist",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
}
```

Возможные сообщения: `Unsupported generator: ...`, `Path not found: ...` и `Operation not found: METHOD /path`.

## 9. Мягкий режим `$ref`

Если документ может содержать неверные или циклические ссылки, передайте `softRefMode: true`: разрешение продолжится с частичными результатами вместо выбрасывания ошибки:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "python",
  client: "requests",
  softRefMode: true,
});
```
