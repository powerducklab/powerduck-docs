---
sidebar_position: 5
title: "Exemples"
description: "Exemples pratiques de @powerduck/openapi-codegen : JavaScript fetch, Python requests, cURL, générateurs personnalisés, plugins et RequestIR direct."
---

# Exemples

Exemples pratiques pour `@powerduck/openapi-codegen`. Tous supposent un objet document OpenAPI déjà analysé nommé `document`.

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

Autres clients JavaScript : `axios`, `ofetch`, `jquery`, `xhr`. Pour les équivalents Node côté serveur, utilisez `node/fetch`, `node/axios`, `node/ofetch` ou `node/undici`.

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

Autres clients Python : `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Autres clients shell : `wget` et `httpie`. Pour les téléversements `multipart/form-data`, préférez `shell/curl` ou `shell/httpie` à `shell/wget`.

## 4. Découvrir et choisir un générateur

Utilisez `list()` pour connaître les générateurs disponibles, puis générez avec la paire choisie :

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

## 5. Enregistrer un générateur personnalisé

Implémentez l’interface `Generator` et appelez `register` :

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

## 6. Utiliser un plugin

Un plugin regroupe l’enregistrement d’un ou plusieurs générateurs via `use()` :

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

## 7. Générer directement depuis un `RequestIR`

Évitez complètement `normalize` en construisant vous-même un `RequestIR` :

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

## 8. Gestion des erreurs

`generate()` lève une erreur pour les entrées manquantes, les générateurs inconnus et les références non résolues. Interceptez toujours les erreurs lorsque vous traitez des entrées non fiables :

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

Les messages possibles comprennent `Unsupported generator: ...` et `Path not found: ...` / `Operation not found: METHOD /path`.

## 9. Mode tolérant pour `$ref`

Si un document peut contenir des références cassées ou circulaires, passez `softRefMode: true` pour poursuivre la résolution avec des résultats partiels plutôt que lever une erreur :

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
