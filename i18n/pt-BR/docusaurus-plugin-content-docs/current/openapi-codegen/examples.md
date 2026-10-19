---
sidebar_position: 5
title: "Exemplos"
description: "Exemplos práticos de @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, geradores personalizados, plugins e RequestIR direto."
---

# Exemplos

Exemplos práticos de `@powerduck/openapi-codegen`. Todos pressupõem um objeto de documento OpenAPI já analisado chamado `document`.

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

Outros clientes JavaScript: `axios`, `ofetch`, `jquery`, `xhr`. Para equivalentes Node no servidor, use `node/fetch`, `node/axios`, `node/ofetch` ou `node/undici`.

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

Outros clientes Python: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Outros clientes shell: `wget` e `httpie`. Para uploads `multipart/form-data`, prefira `shell/curl` ou `shell/httpie` a `shell/wget`.

## 4. Descobrir e escolher um gerador

Use `list()` para descobrir os geradores disponíveis e depois gere com o par escolhido:

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

## 5. Registrar um gerador personalizado

Implemente a interface `Generator` e chame `register`:

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

## 6. Usar um plugin

Um plugin reúne o registro de um ou mais geradores por meio de `use()`:

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

## 7. Gerar diretamente de um `RequestIR`

Crie um `RequestIR` para pular completamente `normalize`:

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

## 8. Tratamento de erros

`generate()` lança erros para entradas ausentes, geradores desconhecidos e referências não resolvidas. Sempre capture os erros ao processar entradas não confiáveis:

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

As mensagens possíveis incluem `Unsupported generator: ...` e `Path not found: ...` / `Operation not found: METHOD /path`.

## 9. Modo tolerante de `$ref`

Se o documento puder conter referências quebradas ou circulares, passe `softRefMode: true` para continuar com resultados parciais em vez de lançar um erro:

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
