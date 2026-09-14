---
sidebar_position: 5
title: Examples
description: "Practical examples for @powerduck/openapi-codegen: JavaScript fetch, Python requests, cURL, custom generators, plugins, and direct RequestIR."
---

# Examples

Practical examples for `@powerduck/openapi-codegen`. All examples assume a
parsed OpenAPI document object named `document`.

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

Other JavaScript clients: `axios`, `ofetch`, `jquery`, `xhr`. For server-side
Node equivalents, use `node/fetch`, `node/axios`, `node/ofetch`, or
`node/undici`.

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

Other Python clients: `aiohttp`, `http-client`, `httpx-sync`, `httpx-async`.

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

Other shell clients: `wget` and `httpie`. For `multipart/form-data` uploads,
prefer `shell/curl` or `shell/httpie` over `shell/wget`.

## 4. Discover and pick a generator

Use `list()` to discover what is available, then generate with the chosen pair:

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

## 5. Register a custom generator

Implement the `Generator` interface and call `register`:

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

## 6. Use a plugin

A plugin bundles one or more generator registrations through `use()`:

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

## 7. Generate from a direct `RequestIR`

Skip `normalize` entirely by building a `RequestIR` yourself:

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

## 8. Error handling

`generate()` throws for missing input, unknown generators, and unresolved
references. Always wrap when processing untrusted input:

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

Expected error messages include `Unsupported generator: ...` and
`Path not found: ...` / `Operation not found: METHOD /path`.

## 9. Soft `$ref` mode

When a document may contain broken or circular references, pass
`softRefMode: true` so resolution degrades gracefully instead of throwing:

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
