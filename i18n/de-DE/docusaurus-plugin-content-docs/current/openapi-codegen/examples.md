---
sidebar_position: 5
title: "Beispiele"
description: "Praxisbeispiele für @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, eigene Generatoren, Plugins und direkter RequestIR."
---

# Beispiele

Praxisbeispiele für `@powerduck/openapi-codegen`. Alle Beispiele setzen ein geparstes OpenAPI-Dokumentobjekt namens `document` voraus.

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

Weitere JavaScript-Clients: `axios`, `ofetch`, `jquery`, `xhr`. Für die entsprechenden serverseitigen Node-Varianten verwenden Sie `node/fetch`, `node/axios`, `node/ofetch` oder `node/undici`.

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

Weitere Python-Clients: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Weitere Shell-Clients: `wget` und `httpie`. Für Uploads mit `multipart/form-data` sind `shell/curl` oder `shell/httpie` gegenüber `shell/wget` vorzuziehen.

## 4. Generatoren suchen und auswählen

Mit `list()` ermitteln Sie die verfügbaren Generatoren und erzeugen anschließend Code mit dem gewählten Paar:

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

## 5. Eigenen Generator registrieren

Implementieren Sie die Schnittstelle `Generator` und rufen Sie `register` auf:

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

## 6. Plugin verwenden

Ein Plugin bündelt über `use()` die Registrierung eines oder mehrerer Generatoren:

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

## 7. Direkt aus einem `RequestIR` generieren

Erstellen Sie selbst einen `RequestIR`, um `normalize` vollständig zu umgehen:

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

## 8. Fehlerbehandlung

`generate()` löst bei fehlenden Eingaben, unbekannten Generatoren und nicht aufgelösten Referenzen Fehler aus. Fangen Sie diese beim Verarbeiten nicht vertrauenswürdiger Eingaben immer ab:

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

Mögliche Fehlermeldungen sind `Unsupported generator: ...` sowie `Path not found: ...` / `Operation not found: METHOD /path`.

## 9. Toleranter `$ref`-Modus

Kann ein Dokument defekte oder zyklische Referenzen enthalten, übergeben Sie `softRefMode: true`, damit die Auflösung mit Teilwerten fortfährt, statt einen Fehler auszulösen:

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
