---
sidebar_position: 5
title: "Esempi"
description: "Esempi pratici di @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, generatori personalizzati, plugin e RequestIR diretto."
---

# Esempi

Esempi pratici di `@powerduck/openapi-codegen`. Tutti presuppongono un oggetto documento OpenAPI già analizzato chiamato `document`.

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

Altri client JavaScript: `axios`, `ofetch`, `jquery`, `xhr`. Per gli equivalenti Node lato server usa `node/fetch`, `node/axios`, `node/ofetch` o `node/undici`.

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

Altri client Python: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Altri client shell: `wget` e `httpie`. Per caricamenti `multipart/form-data`, preferisci `shell/curl` o `shell/httpie` a `shell/wget`.

## 4. Individuare e scegliere un generatore

Usa `list()` per scoprire i generatori disponibili, poi genera con la coppia scelta:

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

## 5. Registrare un generatore personalizzato

Implementa l'interfaccia `Generator` e chiama `register`:

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

## 6. Usare un plugin

Un plugin raggruppa la registrazione di uno o più generatori tramite `use()`:

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

## 7. Generare direttamente da un `RequestIR`

Crea un `RequestIR` per saltare completamente `normalize`:

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

## 8. Gestione degli errori

`generate()` genera errori per input mancanti, generatori sconosciuti e riferimenti non risolti. Intercetta sempre gli errori quando elabori input non attendibili:

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

I messaggi previsti includono `Unsupported generator: ...` e `Path not found: ...` / `Operation not found: METHOD /path`.

## 9. Modalità tollerante per `$ref`

Se un documento può contenere riferimenti interrotti o circolari, passa `softRefMode: true` per proseguire con risultati parziali invece di generare un errore:

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
